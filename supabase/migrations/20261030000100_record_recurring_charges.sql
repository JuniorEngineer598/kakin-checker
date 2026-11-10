-- 目的:
-- 定期課金1件の未処理分を課金履歴へ追加し、
-- 次回課金日もまとめて更新する。
--
-- 日付計算はアプリ側で行う。
-- DB側では対象・入力を確認して保存する。
--
-- 履歴追加か次回日更新が失敗したら、
-- 今回の変更を取り消す。
--
-- 返り値:
-- 今回、実際に追加した課金履歴の件数。

begin;
create or replace function public.record_recurring_charges(
  p_recurring_charge_id uuid,
  p_expected_next_billing_date date,
  p_expected_updated_at timestamptz,
  p_charged_dates date[],
  p_next_billing_date date
)
returns integer
language plpgsql
security invoker
set search_path = ''

as $$
declare
  v_recurring public.recurring_charges%rowtype;
  v_inserted_count integer := 0;
  v_today date := (now() at time zone 'Asia/Tokyo')::date;
  v_expected_date date; -- 本来の課金日
  v_charged_date date;  -- 配列から取り出した課金日
  v_next_month_start date;    -- 翌月の1日
  v_next_month_last_day date; -- 翌月の末日

begin

  -- [1] 検証
  -- 対象・認証・状態・競合・入力値・請求間隔を確認する
  
  -- 本人の定期課金を取得して、変数に入れる
  select *
  into v_recurring
  from public.recurring_charges
  where id = p_recurring_charge_id
    and user_id = auth.uid()
  for update;

  -- 対象がなければ、エラーにして処理を止める
  if not found then
    raise exception '対象の定期課金が見つかりません';
  end if;

    -- 停止中なら、追加せずに終了する
  if v_recurring.status <> 'active' then
    return 0;
  end if;

  -- DBの現在の次回課金日・更新日時が、
  -- アプリの取得時（計算前）の値と違う場合は、追加せずに終了する
  if v_recurring.next_billing_date
       is distinct from p_expected_next_billing_date
     or v_recurring.updated_at
       is distinct from p_expected_updated_at then
    return 0;
  end if;

    -- 課金日の配列が未指定、または空ならエラーにする
  if p_charged_dates is null
     or cardinality(p_charged_dates) = 0 then
    raise exception '保存する課金日が指定されていません';
  end if;

  -- 更新用の次回課金日が未指定ならエラーにする
  if p_next_billing_date is null then
    raise exception '新しい次回課金日が指定されていません';
  end if;

    -- 保存する課金日の中に、未指定や範囲外の日付があれば止める
  if exists (
    select 1
    from unnest(p_charged_dates) as dates(charged_date)
    where charged_date is null
       or charged_date < v_recurring.next_billing_date
       or charged_date > v_today
  ) then
    raise exception '保存する課金日に、未指定または範囲外の日付があります';
  end if;

  -- 新しい次回課金日は、今日より後であること
  if p_next_billing_date <= v_today then
    raise exception '新しい次回課金日は、今日より後の日付が必要です';
  end if;

    -- 日数サイクルの検証ここから
  if v_recurring.billing_cycle = 'days' then
    if v_recurring.interval_days is null
       or v_recurring.interval_days <= 0 then
      raise exception '課金間隔の設定が不正です';
    end if;

    v_expected_date := v_recurring.next_billing_date;

    foreach v_charged_date in array p_charged_dates loop
      -- 本来の課金日と違えば止める
      if v_charged_date is distinct from v_expected_date then
        raise exception '課金日が設定された間隔と一致しません';
      end if;

      -- 次に確認する課金日へ進む
      v_expected_date :=
        v_expected_date + v_recurring.interval_days;
    end loop;

    -- 配列を確認し終えた後の日付「未来の課金日」が、新しい次回課金日と一致するか
    if p_next_billing_date is distinct from v_expected_date then
      raise exception '新しい次回課金日が課金間隔と一致しません';
    end if;
  end if;

    -- 月次サイクルの検証ここから
  if v_recurring.billing_cycle = 'monthly' then
    if v_recurring.billing_day is null
       or v_recurring.billing_day < 1
       or v_recurring.billing_day > 31 then
      raise exception '毎月の課金日の設定が不正です';
    end if;

    v_expected_date := v_recurring.next_billing_date;

    foreach v_charged_date in array p_charged_dates loop
      if v_charged_date is distinct from v_expected_date then
        raise exception '課金日が毎月の設定と一致しません';
      end if;

      -- 今の課金日の月を1日にそろえて、1か月足す
      v_next_month_start := (
        date_trunc('month', v_expected_date::timestamp)
        + interval '1 month'
      )::date;

      -- 翌月の1日にさらに1か月足して、1日戻すと翌月の末日になる
      v_next_month_last_day :=
        (v_next_month_start + interval '1 month')::date - 1;

      -- 指定日が存在しない月は、月末日に合わせる
      v_expected_date := v_next_month_start + (
        least(
          v_recurring.billing_day,
          extract(day from v_next_month_last_day)::integer
        ) - 1
      );
    end loop;

    --配列を確認し終えた後の日付「未来の課金日」が、新しい次回課金日と一致するか
    if p_next_billing_date is distinct from v_expected_date then
      raise exception '新しい次回課金日が毎月の設定と一致しません';
    end if;
  end if;


  -- [2] 保存と更新ここから
  -- 課金日ごとに、定期課金の情報を使って履歴を保存する
 insert into public.charges (
    user_id,
    app_id,
    recurring_charge_id,
    item_name,
    amount,
    category,
    charged_at
  )
  select
    v_recurring.user_id,
    v_recurring.app_id,
    v_recurring.id,
    v_recurring.item_name,
    v_recurring.amount,
    v_recurring.category,
    dates.charged_date
  from unnest(p_charged_dates) as dates(charged_date)
  where true
  on conflict (recurring_charge_id, charged_at) do nothing;

  -- 今回、実際に追加できた件数を変数に入れる
  get diagnostics v_inserted_count = row_count;


    -- 対象の定期課金の、次回課金日と更新日時を更新する
  update public.recurring_charges
  set
    next_billing_date = p_next_billing_date,
    updated_at = now()
  where id = v_recurring.id
    and user_id = auth.uid();

  -- 対象の行を更新できなかった場合は、エラーで止める
  if not found then
    raise exception '定期課金の次回課金日を更新できませんでした';
  end if;

  -- 今回、実際に追加した課金履歴の件数を返す
  -- ============================================================
  return v_inserted_count;
end;
$$;


-- [3] 権限設定ここから
-- 関数の実行権限を設定する

-- 全ユーザー共通・未ログイン向けの実行許可を外す
revoke execute on function public.record_recurring_charges(
  uuid, date, timestamptz, date[], date
) from public, anon;

-- ログイン済みユーザーに実行を許可する
grant execute on function public.record_recurring_charges(
  uuid, date, timestamptz, date[], date
) to authenticated;

commit;
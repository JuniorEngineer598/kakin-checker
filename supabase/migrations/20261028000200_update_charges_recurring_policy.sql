-- 定期課金IDを指定する場合、
-- 本人の定期課金かつ同じアプリであることを確認する。

alter policy "Users can manage own charges"
on public.charges
with check (
  (select auth.uid()) = user_id

  -- 対象アプリが本人のもの
  and exists (
    select 1
    from public.apps
    where apps.id = charges.app_id
      and apps.user_id = (select auth.uid())
  )

  -- 手入力は許可。定期課金IDがあれば関連付けを確認
  and (
    charges.recurring_charge_id is null
    or exists (
      select 1
      from public.recurring_charges
      where recurring_charges.id = charges.recurring_charge_id
        and recurring_charges.user_id = (select auth.uid())
        and recurring_charges.app_id = charges.app_id
    )
  )
);
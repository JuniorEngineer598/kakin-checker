-- 目的:
-- 課金履歴に元の定期課金IDを保存し、二重登録を防ぐ。
--
-- 前提:
-- chargesとrecurring_chargesテーブルが存在する。
--
-- 適用状況:
-- 現在のSupabaseにはSQL Editorから適用済み。
-- 同じDBには再実行しない。
-- CLIによる適用履歴の管理はまだ導入していない。

begin;

-- 定期課金を削除しても、課金履歴は残す。
alter table public.charges
add column recurring_charge_id uuid
references public.recurring_charges(id)
on delete set null;

-- 同じ定期課金・同じ課金日の重複を防ぐ。
alter table public.charges
add constraint charges_recurring_charge_date_unique
unique (recurring_charge_id, charged_at);

commit;
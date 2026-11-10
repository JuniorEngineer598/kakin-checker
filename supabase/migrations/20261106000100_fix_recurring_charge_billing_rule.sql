begin;

-- 定期課金の請求ルール制約を修正する
-- 月次の場合は billing_day を必須にする
alter table public.recurring_charges
drop constraint if exists recurring_charges_billing_rule_check;

alter table public.recurring_charges
add constraint recurring_charges_billing_rule_check
check (
  (
    billing_cycle = 'days'
    and interval_days is not null
    and interval_days > 0
    and billing_day is null
  )
  or
  (
    billing_cycle = 'monthly'
    and interval_days is null
    and billing_day is not null
    and billing_day between 1 and 31
  )
);

commit;

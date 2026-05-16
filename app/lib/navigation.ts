import { BarChart3, CalendarDays, FileText, Gamepad2, House, PlusCircle, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const sidebarItems: SidebarItem[] = [
  { label: 'ホーム', href: '/dashboard', icon: House },
  { label: '課金追加', href: '/dashboard/charges/new', icon: PlusCircle },
  { label: '課金履歴', href: '/dashboard/charges-history', icon: FileText },
  { label: 'ゲーム追加', href: '/dashboard/games', icon: Gamepad2 },
  { label: '分析', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'カレンダー', href: '/dashboard/calendar', icon: CalendarDays },
  { label: '設定', href: '/dashboard/settings', icon: Settings },
];

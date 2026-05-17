import { getDefaultGameIconView } from '../lib/gameIcons';
import type { GameIcon } from '../lib/types';

type GameIconViewProps = {
  icon: GameIcon;
  className?: string;
  iconClassName?: string;
};

// ゲームアイコンの表示コンポーネント
export default function GameIconView({ icon, className = '', iconClassName = '' }: GameIconViewProps) {
  // アップロードされたアイコンの場合は画像を表示
  if (icon.type === 'upload') {
    return (
      <div className={`flex items-center justify-center overflow-hidden rounded-xl ring-1 ring-slate-200 ${className}`}>
        <img src={icon.imageUrl} alt="" className={`h-full w-full object-cover ${iconClassName}`} aria-hidden="true" />
      </div>
    );
  }

  //キーに対応するデフォルトアイコンの表示情報を取得
  const iconView = getDefaultGameIconView(icon.key);
  const Icon = iconView.icon;

  return (
    // デフォルトアイコンの対応するアイコンとスタイルを表示
    <div className={`flex items-center justify-center rounded-xl ring-1 ${iconView.className} ${className}`}>
      <Icon className={iconClassName} aria-hidden="true" />
    </div>
  );
}

//({ icon, className = '', iconClassName = '' }: GameIconViewProps)外側の箱を大きくする → className、アイコン自体を大きくする → iconClassName
// 画面ごとにデザインを変えるために、外側の箱とアイコン自体の両方にクラス名を渡せるようにしています。
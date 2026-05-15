const settings = [
  { title: 'データリセット', body: '登録データを初期状態に戻すための操作を配置予定です。' },
  { title: 'テーマ設定', body: 'ライトテーマとダークテーマの切り替えを追加予定です。' },
  { title: 'エクスポート予定', body: 'CSVやJSONで課金履歴を書き出す機能を追加予定です。' },
  { title: 'ログアウト', body: 'アカウント機能を追加した後に利用できるようにする予定です。' },
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-500">Settings</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">設定</h1>
        </div>

        <section className="grid gap-4">
          {settings.map((item) => (
            <article key={item.title} className="rounded-[24px] bg-white p-5 shadow-[0_18px_60px_-38px_rgba(15,23,42,0.24)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{item.body}</p>
                </div>
                <button
                  type="button"
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                  準備中
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

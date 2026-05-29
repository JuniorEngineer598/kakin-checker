"use client";

import {
  AppWindow,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Plus,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { formatCurrency } from "../../lib/format";
import { createApp, deleteApp, fetchApps, updateApp } from "../../lib/apps";
import { fetchCharges } from "../../lib/charges";
import type {
  App,
  AppIcon,
  ChargeRecord,
  DefaultAppIconKey,
} from "../../lib/types";
import {
  defaultAppIconKeys,
  getNextDefaultAppIconKey,
} from "../../lib/appIcons";
import { uploadAppIcon, deleteAppIcon } from "../../lib/appIconsStorage";
import AppIconView from "../../components/AppIconView";
import PageBackground from "../../components/PageBackground";

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [charges, setCharges] = useState<ChargeRecord[]>([]);
  const [appName, setAppName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAppMenuId, setOpenAppMenuId] = useState<string | null>(null);
  const [appNameError, setAppNameError] = useState("");
  const [editAppId, setEditAppId] = useState<string | null>(null);
  const [editAppName, setEditAppName] = useState("");
  const [editAppNameError, setEditAppNameError] = useState("");
  const [editIconTab, setEditIconTab] = useState<"upload" | "default">(
    "upload",
  );
  const [editIconFile, setEditIconFile] = useState<File | null>(null);
  const [editIconPreviewUrl, setEditIconPreviewUrl] = useState("");
  const [editIconFileError, setEditIconFileError] = useState("");
  const [selectedDefaultIconIndex, setSelectedDefaultIconIndex] = useState(0);
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [selectedIconPreviewUrl, setSelectedIconPreviewUrl] = useState("");
  const [iconFileError, setIconFileError] = useState("");

  //登録されているアプリと課金履歴を両方まとめて取得する
  useEffect(() => {
    async function loadInitialData() {
      try {
        const apps = await fetchApps();
        const charges = await fetchCharges();
        setApps(apps);
        setCharges(charges);
      } catch {
        // 後でエラー表示を足す
      }
    }

    loadInitialData();
  }, []);

  //プレビュー画像を表示するための処理。selectedIconFileが変わるたびに一時URLを消す
  useEffect(() => {
    if (!selectedIconFile) {
      setSelectedIconPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedIconFile);
    setSelectedIconPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl); //作った一時URLを不要になったタイミング破棄
    };
  }, [selectedIconFile]);

  //編集用アイコンファイルのプレビュー表示のための処理
  useEffect(() => {
    if (!editIconFile) {
      setEditIconPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(editIconFile);
    setEditIconPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [editIconFile]);

  // アイコンファイルが選択されたときの処理
  function handleIconFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setSelectedIconFile(null);
      setIconFileError("JPGまたはPNG画像を選択してください");
      event.target.value = "";
      return;
    }

    setSelectedIconFile(file);
    setIconFileError("");
  }

  // 編集用アイコンファイルが選択されたときの処理
  function handleEditIconFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setEditIconFile(null);
      setEditIconFileError("JPGまたはPNG画像を選択してください");
      event.target.value = "";
      return;
    }

    setEditIconFile(file);
    setEditIconFileError("");
  }
  //
  function getDefaultIconIndex(icon: AppIcon) {
    if (icon.type !== "default") {
      return 0;
    }

    const index = defaultAppIconKeys.indexOf(icon.key); //ない場合は-1が返る
    return index >= 0 ? index : 0; //アイコンキーが見つからない場合の-1の対策として、0を返す
  }
  //標準アイコンの前へ/次へ関数
  function selectPreviousDefaultIcon() {
    setSelectedDefaultIconIndex((current) =>
      current === 0 ? defaultAppIconKeys.length - 1 : current - 1,
    );
  }

  function selectNextDefaultIcon() {
    setSelectedDefaultIconIndex((current) =>
      current === defaultAppIconKeys.length - 1 ? 0 : current + 1,
    );
  }

  // アプリ追加モーダルを閉じる
  function closeAddModal() {
    setIsModalOpen(false);
    setAppName("");
    setAppNameError("");
    setSelectedIconFile(null);
    setIconFileError("");
  }

  // 新しいアプリを追加する処理
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = appName.trim();

    if (!trimmedName) {
      setAppNameError("※アプリ名を入力してください");
      return;
    }

    const existsApp = apps.find((app) => app.name === trimmedName);

    if (existsApp) {
      setAppNameError("※同じ名前のアプリが既に存在しています");
      return;
    }

    try {
      const newAppIcon = selectedIconFile
        ? {
            type: "upload" as const,
            imageUrl: await uploadAppIcon(selectedIconFile),
          }
        : {
            type: "default" as const,
            key: getNextDefaultAppIconKey(apps.length),
          };

      const newApp = await createApp(trimmedName, newAppIcon);

      setApps((current) => [...current, newApp]);
      closeAddModal();
      setOpenAppMenuId(null);
    } catch {
      setAppNameError("※アプリの追加に失敗しました");
    }
  }

  // アプリを削除する処理
  async function handleDeleteApp(appId: string) {
    const deleteTargetApp = apps.find((app) => app.id === appId);

    if (!deleteTargetApp) {
      return;
    }

    const ok = window.confirm(
      "このアプリを本当に削除しますか？\n※このアプリの課金履歴とテンプレートも削除されます",
    );

    if (!ok) return;

    try {
      await deleteApp(appId);

      setApps((current) => current.filter((app) => app.id !== appId));
      setOpenAppMenuId(null);
    } catch {
      window.alert("アプリの削除に失敗しました");
      return;
    }

    if (deleteTargetApp.icon.type === "upload") {
      try {
        await deleteAppIcon(deleteTargetApp.icon.imageUrl);
      } catch (error) {
        console.error("アイコン画像の削除に失敗しました", error);
      }
    }
  }

  // アプリ編集モーダルを開く処理
  function openEditModal(app: App) {
    setEditAppId(app.id);
    setEditAppName(app.name);
    setEditAppNameError("");

    setEditIconTab("upload");
    setEditIconFile(null);
    setEditIconFileError("");
    setSelectedDefaultIconIndex(getDefaultIconIndex(app.icon));

    setOpenAppMenuId(null);
  }

  // アプリ編集モーダルを閉じる処理
  function closeEditModal() {
    setEditAppId(null);
    setEditAppName("");
    setEditAppNameError("");

    setEditIconTab("upload");
    setEditIconFile(null);
    setEditIconFileError("");
    setSelectedDefaultIconIndex(0);
  }

  // アプリ名とアイコンを編集して保存する処理
  async function handleEditSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = editAppName.trim();

    if (!trimmedName) {
      setEditAppNameError("※アプリ名を入力してください");
      return;
    }

    const existsApp = apps.find(
      (app) => app.id !== editAppId && app.name === trimmedName,
    );

    if (existsApp) {
      setEditAppNameError("※同じ名前のアプリが既に存在しています");
      return;
    }

    if (!editAppId || !editingApp) {
      return;
    }

    let oldIconUrlToDelete: string | null = null;
    let uploadedIconUrlToDeleteOnError: string | null = null;
    
    //編集内容に応じて、名前・画像・標準アイコンの更新処理を分岐する
    try {
      let updatedApp: App;

      // 標準アイコンに変更する場合
      if (editIconTab === "default") {
        updatedApp = await updateApp(editAppId, {
          name: trimmedName,
          icon: {
            type: "default",
            key: selectedDefaultIconKey,
          },
        });

        //古い画像URLを保存「後で消去」
        if (editingApp.icon.type === "upload") {
          oldIconUrlToDelete = editingApp.icon.imageUrl;
        }
        // 新しく選択した画像に変更する場合
      } else if (editIconFile) {
        const uploadedIconUrl = await uploadAppIcon(editIconFile);
        uploadedIconUrlToDeleteOnError = uploadedIconUrl;//DB更新失敗時に削除する

        updatedApp = await updateApp(editAppId, {
          name: trimmedName,
          icon: {
            type: "upload",
            imageUrl: uploadedIconUrl,
          },
        });

        uploadedIconUrlToDeleteOnError = null;

        if (editingApp.icon.type === "upload") {
          oldIconUrlToDelete = editingApp.icon.imageUrl;
        }
        // アイコンは変更せず、アプリ名だけ更新する場合
      } else {
        updatedApp = await updateApp(editAppId, {
          name: trimmedName,
        });
      }

      setApps((current) =>
        current.map((app) => {
          if (app.id === editAppId) {
            return updatedApp;
          }

          return app;
        }),
      );

      closeEditModal();
    } catch {
      if (uploadedIconUrlToDeleteOnError) {
        try {
          await deleteAppIcon(uploadedIconUrlToDeleteOnError);
        } catch (error) {
          console.error(
            "更新失敗後の新しいアイコン画像削除に失敗しました",
            error,
          );
        }
      }

      setEditAppNameError("※アプリ情報の更新に失敗しました");
      return;
    }

    //古いアイコン画像あれば削除する
    if (oldIconUrlToDelete) {
      try {
        await deleteAppIcon(oldIconUrlToDelete);
      } catch (error) {
        console.error("古いアイコン画像の削除に失敗しました", error);
      }
    }
  }

  // アプリごとの総課金額を計算
  function getAppTotalAmount(appId: string) {
    return charges
      .filter((charge) => charge.appId === appId)
      .reduce((total, charge) => total + charge.amount, 0);
  }

  const editingApp = apps.find((app) => app.id === editAppId) ?? null;
  //選択中の標準アイコンキーを取得する
  const selectedDefaultIconKey: DefaultAppIconKey =
    defaultAppIconKeys[selectedDefaultIconIndex];

  const editPreviewIcon: AppIcon =
    editIconTab === "default"
      ? {
          type: "default",
          key: selectedDefaultIconKey,
        }
      : editIconFile && editIconPreviewUrl
        ? {
            type: "upload",
            imageUrl: editIconPreviewUrl,
          }
        : (editingApp?.icon ?? {
            type: "default",
            key: "gamepad",
          });

  return (
    <PageBackground className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
            <AppWindow size={22} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950">アプリ追加</h1>
        </div>

        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950">登録済みのアプリ</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
          >
            <Plus size={19} strokeWidth={2.3} aria-hidden="true" />
            追加
          </button>
        </div>

        <section className="overflow-visible rounded-[28px] bg-white px-3 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:px-6 md:overflow-hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_72px_40px_36px] items-center gap-3 border-b border-slate-200 px-1 py-4 text-[11px] font-bold text-slate-500 sm:grid-cols-[minmax(0,1fr)_88px_48px_40px] sm:gap-4 sm:px-2 md:hidden">
            <div className="flex items-center gap-2">
              <AppWindow size={14} strokeWidth={2.2} aria-hidden="true" />
              アプリ
            </div>
            <div className="justify-self-end">総課金額</div>
            <div className="justify-self-center">登録</div>
            <div className="justify-self-end">操作</div>
          </div>

          <div className="hidden grid-cols-[minmax(0,1.2fr)_160px_160px_120px] border-b border-slate-200 px-2 py-5 text-sm font-bold text-slate-500 md:grid">
            <div className="flex items-center gap-3">
              <AppWindow size={18} strokeWidth={2.2} aria-hidden="true" />
              アプリ名
            </div>
            <div>総課金額</div>
            <div>登録状況</div>
            <div>操作</div>
          </div>

          <div>
            {apps.map((app) => {
              return (
                <article
                  key={app.id}
                  className="grid grid-cols-[minmax(0,1fr)_72px_40px_36px] items-center gap-3 border-b border-slate-200 px-1 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_88px_48px_40px] sm:gap-4 sm:px-2 md:grid-cols-[minmax(0,1.2fr)_160px_160px_120px] md:gap-0 md:py-5"
                >
                  <div className="flex min-w-0 items-center gap-3 md:gap-5">
                    <AppIconView
                      icon={app.icon}
                      className="h-11 w-11 shrink-0 md:h-14 md:w-14"
                    />
                    <p className="min-w-0 truncate text-sm font-bold text-slate-950 sm:text-base md:text-lg">
                      {app.name}
                    </p>
                  </div>

                  <p className="justify-self-end text-right text-sm font-bold text-slate-900 sm:text-base md:justify-self-auto md:text-left">
                    {formatCurrency(getAppTotalAmount(app.id))}
                  </p>

                  <div className="flex justify-center justify-self-center md:block md:justify-self-auto">
                    <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 md:inline-flex">
                      <CheckCircle2
                        size={15}
                        strokeWidth={2.4}
                        className="text-emerald-500"
                        aria-hidden="true"
                      />
                      登録済み
                    </span>
                    <CheckCircle2
                      size={20}
                      strokeWidth={2.4}
                      className="text-emerald-500 md:hidden"
                      aria-label="登録済み"
                    />
                  </div>

                  <div className="relative w-fit justify-self-end md:justify-self-auto">
                    <button
                      type="button"
                      title="メニュー"
                      aria-label={`${app.name}のメニュー`}
                      aria-expanded={openAppMenuId === app.id}
                      onClick={() => {
                        setOpenAppMenuId((current) =>
                          current === app.id ? null : app.id,
                        );
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                    >
                      <EllipsisVertical
                        size={19}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </button>

                    {openAppMenuId === app.id ? (
                      <div className="absolute right-0 top-11 z-10 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]">
                        <button
                          type="button"
                          onClick={() => openEditModal(app)}
                          className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          編集
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteApp(app.id)}
                          className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                        >
                          消去
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="px-2 py-5 text-center text-sm font-bold text-slate-600">
            合計 {apps.length} 件
          </div>
        </section>

        {isModalOpen ? (
          <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 pb-4 pt-20 backdrop-blur-[2px] sm:items-center sm:py-6">
            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100dvh-96px)] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-4 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)] sm:max-h-[calc(100dvh-48px)] sm:rounded-[28px] sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  アプリを追加
                </h2>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="text-slate-500 transition hover:text-slate-950"
                  aria-label="閉じる"
                >
                  <X size={24} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>

              <label className="mt-6 block sm:mt-8">
                <span className="text-sm font-bold text-slate-700">
                  アプリ名
                </span>
                <input
                  type="text"
                  name="appName"
                  value={appName}
                  onChange={(event) => {
                    setAppName(event.target.value);
                    setAppNameError("");
                  }}
                  placeholder="例: スターレイル"
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
                {appNameError && (
                  <p className="mt-2 text-sm font-bold text-rose-600">
                    {appNameError}
                  </p>
                )}
              </label>

              <div className="mt-6 sm:mt-7">
                <p className="text-sm font-bold text-slate-700">アイコン画像</p>
                <div className="mt-3 grid grid-cols-[minmax(0,7fr)_minmax(88px,3fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_112px] sm:gap-4">
                  <label className="flex min-h-[112px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-3 text-center transition hover:border-slate-400 hover:bg-slate-50 sm:min-h-[170px] sm:rounded-2xl sm:px-5">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleIconFileChange}
                      className="sr-only"
                    />

                    <UploadCloud
                      size={28}
                      strokeWidth={2}
                      className="text-slate-600 sm:h-[34px] sm:w-[34px]"
                      aria-hidden="true"
                    />

                    <span className="mt-2 max-w-full truncate text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                      {selectedIconFile
                        ? selectedIconFile.name
                        : "画像をアップロード"}
                    </span>

                    <span className="mt-1 text-[10px] font-semibold text-slate-400 sm:mt-2 sm:text-xs">
                      JPG, PNG
                    </span>
                  </label>

                  <div className="flex flex-col items-center gap-3">
                    <div className="aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-white sm:h-28 sm:w-28 sm:rounded-2xl">
                      {selectedIconPreviewUrl ? (
                        <img
                          src={selectedIconPreviewUrl}
                          alt="選択したアプリアイコンのプレビュー"
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <p className="text-xs font-semibold text-slate-500">
                      プレビュー
                    </p>
                  </div>
                </div>
                {iconFileError ? (
                  <p className="mt-2 text-xs font-bold text-rose-600">
                    {iconFileError}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex justify-end gap-3 sm:mt-8">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-slate-950 px-10 text-sm font-bold text-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        ) : null}
        {editAppId ? (
          <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 pb-4 pt-20 backdrop-blur-[2px] sm:items-center sm:py-6">
            <form
              onSubmit={handleEditSubmit}
              className="max-h-[calc(100dvh-96px)] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-4 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)] sm:max-h-[calc(100dvh-48px)] sm:rounded-[28px] sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  アプリ名を編集
                </h2>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-slate-500 transition hover:text-slate-950"
                  aria-label="閉じる"
                >
                  <X size={24} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>

              <label className="mt-6 block sm:mt-8">
                <span className="text-sm font-bold text-slate-700">
                  アプリ名
                </span>
                <input
                  type="text"
                  value={editAppName}
                  onChange={(event) => {
                    setEditAppName(event.target.value);
                    setEditAppNameError("");
                  }}
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
                {editAppNameError ? (
                  <p className="mt-2 text-sm font-bold text-rose-600">
                    {editAppNameError}
                  </p>
                ) : null}
              </label>
              <div className="mt-6 sm:mt-7">
                <p className="text-sm font-bold text-slate-700">アイコン画像</p>

                <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700">
                  <button
                    type="button"
                    onClick={() => setEditIconTab("upload")}
                    className={`h-11 transition ${
                      editIconTab === "upload"
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    画像アップロード
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditIconTab("default");
                      setEditIconFile(null);
                      setEditIconFileError("");
                    }}
                    className={`h-11 border-l border-slate-200 transition ${
                      editIconTab === "default"
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    標準アイコン
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-[minmax(0,7fr)_minmax(88px,3fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_112px] sm:gap-4">
                  {editIconTab === "upload" ? (
                    <label className="flex min-h-[112px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-3 text-center transition hover:border-slate-400 hover:bg-slate-50 sm:min-h-[170px] sm:rounded-2xl sm:px-5">
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleEditIconFileChange}
                        className="sr-only"
                      />

                      <UploadCloud
                        size={28}
                        strokeWidth={2}
                        className="text-slate-600 sm:h-[34px] sm:w-[34px]"
                        aria-hidden="true"
                      />

                      <span className="mt-2 max-w-full truncate text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                        {editIconFile
                          ? editIconFile.name
                          : "画像をアップロード"}
                      </span>

                      <span className="mt-1 text-[10px] font-semibold text-slate-400 sm:mt-2 sm:text-xs">
                        JPG, PNG
                      </span>
                    </label>
                  ) : (
                    <div className="flex min-h-[112px] items-center justify-center gap-8 rounded-xl border border-dashed border-slate-300 bg-white px-3 sm:min-h-[170px] sm:rounded-2xl">
                      <button
                        type="button"
                        onClick={selectPreviousDefaultIcon}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-[0_14px_35px_-24px_rgba(15,23,42,0.6)] ring-1 ring-slate-200 transition hover:bg-slate-50"
                        aria-label="前の標準アイコン"
                      >
                        <ChevronLeft
                          size={24}
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                      </button>

                      <p className="min-w-16 text-center text-lg font-bold text-slate-950">
                        {selectedDefaultIconIndex + 1} /{" "}
                        {defaultAppIconKeys.length}
                      </p>

                      <button
                        type="button"
                        onClick={selectNextDefaultIcon}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-[0_14px_35px_-24px_rgba(15,23,42,0.6)] ring-1 ring-slate-200 transition hover:bg-slate-50"
                        aria-label="次の標準アイコン"
                      >
                        <ChevronRight
                          size={24}
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-3">
                    <div className="aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-white sm:h-28 sm:w-28 sm:rounded-2xl">
                      <AppIconView
                        icon={editPreviewIcon}
                        className="h-full w-full rounded-none ring-0"
                      />
                    </div>

                    <p className="text-xs font-semibold text-slate-500">
                      プレビュー
                    </p>
                  </div>
                </div>

                {editIconFileError ? (
                  <p className="mt-2 text-xs font-bold text-rose-600">
                    {editIconFileError}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex justify-end gap-3 sm:mt-8">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-slate-950 px-10 text-sm font-bold text-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </PageBackground>
  );
}

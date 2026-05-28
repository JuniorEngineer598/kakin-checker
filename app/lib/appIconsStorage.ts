import { createClient } from "./supabase/client";
import { getCurrentUserId } from "./auth-user";

const APP_ICONS_BUCKET = "app-icons";

//画像ファイルをStorageにアップロードしてURLを返す
export async function uploadAppIcon(file: File) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  // 拡張子をファイル名から取り出す
  const fileExtension = file.name.split(".").pop();

  // 毎回違うファイル名にして、ブラウザキャッシュや上書き事故を避ける
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;

  // StorageのRLSで userId フォルダだけ許可しているので、この形にする
  const filePath = `${userId}/${fileName}`;

  // Supabase Storageに画像をアップロードする
  const { error } = await supabase.storage
    .from(APP_ICONS_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Public bucketなので、アップロードした画像の公開URLを取得する
  const {
    data: { publicUrl },
  } = supabase.storage.from(APP_ICONS_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}

// Storageから画像を削除する
export async function deleteAppIcon(iconUrl: string) {
  const supabase = createClient();

  const marker = `/storage/v1/object/public/${APP_ICONS_BUCKET}/`;
  const filePath = iconUrl.split(marker)[1];//markerでURLを分割して、後半部分がStorage内のファイルパスになる想定

  if (!filePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(APP_ICONS_BUCKET)
    .remove([filePath]);

  if (error) {
    throw error;
  }
}
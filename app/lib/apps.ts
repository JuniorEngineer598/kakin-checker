import { createClient } from "./supabase/client";
import type { App, DefaultAppIconKey } from "./types";
import { getCurrentUserId } from "./auth-user";

type AppRow = {
  id: string;
  user_id: string;
  name: string;
  icon_type: "default" | "upload";
  icon_key: string | null;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
};

//DBから取得したAppRowを、フロントエンドで使用するApp型に変換する関数
function toApp(row: AppRow): App {
  return {
    id: row.id,
    name: row.name,
    icon:
      row.icon_type === "upload" && row.icon_url
        ? {
            type: "upload",
            imageUrl: row.icon_url,
          }
        : {
            type: "default",
            key: (row.icon_key ?? "gamepad") as DefaultAppIconKey,
          },
    createdAt: row.created_at,
  };
}

type AppIconInput =
  | {
      type: "default";
      key: DefaultAppIconKey;
    }
  | {
      type: "upload";
      imageUrl: string;
    };

export async function fetchApps() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => toApp(row as AppRow));
}

//appsテーブルにアプリ情報を保存する
export async function createApp(name: string, icon: AppIconInput) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const iconValues =
    icon.type === "upload"
      ? {
          icon_type: "upload",
          icon_key: null,
          icon_url: icon.imageUrl,
        }
      : {
          icon_type: "default",
          icon_key: icon.key,
          icon_url: null,
        };

  const { data, error } = await supabase
    .from("apps")
    .insert({
      user_id: userId,
      name,
      ...iconValues,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toApp(data as AppRow);
}

type UpdateAppInput = {
  name: string;
  icon?: AppIconInput;
};

export async function updateApp(appId: string, input: UpdateAppInput) {
  const supabase = createClient();

  const iconValues =
    input.icon === undefined
      ? {}
      : input.icon.type === "upload"
        ? {
            icon_type: "upload",
            icon_key: null,
            icon_url: input.icon.imageUrl,
          }
        : {
            icon_type: "default",
            icon_key: input.icon.key,
            icon_url: null,
          };

  const { data, error } = await supabase
    .from("apps")
    .update({
      name: input.name,
      ...iconValues,
      updated_at: new Date().toISOString(),
    })
    .eq("id", appId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toApp(data as AppRow);
}

export async function deleteApp(appId: string) {
  const supabase = createClient();

  const { error } = await supabase.from("apps").delete().eq("id", appId);

  if (error) {
    throw error;
  }
}

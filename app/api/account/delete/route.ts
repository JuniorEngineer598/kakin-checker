import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { createAdminClient } from "../../../lib/supabase/admin";

export async function DELETE() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { message: "ログインが必要です" },
      { status: 401 },
    );
  }

  const adminClient = createAdminClient();

   //Storage画像を先に削除する
  const { data: files, error: listError } = await adminClient.storage
    .from("app-icons")
    .list(user.id);

  if (listError) {
    return NextResponse.json(
      { message: "画像一覧の取得に失敗しました" },
      { status: 500 },
    );
  }

  if (files.length > 0) {
    const filePaths = files.map((file) => `${user.id}/${file.name}`);

    const { error: removeError } = await adminClient.storage
      .from("app-icons")
      .remove(filePaths);

    if (removeError) {
      return NextResponse.json(
        { message: "画像の削除に失敗しました" },
        { status: 500 },
      );
    }
  }


  // 最後にAuthユーザーを削除
  const { error: deleteUserError } =
    await adminClient.auth.admin.deleteUser(user.id);

  if (deleteUserError) {
    return NextResponse.json(
      { message: "アカウントの削除に失敗しました" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
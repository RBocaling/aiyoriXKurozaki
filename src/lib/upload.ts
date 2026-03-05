import { supabase } from "./supabase";

export async function uploadFile(file: File, folder: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from("members-media")
    .upload(filePath, file);

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage
    .from("members-media")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

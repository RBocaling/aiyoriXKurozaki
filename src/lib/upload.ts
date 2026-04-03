import { uploadFileAPI } from "@/api/member.api";

export async function uploadFile(file: File): Promise<string | null> {
  try {
    const url = await uploadFileAPI(file);
    return url;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

import { supabase } from "@/lib/supabase";

export async function uploadRoomImage(
  file: File,
  roomId: string
): Promise<string> {
  try {
    console.log("🟢 [uploadRoomImage] Start");
    console.log("📦 File:", file);
    console.log("🏷 Room ID:", roomId);

    const fileExt = file.name.split(".").pop();
    const filePath = `room-${roomId}.${fileExt}`;

    console.log("📁 Upload path:", filePath);

    const { error } = await supabase.storage
      .from("room-images-public")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error("🔴 Upload failed:", error);
      throw error;
    }

    console.log("✅ Upload successful");

    const { data } = supabase.storage
      .from("room-images-public")
      .getPublicUrl(filePath);

    console.log("🌐 Public URL:", data.publicUrl);

    return data.publicUrl;
  } catch (err) {
    console.error("❌ uploadRoomImage crashed:", err);
    throw err;
  }
}

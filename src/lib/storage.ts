import { supabase } from "@/integrations/supabase/client";

/** Storage bucket for optional customer photo uploads from the request form. */
const BUCKET = "request-uploads";

export const MAX_REQUEST_IMAGES = 10;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB (matches the bucket limit)
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
];

/** True if a File is an image within the size/type limits we accept. */
export function isAcceptableImage(file: File): boolean {
  const typeOk = file.type ? ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase()) : true;
  return typeOk && file.size > 0 && file.size <= MAX_IMAGE_BYTES;
}

function extFor(file: File): string {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() ?? "" : "";
  const ext = fromName.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (ext) return ext;
  const fromType = (file.type.split("/").pop() ?? "").replace(/[^a-z0-9]/g, "");
  return fromType || "jpg";
}

/**
 * Uploads the given image files to the public `request-uploads` bucket under a
 * fresh random folder and returns the resulting public URLs. Best-effort: any
 * file that fails to upload is counted in `failed` and simply omitted (photos
 * are optional, so a partial failure must not block the request).
 */
export async function uploadRequestImages(
  files: File[],
): Promise<{ urls: string[]; failed: number }> {
  if (!files.length) return { urls: [], failed: 0 };
  const folder = crypto.randomUUID();

  const results = await Promise.allSettled(
    files.map(async (file, i) => {
      const path = `${folder}/${i + 1}-${Date.now()}.${extFor(file)}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      if (!data?.publicUrl) throw new Error("no public url");
      return data.publicUrl;
    }),
  );

  const urls: string[] = [];
  let failed = 0;
  for (const r of results) {
    if (r.status === "fulfilled") urls.push(r.value);
    else failed += 1;
  }
  return { urls, failed };
}

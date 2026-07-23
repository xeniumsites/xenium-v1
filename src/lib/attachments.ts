export const MAX_REQUEST_IMAGES = 10;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB per file
export const MAX_TOTAL_ATTACHMENT_BYTES = 15 * 1024 * 1024; // 15 MB total (email-safe)
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
];

/** True if a File is an image within the per-file size/type limits. */
export function isAcceptableImage(file: File): boolean {
  const typeOk = file.type ? ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase()) : true;
  return typeOk && file.size > 0 && file.size <= MAX_IMAGE_BYTES;
}

export function totalBytes(files: File[]): number {
  return files.reduce((sum, f) => sum + f.size, 0);
}

export interface RequestAttachment {
  filename: string;
  contentType: string;
  /** base64 (no data: prefix), as Resend expects for `content`. */
  contentBase64: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Converts the chosen image files into base64 email attachments. */
export async function filesToAttachments(files: File[]): Promise<RequestAttachment[]> {
  return Promise.all(
    files.map(async (f) => ({
      filename: f.name || "photo.jpg",
      contentType: f.type || "application/octet-stream",
      contentBase64: await fileToBase64(f),
    })),
  );
}

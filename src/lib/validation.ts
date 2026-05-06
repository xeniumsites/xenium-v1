import { z } from "zod";

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Proposal",
  "Memorial / Tribute",
  "Love Story",
  "Retirement",
  "Corporate / Employee",
  "Other",
] as const;

export const MOODS = [
  "Cinematic & Grand",
  "Warm & Nostalgic",
  "Romantic & Dreamy",
  "Fun & Playful",
  "Elegant & Minimal",
  "Bold & Modern",
] as const;

export const FEATURES = [
  "Photo Gallery",
  "Video Embed",
  "Timeline",
  "Written Messages",
  "Background Music",
  "Animated Text",
  "Guest Messages",
  "QR Code",
] as const;

export const DEADLINES = [
  "Within 2 days",
  "Within 1 week",
  "Within 2 weeks",
  "Flexible",
] as const;

const nameRegex = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u;
const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;

export const requestFormSchema = z.object({
  occasion: z.enum(OCCASIONS, { errorMap: () => ({ message: "Please select an occasion." }) }),
  recipientName: z
    .string()
    .trim()
    .min(2, "Recipient's name must be at least 2 characters.")
    .max(80, "Recipient's name is too long.")
    .regex(nameRegex, "Please use letters, spaces, hyphens or apostrophes only."),
  recipientRelation: z
    .string()
    .trim()
    .min(2, "Please describe your relationship.")
    .max(60, "Relationship description is too long."),
  senderName: z
    .string()
    .trim()
    .min(2, "Your name must be at least 2 characters.")
    .max(80, "Your name is too long.")
    .regex(nameRegex, "Please use letters, spaces, hyphens or apostrophes only."),
  senderEmail: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(255, "Email is too long.")
    .email("Please enter a valid email."),
  senderPhone: z
    .string()
    .trim()
    .min(7, "Phone number is too short.")
    .max(20, "Phone number is too long.")
    .regex(phoneRegex, "Please enter a valid phone number.")
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Please enter a valid phone number."),
  mood: z.enum(MOODS, { errorMap: () => ({ message: "Please select a mood." }) }),
  features: z.array(z.enum(FEATURES)).min(1, "Pick at least one feature."),
  story: z
    .string()
    .trim()
    .min(30, "Tell us at least 30 characters so we can do this justice.")
    .max(2000, "Story is too long. Aim for under 2000 characters."),
  deadline: z.enum(DEADLINES, { errorMap: () => ({ message: "Please select a timeline." }) }),
  // Honeypot — must remain empty. Bots fill all fields.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type RequestFormValues = z.infer<typeof requestFormSchema>;

export const stepFields: Array<Array<keyof RequestFormValues>> = [
  ["occasion"],
  ["recipientName", "recipientRelation"],
  ["senderName", "senderEmail", "senderPhone"],
  ["mood", "features"],
  ["story", "deadline"],
];

export function formatPhoneInput(raw: string): string {
  // Light auto-formatter: keeps + and digits, groups for India and international.
  if (!raw) return "";
  const cleaned = raw.replace(/[^\d+]/g, "");
  if (!cleaned) return "";

  // Handle leading +
  const hasPlus = cleaned.startsWith("+");
  const digits = cleaned.replace(/\+/g, "");

  // India shortcut: 10 digits → "+91 XXXXX XXXXX"
  if (!hasPlus && digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // With country code (e.g. +91 + 10 digits)
  if (hasPlus) {
    if (digits.length <= 2) return `+${digits}`;
    if (digits.length <= 7) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 12) return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
    return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7, 12)} ${digits.slice(12)}`;
  }

  // Otherwise return raw cleaned digits chunked
  if (digits.length <= 5) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 5)} ${digits.slice(5, 10)} ${digits.slice(10)}`;
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.string().min(1),
  clinicId: z.string().min(1),
  name: z
    .string()
    .min(1, "お名前を入力してください")
    .max(50, "お名前は50文字以内で入力してください"),
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  phone: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(
      /^[0-9\-()+ ]{8,15}$/,
      "有効な電話番号を入力してください"
    ),
  currentPosition: z.string().max(100).optional().default(""),
  yearsOfExperience: z.coerce.number().int().min(0).max(99).optional().default(0),
  motivation: z
    .string()
    .min(1, "志望動機を入力してください")
    .max(2000, "志望動機は2000文字以内で入力してください"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const noteSchema = z.object({
  applicationId: z.string().min(1),
  content: z.string().min(1, "メモを入力してください").max(1000),
  authorName: z.string().min(1).max(50),
});

export const stageUpdateSchema = z.object({
  applicationId: z.string().min(1),
  stage: z.enum([
    "applied",
    "screening",
    "interview",
    "offer",
    "hired",
    "rejected",
  ]),
});

export const jobPostingSchema = z.object({
  clinicId: z.string().min(1),
  title: z.string().min(1, "求人タイトルを入力してください").max(100),
  type: z.enum(["full-time", "part-time", "contract"]),
  category: z.string().min(1),
  location: z.string().min(1).max(100),
  salaryMin: z.coerce.number().int().min(0),
  salaryMax: z.coerce.number().int().min(0),
  description: z.string().min(1, "仕事内容を入力してください").max(5000),
  requirements: z.array(z.string()),
  niceToHave: z.array(z.string()),
  benefits: z.array(z.string()),
});

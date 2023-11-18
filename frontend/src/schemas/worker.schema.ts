import * as z from "zod";

export const WorkerSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  matricule: z.string(),
  image: z.string(),
  createdAt: z.coerce.date(),
  fullname: z.string(),
  // Posts: PostSchema, // TODO
  address: z.string().nullable(),
  phonenumber: z.string().nullable(),
  email: z.string().nullable(),
  birthdate: z.coerce.date().nullable(),
});

export const WorkersSchema = z.array(WorkerSchema);

export const YearsWorkerSchema = z.array(
  z.object({
    year: z.number(),
    vochers: z.coerce.number(),
  })
);

export type WorkerType = z.infer<typeof WorkerSchema>;

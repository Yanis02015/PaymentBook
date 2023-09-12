import * as z from "zod";

export const WorkerSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  matricule: z.string(),
  image: z.string(),
  createdAt: z.string(),
  fullname: z.string(),
  // Posts: PostSchema, // TODO
});

export const WorkersSchema = z.array(WorkerSchema);

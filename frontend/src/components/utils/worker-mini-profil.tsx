import { WorkerType } from "@/schemas/worker.schema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const WorkerMiniProfil = ({ worker }: { worker: WorkerType }) => (
  <div className="flex gap-3 items-center bg-slate-100 rounded-lg p-3">
    <Avatar className="w-14 h-14">
      <AvatarImage src={worker.image} />
      <AvatarFallback>{worker.fullname.charAt(0)}</AvatarFallback>
    </Avatar>
    <div>
      <h3 className="font-semibold">{worker.fullname}</h3>
      <p className="text-muted-foreground text-xs">{worker.matricule}</p>
    </div>
  </div>
);

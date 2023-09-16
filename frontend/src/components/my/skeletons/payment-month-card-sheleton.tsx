import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const PaymentMonthCardSheleton = () => {
  return (
    <div className="p-6 bg-white/60 space-y-8 rounded-md">
      <div>
        <Skeleton className="h-6 max-w-36 w-36 mb-2" />
        <Skeleton className="h-3 max-w-72 w-72" />
      </div>
      <div>
        <Skeleton className="h-3 max-w-24 w-24 mb-2" />
        <div className="flex gap-3">
          <Skeleton className="h-6 max-w-52 w-52" />
          <Skeleton className="h-6 max-w-52 w-52" />
          <Skeleton className="h-6 max-w-52 w-52" />
          <Skeleton className="h-6 max-w-52 w-52" />
        </div>
      </div>
      <div>
        <Skeleton className="h-3 max-w-36 w-36 mb-2" />
        <div className="flex gap-3">
          <Skeleton className="h-6 max-w-44 w-44" />
          <Skeleton className="h-6 max-w-44 w-44" />
          <Skeleton className="h-6 max-w-44 w-44" />
          <Skeleton className="h-6 max-w-44 w-44" />
          <Skeleton className="h-6 max-w-44 w-44" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="space-y-2 flex flex-col items-center justify-center">
          <Skeleton className="h-10 max-w-48 w-48" />
          <Skeleton className="h-6 max-w-16 w-16" />
        </div>
        <Separator className="h-12" orientation="vertical" />
        <div className="space-y-2 flex flex-col items-center justify-center">
          <Skeleton className="h-10 max-w-48 w-48" />
          <Skeleton className="h-6 max-w-16 w-16" />
        </div>
        <Separator className="h-12" orientation="vertical" />
        <div className="space-y-2 flex flex-col items-center justify-center">
          <Skeleton className="h-10 max-w-48 w-48" />
          <Skeleton className="h-6 max-w-16 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 max-w-48 w-48 ml-auto" />
    </div>
  );
};

import { formatPayment } from "@/utils/functions";
import { Separator } from "../ui/separator";
import { cn } from "react-scroll-snap-anime-slider";

export const PaymentPayRest = ({
  total,
  pay,
  rest,
  mini,
  className,
}: {
  total: number;
  pay: number;
  rest: number;
  mini?: boolean;
  className?: string;
}) => {
  const titleSize = mini
    ? "text-md md:text-xl xl:text-2xl"
    : "text-xl md:text-2xl xl:text-3xl";
  const flexRowStyle = !mini ? "flex-col" : "";
  const hiddenSeparator = !mini ? "hidden" : "";
  return (
    <div
      className={cn(
        "h-[auto] sm:flex-row justify-between flex items-center gap-x-4 gap-y-3 text-center flex-wrap",
        flexRowStyle,
        className
      )}
    >
      <div className="flex-1">
        <h3 className={cn("font-semibold text-green-400", titleSize)}>
          {formatPayment(pay)}
        </h3>
        <p className="font-semibold">Versé</p>
      </div>
      <Separator
        className={cn("h-10 bg-black/20 sm:block", hiddenSeparator)}
        orientation="vertical"
      />
      {!mini && (
        <Separator
          className="w-20 sm:hidden bg-black/20 block"
          orientation="horizontal"
        />
      )}
      <div className="flex-1">
        <h3 className={cn("font-semibold", titleSize)}>
          {formatPayment(total)}
        </h3>
        <p className="font-semibold">Total</p>
      </div>
      <Separator
        className={cn("h-10 bg-black/20 sm:block", hiddenSeparator)}
        orientation="vertical"
      />
      {!mini && (
        <Separator
          className="w-20 sm:hidden bg-black/20 block"
          orientation="horizontal"
        />
      )}
      <div className="flex-1">
        <h3 className={cn("font-semibold text-destructive", titleSize)}>
          {formatPayment(rest)}
        </h3>
        <p className="font-semibold">Reste</p>
      </div>
    </div>
  );
};

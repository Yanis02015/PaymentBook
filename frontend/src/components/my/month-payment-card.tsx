import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VochersPerMonthSchema } from "@/schemas/vocher.schema";
import { WorkerSchema } from "@/schemas/worker.schema";
import { formatPayment } from "@/utils/functions";
import { AlertTriangle, DollarSign } from "lucide-react";
import { Carousel, Slide, Slider, cn } from "react-scroll-snap-anime-slider";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

const getThemeByVocher = (rest: number) => {
  if (rest > 0) return "bg-teal-200/20";
  if (rest < 0) return "bg-amber-200/20";
  return "bg-green-300/20";
};

export const PaymentMonthCard = ({
  vocherPerMonth,
  worker,
}: {
  vocherPerMonth: z.infer<typeof VochersPerMonthSchema>;
  worker: z.infer<typeof WorkerSchema>;
}) => (
  <Card
    className={cn(
      getThemeByVocher(vocherPerMonth.rest),
      "border-none relative"
    )}
  >
    <CardHeader>
      <CardTitle>{vocherPerMonth.month}</CardTitle>
      <CardDescription>
        Les transaction du mois de {vocherPerMonth.month} pour Mr.{" "}
        {worker.fullname}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm font-semibold text-muted-foreground">
        LISTE DES BONS
      </p>
      {vocherPerMonth.Vochers.length > 0 ? (
        <Carousel
          slideMargin="5px"
          totalSlides={vocherPerMonth.Vochers.length}
          step={1}
        >
          <Slider>
            {vocherPerMonth.Vochers.map((vocher) => (
              <Slide key={vocher.id} style={{ width: "max-content" }}>
                <Badge>
                  {vocher.quantity}
                  <span className="text-destructive mx-1">x</span>
                  {formatPayment(vocher.remuneration)}
                  <span className="text-destructive mx-1">~</span>
                  {vocher.Type?.name}
                </Badge>
              </Slide>
            ))}
          </Slider>
        </Carousel>
      ) : (
        <Badge variant="secondary" className="text-slate-500 rounded">
          Aucun bon pour ce mois
        </Badge>
      )}

      <p className="text-sm font-semibold text-muted-foreground mt-5">
        LISTE DES VERSSEMENTS
      </p>
      {vocherPerMonth.Payments.length > 0 ? (
        <Carousel slideMargin="5px" totalSlides={7} step={1}>
          <Slider>
            {vocherPerMonth.Payments.map((payment) => (
              <Slide key={payment.id} style={{ width: "max-content" }}>
                <Badge variant="default">{payment.amount} DA</Badge>
              </Slide>
            ))}
          </Slider>
        </Carousel>
      ) : (
        <Badge variant="secondary" className="text-slate-500 rounded">
          Aucun verssement pour ce mois
        </Badge>
      )}

      <div className="mt-5 h-[auto] sm:flex-row flex-col justify-between flex items-center gap-x-4 gap-y-3 text-center flex-wrap">
        <div className="flex-1">
          <h3 className="text-xl font-semibold xl:text-3xl md:text-2xl text-green-400">
            {formatPayment(vocherPerMonth.pay)}
          </h3>
          <p className="font-semibold">Versé</p>
        </div>
        <Separator
          className="h-10 hidden bg-black/20 sm:block"
          orientation="vertical"
        />
        <Separator
          className="w-20 sm:hidden bg-black/20 block"
          orientation="horizontal"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold xl:text-3xl md:text-2xl">
            {formatPayment(vocherPerMonth.total)}
          </h3>
          <p className="font-semibold">Total</p>
        </div>
        <Separator
          className="h-10 hidden bg-black/20 sm:block"
          orientation="vertical"
        />
        <Separator
          className="w-20 sm:hidden bg-black/20 block"
          orientation="horizontal"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold xl:text-3xl md:text-2xl text-destructive">
            {formatPayment(vocherPerMonth.rest)}
          </h3>
          <p className="font-semibold">Reste</p>
        </div>
      </div>
    </CardContent>
    <CardFooter className="justify-end pt-5">
      <Button variant="outline" size="sm">
        <DollarSign className="h-4 w-4 mr-1" /> Nouveau verssement
      </Button>
    </CardFooter>

    {/* Warning if rest < 0 */}
    {vocherPerMonth.rest < 0 && (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="absolute right-6 top-4">
            <div className="shadow bg-amber-500 text-white rounded-full p-2">
              <AlertTriangle
                className="-mt-[1.5px] mb-[1.5px] h-5 w-5"
                strokeWidth={2.5}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-amber-500/80 text-white border-none">
            <p>La somme versé est superieur à la somme dû!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </Card>
);

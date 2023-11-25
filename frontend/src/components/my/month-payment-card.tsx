import { createPayment } from "@/api/payment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VochersPerMonthSchema } from "@/schemas/vocher.schema";
import { WorkerSchema } from "@/schemas/worker.schema";
import { formatPayment, getFormatedDate } from "@/utils/functions";
import { queries } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, DollarSign, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Carousel, Slide, Slider, cn } from "react-scroll-snap-anime-slider";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useToast } from "../ui/use-toast";
import { CreatePaymentForMonthDialog } from "./dialogs/create-payment-dialog";
import { PaymentPayRest } from "./payment-pay-rest";
import "@/styles/component.css";
import { Link } from "react-router-dom";

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
}) => {
  const [openDialogCreatePayment, setOpenDialogCreatePayment] = useState(false);
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const mutationCreatePayment = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries([queries.vocherPerMonth]);
      queryClient.invalidateQueries([queries.payments]);
      setOpenDialogCreatePayment(false);
      toast({
        title: "Payement effectué avec succès!",
        description: `Le versement pour le mois ${vocherPerMonth.month} de Mr. ${worker.fullname} a été effectué avec succès.`,
      });
    },
  });

  const link = `${
    vocherPerMonth.date.getMonth() + 1
  }-${vocherPerMonth.date.getFullYear()}`;

  return (
    <Card
      className={cn(
        getThemeByVocher(vocherPerMonth.rest),
        "border-none relative hover:shadow-lg transition-all month-payment-card"
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
                  <Badge className="text-sm">
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

        <p className="text-sm font-semibold text-muted-foreground mt-5 mb-1">
          LISTE DES VERSSEMENTS
        </p>
        {vocherPerMonth.Payments.length > 0 ? (
          <Carousel slideMargin="5px" totalSlides={7} step={1}>
            <Slider>
              {vocherPerMonth.Payments.map((payment) => (
                <Slide key={payment.id} style={{ width: "max-content" }}>
                  <Badge className="hover:bg-indigo-400/80 bg-indigo-400 text-md rounded">
                    {payment.amount} DA
                    <span className="text-destructive mx-1">~</span>
                    <span className="text-white/80">
                      {getFormatedDate(payment.createdAt).simpleDateWithDayWeek}
                    </span>
                  </Badge>
                </Slide>
              ))}
            </Slider>
          </Carousel>
        ) : (
          <Badge variant="secondary" className="text-slate-500 rounded">
            Aucun verssement pour ce mois
          </Badge>
        )}

        <PaymentPayRest
          pay={vocherPerMonth.pay}
          rest={vocherPerMonth.rest}
          total={vocherPerMonth.total}
          className="mt-8"
        />
      </CardContent>
      <CardFooter className="justify-end pt-5">
        <Button
          onClick={() => setOpenDialogCreatePayment(true)}
          variant="outline"
          size="sm"
        >
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

      {worker && (
        <CreatePaymentForMonthDialog
          vocherPerMonth={vocherPerMonth}
          onSubmit={mutationCreatePayment.mutate}
          onOpenChange={setOpenDialogCreatePayment}
          open={openDialogCreatePayment}
          worker={worker}
        />
      )}

      <Link
        to={link}
        className={cn(
          buttonVariants({
            size: "icon",
            variant: "ghost",
            className:
              "absolute top-3 right-3 maximize-icon transition-all ease-out duration-200 hover:bg-transparent hover:text-green-500 lg:opacity-0 lg:text-foreground text-muted-foreground",
          })
        )}
      >
        <Maximize2 />
      </Link>
    </Card>
  );
};

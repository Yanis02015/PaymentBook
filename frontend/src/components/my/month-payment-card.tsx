import { DollarSign } from "lucide-react";
import { Carousel, Slide, Slider } from "react-scroll-snap-anime-slider";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { VochersPerMonthSchema } from "@/schemas/vocher.schema";
import { WorkerSchema } from "@/schemas/worker.schema";
import { formatPayment } from "@/utils/functions";

export const PaymentMonthCard = ({
  vocherPerMonth,
  worker,
}: {
  vocherPerMonth: z.infer<typeof VochersPerMonthSchema>;
  worker: z.infer<typeof WorkerSchema>;
}) => (
  <Card>
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

      <p className="text-sm font-semibold text-muted-foreground mt-5">
        LISTE DES VERSSEMENTS
      </p>
      {vocherPerMonth.Payments && vocherPerMonth.Payments.length > 0 ? (
        <Carousel slideMargin="5px" totalSlides={7} step={1}>
          <Slider>
            {vocherPerMonth.Payments.map((payment) => (
              <Slide key={payment.id} style={{ width: "max-content" }}>
                <Badge variant="outline">{payment.amount} DA</Badge>
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
        <Separator className="h-10 hidden sm:block" orientation="vertical" />
        <Separator className="w-20 sm:hidden block" orientation="horizontal" />
        <div className="flex-1">
          <h3 className="text-xl font-semibold xl:text-3xl md:text-2xl">
            {formatPayment(vocherPerMonth.total)}
          </h3>
          <p className="font-semibold">Total</p>
        </div>
        <Separator className="h-10 hidden sm:block" orientation="vertical" />
        <Separator className="w-20 sm:hidden block" orientation="horizontal" />
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
  </Card>
);

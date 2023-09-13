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
        LISTE DES VERSSEMENTS
      </p>
      <Carousel slideMargin="5px" totalSlides={30} step={1}>
        <Slider>
          {new Array(10).fill(0).map((_, i) => (
            <Slide key={i} style={{ width: "max-content" }}>
              <Badge>{i * 40 + 1200} DA</Badge>
            </Slide>
          ))}
        </Slider>
      </Carousel>

      <div className="mt-5 h-10 sm:flex-row flex-col justify-between flex items-center gap-x-4 gap-y-3 text-center flex-wrap">
        <div>
          <h3 className="text-xl font-semibold text-green-400">13 000.00 DA</h3>
          <p className="font-semibold">Versé</p>
        </div>
        <Separator className="h-full hidden sm:block" orientation="vertical" />
        <Separator className="w-20 sm:hidden block" orientation="horizontal" />
        <div>
          <h3 className="text-xl font-semibold">
            {formatPayment(vocherPerMonth.total)}
          </h3>
          <p className="font-semibold">Total</p>
        </div>
        <Separator className="h-full hidden sm:block" orientation="vertical" />
        <Separator className="w-20 sm:hidden block" orientation="horizontal" />
        <div>
          <h3 className="text-xl font-semibold text-destructive">
            1 000.00 DA
          </h3>
          <p className="font-semibold">Reste</p>
        </div>
      </div>
    </CardContent>
    <CardFooter className="justify-end">
      <Button variant="outline" size="sm">
        <DollarSign className="h-4 w-4 mr-1" /> Nouveau verssement
      </Button>
    </CardFooter>
  </Card>
);

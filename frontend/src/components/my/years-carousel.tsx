import { Carousel, Slide, Slider } from "react-scroll-snap-anime-slider";
import { Button } from "../ui/button";
import { z } from "zod";
import { YearsWorkerSchema } from "@/schemas/worker.schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const YearsCaroussel = ({
  years,
  selectedYear,
  onSelectYear,
}: {
  years: z.infer<typeof YearsWorkerSchema>;
  selectedYear: number;
  onSelectYear: (year: number) => void;
}) => {
  return (
    <div className="flex items-end pb-2 h-16">
      <div className="max-w-full">
        <Carousel
          className="flex gap-2"
          slideMargin="5px"
          totalSlides={years.length}
          step={1}
        >
          <Slider>
            {years.map((year, i) => (
              <Slide key={i} style={{ width: "max-content" }}>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        key={i}
                        size="sm"
                        variant={
                          year.year == selectedYear ? "outline" : "ghost"
                        }
                        onClick={() => onSelectYear(year.year)}
                      >
                        {year.year}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>
                        {year.vochers} missions durant l'année {year.year}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Slide>
            ))}
          </Slider>
        </Carousel>
      </div>
    </div>
  );
};

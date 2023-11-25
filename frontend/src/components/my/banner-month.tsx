import { VocherMonthType } from "@/schemas/vocher.schema";
import { WorkerType } from "@/schemas/worker.schema";
import { formatPayment, getFormatedDate } from "@/utils/functions";
import { PATHS } from "@/utils/paths";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

export const BannerMonth = ({
  vocher,
  worker,
}: {
  worker: WorkerType;
  vocher: VocherMonthType;
}) => {
  return (
    <div className="relative flex text-white">
      <img
        src="https://oneftbl-cms.imgix.net/https%3A%2F%2Fimages.onefootball.com%2Fcw%2Fbg%2Fzigzag-pattern-banner.svg?auto=format%2Ccompress&crop=faces&dpr=2&fit=crop&h=0&q=25&w=3840&s=17b21e00f9d8cf2eaa242dc66b1a4290"
        alt="background"
        className="absolute h-full w-full z-0"
      />
      <Link
        to={`${PATHS.WORKERS}/${worker.id}`}
        className="z-50 hover:bg-gray-300/20 transition-all duration-200 flex gap-2 items-center font-semibold text-sm py-2 px-2 pr-4 bg-gray-300/10 rounded-full absolute left-[50%] top-7"
        style={{
          transform: "translateX(-50%)",
        }}
      >
        <img
          className="h-7 w-7 rounded-full"
          src={worker.image}
          alt={worker.fullname}
        />
        <h2>
          {worker.fullname} ~{" "}
          <span className="text-xs text-blue-400">{worker.matricule}</span>
        </h2>
      </Link>

      {/* Content */}
      <div className="relative min-h-fit md:h-96 w-full items-center flex justify-between px-10 py-10 flex-col md:flex-row gap-10 md:gap-y-0 md:py-16 pt-28 pb-36">
        <div className="flex flex-col gap-3 text-center justify-center items-center w-[200px]">
          <ArrowUp className="h-10 w-10 text-blue-400" strokeWidth={3} />
          <div>
            <span>Total des versements</span>
            <h2 className="text-3xl font-bold text-blue-400">
              {formatPayment(vocher.pay)}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-between items-center text-center pt-4 order-first	md:order-none">
          <h2 className="text-5xl font-bold uppercase">
            {getFormatedDate(vocher.date).monthYear}
          </h2>
          <p className="text-md">
            {vocher.Payments.length} Versements et {vocher.Vochers.length} Bons
          </p>
        </div>

        <div className="flex flex-col gap-3 text-center justify-center items-center w-[200px]">
          {/* <img
            src={"fixture.participants[1].image_path"}
            alt={"fixture.participants[1].name"}
            className="w-20 h-20"
          /> */}
          <ArrowDown className="w-10 h-10 text-destructive" strokeWidth={3} />
          <div>
            <span>Total du mois</span>
            <h2 className="text-3xl font-bold text-destructive">
              {formatPayment(vocher.total)}
            </h2>
          </div>
        </div>
      </div>
      <div
        style={{
          transform: "translateX(-50%)",
        }}
        className="absolute left-[50%] bottom-10 text-center"
      >
        <span>Reste à payer</span>
        <h2 className="text-3xl font-bold text-green-400">
          {formatPayment(vocher.rest)}
        </h2>
      </div>
    </div>
  );
};

import { getVochersByMonth } from "@/api/vocher";
import { getWorker } from "@/api/worker";
import { BannerMonth } from "@/components/my/banner-month";
import { CreatePaymentForMonthDialog } from "@/components/my/dialogs/create-payment-dialog";
import { CreateVocherDialog } from "@/components/my/dialogs/create-vocher-dialog";
import { DeleteVocherAlert } from "@/components/my/dialogs/month/delete-vocher-alert";
import { UpdateVocherDialog } from "@/components/my/dialogs/month/update-vocher-dialog";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@/schemas/payment.schema";
import { VocherType } from "@/schemas/vocher.schema";
import { PaymentTypes } from "@/utils/enum";
import { formatPayment, getFormatedDate, monthToDate } from "@/utils/functions";
import { queries } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { CircleOff, Info, MoveRight, Pen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Month() {
  const [openCreatePayment, setOpenCreatePayment] = useState(false);
  const [openCreateVocher, setOpenCreateVocher] = useState(false);
  const { id, month } = useParams();
  const date = monthToDate(month || "");
  const { data: worker } = useQuery({
    queryKey: [queries.workers, id],
    queryFn: () => getWorker(id as string),
    enabled: Boolean(id),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status == 404)
        return false;
      if (failureCount > 3) return false;
      return true;
    },
  });
  const { data: vocher } = useQuery({
    queryKey: [queries.vocherPerMonth, date],
    queryFn: () =>
      getVochersByMonth({
        date: date as Date,
        workerId: id as string,
      }),
    enabled: !!id && !!date,
  });
  if (!worker || !vocher) return "Chargement...";
  return (
    <div>
      <BannerMonth vocher={vocher} worker={worker} />

      <div className="px-5 pt-5 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl m-auto">
        <PaymentsList
          payments={vocher.Payments}
          onCreatePayment={() => setOpenCreatePayment(true)}
        />

        <VochersList
          vochers={vocher.Vochers}
          onCreateVocher={() => setOpenCreateVocher(true)}
        />
      </div>

      {/* Dialogs */}
      <CreatePaymentForMonthDialog
        onOpenChange={setOpenCreatePayment}
        open={openCreatePayment}
        vocherPerMonth={vocher}
        worker={worker}
      />
      <CreateVocherDialog
        defaultDate={date}
        onOpenChange={setOpenCreateVocher}
        open={openCreateVocher}
        worker={worker}
      />
    </div>
  );
}

const VochersList = ({
  onCreateVocher,
  vochers,
  className,
}: {
  onCreateVocher: () => void;
  vochers: VocherType[];
  className?: string;
}) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedVocherId, setSelectedVocherId] = useState("");
  const selectedVocher = vochers.find((v) => v.id == selectedVocherId);
  return (
    <div className={className}>
      <h2 className="font-bold text-xl">
        Liste des bons du mois ({vochers.length})
      </h2>

      <div className="space-y-3 pt-3">
        <Button
          onClick={onCreateVocher}
          className="w-full relative font-semibold uppercase"
          variant="outline"
        >
          <Plus strokeWidth={2.4} className="absolute left-3" />
          Nouveau bon
        </Button>
        {vochers.length == 0 && <NoVochers content="Aucun bon pour ce mois" />}
        {vochers.map((v) => (
          <VocherItem
            key={v.id}
            onUpdateVocher={() => {
              setSelectedVocherId(v.id);
              setOpenUpdate(true);
            }}
            onDeleteVocher={() => {
              setSelectedVocherId(v.id);
              setOpenDelete(true);
            }}
            vocher={v}
          />
        ))}
      </div>
      {selectedVocher && (
        <UpdateVocherDialog
          open={openUpdate}
          setOpen={setOpenUpdate}
          vocher={selectedVocher}
        />
      )}
      {selectedVocher && (
        <DeleteVocherAlert
          open={openDelete}
          setOpen={setOpenDelete}
          vocher={selectedVocher}
        />
      )}
    </div>
  );
};

export const VocherItem = ({
  vocher,
  onUpdateVocher,
  onDeleteVocher,
  hideActions,
}: {
  vocher: VocherType;
  hideActions?: boolean;
} & (
  | {
      onUpdateVocher: () => void;
      hideActions?: false;
      onDeleteVocher: () => void;
    }
  | {
      hideActions: true;
      onUpdateVocher?: undefined;
      onDeleteVocher?: undefined;
    }
)) => (
  <div key={vocher.id} className="bg-red-50 shadow rounded-lg py-2 px-3">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-lg">
        {vocher.Type?.name}{" "}
        <span className="text-sm text-muted-foreground font-normal ml-2">
          {getFormatedDate(vocher.date).simpleDateWithDayWeek}{" "}
          {getFormatedDate(vocher.date).year}
        </span>
      </h3>
      {!hideActions && (
        <div className="text-muted-foreground flex gap-1.5 items-center">
          <Button
            className="p-0 h-auto w-auto hover:bg-transparent"
            variant="ghost"
            size="icon"
          >
            <Info className="h-5 w-5 hover:text-blue-600" strokeWidth={2.4} />
          </Button>
          <Button
            className="p-0 h-auto w-auto hover:bg-transparent"
            variant="ghost"
            size="icon"
            onClick={onUpdateVocher}
          >
            <Pen className="h-5 w-5 hover:text-green-400" strokeWidth={2.4} />
          </Button>
          <Button
            className="p-0 h-auto w-auto hover:bg-transparent"
            variant="ghost"
            size="icon"
            onClick={onDeleteVocher}
          >
            <Trash2
              className="hovh-5 w-5 hover:text-destructive"
              strokeWidth={2.4}
            />
          </Button>
        </div>
      )}
    </div>
    <div className="grid grid-cols-12 items-center font-semibold">
      <span className="col-span-6">
        {vocher.quantity} <span className="text-destructive"> x </span>{" "}
        {formatPayment(vocher.remuneration)}
      </span>
      <MoveRight strokeWidth={3} />
      <span className="text-right col-span-5 text-blue-700 font-bold">
        {formatPayment(vocher.remuneration * vocher.quantity)}
      </span>
    </div>
  </div>
);

const PaymentsList = ({
  payments,
  className,
  onCreatePayment,
}: {
  payments: PaymentType[];
  className?: string;
  onCreatePayment: () => void;
}) => (
  <div className={className}>
    <h2 className="font-bold text-xl">
      Liste des versements du mois ({payments.length})
    </h2>

    <div className="space-y-3 pt-3">
      <Button
        className="w-full relative font-semibold uppercase"
        variant="outline"
        onClick={onCreatePayment}
      >
        <Plus strokeWidth={2.4} className="absolute left-3" />
        Nouveau versement
      </Button>
      {payments.length == 0 && (
        <NoVochers content="Aucun versement pour ce mois" />
      )}
      {payments.map((p) => (
        <div key={p.id} className="bg-blue-100 shadow rounded-lg py-2 px-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg capitalize">
              {getFormatedDate(p.createdAt).simpleDateWithDayWeek}{" "}
              {getFormatedDate(p.createdAt).year}
            </h3>
            <div className="text-muted-foreground flex gap-1.5 items-center">
              <Button
                className="p-0 h-auto w-auto hover:bg-transparent"
                variant="ghost"
                size="icon"
              >
                <Info
                  className="h-5 w-5 hover:text-blue-600"
                  strokeWidth={2.4}
                />
              </Button>
              <Button
                className="p-0 h-auto w-auto hover:bg-transparent"
                variant="ghost"
                size="icon"
              >
                <Pen
                  className="h-5 w-5 hover:text-green-400"
                  strokeWidth={2.4}
                />
              </Button>
              <Button
                className="p-0 h-auto w-auto hover:bg-transparent"
                variant="ghost"
                size="icon"
              >
                <Trash2
                  className="hovh-5 w-5 hover:text-destructive"
                  strokeWidth={2.4}
                />
              </Button>
            </div>
          </div>
          <p className="font-medium">
            <span className="text-destructive">{formatPayment(p.amount)}</span>{" "}
            en « {PaymentTypes[p.type]} »
          </p>
        </div>
      ))}
    </div>
  </div>
);

const NoVochers = ({ content }: { content: string }) => (
  <div className="text-muted-foreground font-semibold flex flex-col justify-center items-center gap-2 text-lg p-3 border-2">
    <CircleOff className="h-10 w-10" />
    <p>{content}</p>
  </div>
);

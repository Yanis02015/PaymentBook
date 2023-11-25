type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

export const paymentType = ["CASH", "GOODS"] as const;
// EN espence ou en bien materien

export const PaymentTypes: ObjectFromList<typeof paymentType> = {
  CASH: "Espèces",
  GOODS: "Bien matériel",
};

// admin/rackets/upload/types.ts
import type { NormalizedRacketInput } from "@/app/lib/types";

export type EditableVariant = NormalizedRacketInput["variants"][number] & {
    isDefault: boolean;
};

export type EditableRacketGroup = {
    name: string;
    brandName: string;
    seriesName: string | null;
    variants: EditableVariant[];
};

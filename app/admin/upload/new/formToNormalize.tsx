// app\admin\upload\new\formToNormalize.tsx

import { RacketFormValues, NormalizedRacketInput } from "@/app/lib/types";

export function convertFormToNormalized(
    input: RacketFormValues
): NormalizedRacketInput {

    return {
        name: input.name,
        brandName: input.brandName,
        seriesName: input.seriesName ?? null,
        note: input.note ?? null,

        variants: [
            {
                weight: input.weight,
                weightCategory: input.weightCategory,
                balanceType: input.balanceType,
                shaft: input.shaft,
                gripSize: input.gripSize,
                maxTension: input.maxTension,
                price: input.price,
                color: input.color,
                isDefault: true,        // 수동 입력은 항상 1 variant
            }
        ]
    };
}

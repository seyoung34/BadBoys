// admin/rackets/upload/groupByName.ts
import type { NormalizedRacketInput } from "@/app/lib/types";
import type { EditableRacketGroup } from "./types";

export function groupByRacketName(
    list: NormalizedRacketInput[]
): EditableRacketGroup[] {
    const map = new Map<string, EditableRacketGroup>();

    for (const r of list) {
        if (!map.has(r.name)) {
            map.set(r.name, {
                name: r.name,
                brandName: r.brandName,
                seriesName: r.seriesName,
                variants: [],
            });
        }

        const group = map.get(r.name)!;

        for (const v of r.variants) {
            group.variants.push({
                ...v,
                isDefault: false,
            });
        }
    }

    // variant가 1개면 자동 default
    for (const g of map.values()) {
        if (g.variants.length === 1) {
            g.variants[0].isDefault = true;
        }
    }

    return Array.from(map.values());
}

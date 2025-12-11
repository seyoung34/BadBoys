// admin/rackets/upload/RacketVariantCard.tsx
"use client";

import type { EditableRacketGroup } from "./types";

type Props = {
    group: EditableRacketGroup;
    onSelectDefault: (variantIndex: number) => void;
};

export function RacketVariantCard({ group, onSelectDefault }: Props) {
    return (
        <div className="border rounded-lg p-4 bg-white space-y-4">
            <div>
                <h3 className="font-bold text-lg">{group.name}</h3>
                <p className="text-sm text-slate-500">
                    {group.brandName} {group.seriesName && `· ${group.seriesName}`}
                </p>
            </div>

            <div className="space-y-2">
                {group.variants.map((v, idx) => (
                    <label
                        key={idx}
                        className="flex items-center gap-3 p-2 border rounded hover:bg-slate-50 cursor-pointer"
                    >
                        <input
                            type="radio"
                            name={`default-${group.name}`}
                            checked={v.isDefault}
                            onChange={() => onSelectDefault(idx)}
                            disabled={group.variants.length === 1}
                        />

                        <div className="text-sm">
                            <div>
                                {v.weightCategory} {v.weight && `(${v.weight}g)`}{" "}
                                {v.color && `· ${v.color}`}
                            </div>
                            <div className="text-slate-500 text-xs">
                                shaft {v.shaft ?? "-"} · grip {v.gripSize ?? "-"} ·{" "}
                                {v.price ? `${v.price.toLocaleString()}원` : "가격 없음"}
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            {group.variants.length === 1 && (
                <p className="text-xs text-green-600">
                    기본 라켓으로 자동 설정됨
                </p>
            )}
        </div>
    );
}

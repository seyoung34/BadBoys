"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import type { RacketFormValues } from "@/app/lib/types";

interface Props {
    initial?: RacketFormValues | null;
    onSubmit: (values: RacketFormValues) => Promise<void>;
    submitText?: string;
}

export function RacketForm({ initial, onSubmit, submitText = "저장" }: Props) {
    const [values, setValues] = useState<RacketFormValues>(
        initial ?? {
            name: "",
            brandName: "",
            seriesName: "",
            note: "",

            weight: null,
            weightCategory: "",
            balanceType: "",
            shaft: null,
            gripSize: "",
            maxTension: null,
            price: null,
            color: "",
        }
    );

    const handleChange = (
        key: keyof RacketFormValues,
        value: string | number | null
    ) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">

            {/* ---------------------- */}
            {/* 기본 라켓 정보 */}
            {/* ---------------------- */}
            <div>
                <Label>라켓 이름</Label>
                <Input
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                />
            </div>

            <div>
                <Label>브랜드</Label>
                <Input
                    value={values.brandName ?? ""}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    required
                />
            </div>

            <div>
                <Label>시리즈</Label>
                <Input
                    value={values.seriesName ?? ""}
                    onChange={(e) => handleChange("seriesName", e.target.value)}
                />
            </div>

            <div>
                <Label>비고 (설명)</Label>
                <textarea
                    value={values.note ?? ""}
                    onChange={(e) => handleChange("note", e.target.value)}
                    className="w-full border rounded p-2"
                    rows={4}
                />
            </div>

            {/* ---------------------- */}
            {/* 기본 Variant 정보 */}
            {/* ---------------------- */}

            <div>
                <Label>무게 (g)</Label>
                <Input
                    type="number"
                    value={values.weight ?? ""}
                    onChange={(e) => handleChange("weight", Number(e.target.value))}
                />
            </div>

            <div>
                <Label>무게 분류</Label>
                <Input
                    type="text"
                    value={values.weightCategory ?? ""}
                    onChange={(e) => handleChange("weightCategory", e.target.value)}
                />
            </div>

            <div>
                <Label>밸런스 타입</Label>
                <Input
                    type="text"
                    value={values.balanceType ?? ""}
                    onChange={(e) => handleChange("balanceType", e.target.value)}
                />
            </div>

            <div>
                <Label>샤프트 강성</Label>
                <Input
                    type="number"
                    value={values.shaft ?? ""}
                    onChange={(e) => handleChange("shaft", Number(e.target.value))}
                />
            </div>

            <div>
                <Label>그립 사이즈</Label>
                <Input
                    type="text"
                    value={values.gripSize ?? ""}
                    onChange={(e) => handleChange("gripSize", e.target.value)}
                />
            </div>

            <div>
                <Label>최대 텐션</Label>
                <Input
                    type="number"
                    value={values.maxTension ?? ""}
                    onChange={(e) => handleChange("maxTension", Number(e.target.value))}
                />
            </div>

            <div>
                <Label>가격</Label>
                <Input
                    type="number"
                    value={values.price ?? ""}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                />
            </div>

            <div>
                <Label>색상</Label>
                <Input
                    value={values.color ?? ""}
                    onChange={(e) => handleChange("color", e.target.value)}
                />
            </div>

            <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
            >
                {submitText}
            </Button>
        </form>
    );
}

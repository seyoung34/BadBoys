"use client";

import { useState } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";

import {
    processRacketJson,
    processRacketJsonList
} from "./processRacket";

import { uploadRacketToDB } from "./uploadUtil";
import { csvToRacketCrawlInputList } from "./csvToRacketCrawlInputList";
import type { NormalizedRacketInput, RacketCrawlInput } from "@/app/lib/types";

import { groupByRacketName } from "./groupByName";
import { RacketVariantCard } from "./RacketVariantCard";
import type { EditableRacketGroup } from "./types";
import Link from "next/link";



export default function UploadRacketPage() {
    const [jsonText, setJsonText] = useState("");
    const [convertedJson, setConvertedJson] = useState<NormalizedRacketInput[] | null>(null);
    const [log, setLog] = useState("");
    const [groups, setGroups] = useState<EditableRacketGroup[]>([]);

    function selectDefault(groupIndex: number, variantIndex: number) {
        setGroups(prev =>
            prev.map((g, gi) => {
                if (gi !== groupIndex) return g;

                return {
                    ...g,
                    variants: g.variants.map((v, vi) => ({
                        ...v,
                        isDefault: vi === variantIndex,
                    })),
                };
            })
        );
        console.log(groups);
    }

    // ---------------------------
    // CSV 파일 업로드
    // ---------------------------
    function handleCsvFileUpload(file: File) {
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result;
            if (typeof text === "string") {
                setJsonText(text);
                setLog("CSV 파일 로드 완료");
            }
        };

        reader.onerror = () => {
            setLog("CSV 파일 읽기 실패");
        };

        reader.readAsText(file);
    }

    // ---------------------------
    // 변환 (JSON or CSV 자동 판별)
    // ---------------------------
    async function handleConvert() {
        setLog("");

        try {
            let crawlInputs;

            try {
                const parsed = JSON.parse(jsonText);
                crawlInputs = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                crawlInputs = csvToRacketCrawlInputList(jsonText);
            }

            const normalized = await processRacketJsonList(crawlInputs);
            const grouped = groupByRacketName(normalized);

            setGroups(grouped);
            setConvertedJson(normalized);
            setLog(`변환 완료 (${grouped.length}개 라켓)`);
        } catch (err) {
            setGroups([]);
            setLog("변환 오류: " + (err as Error).message);
        }
    }


    // ---------------------------
    // DB 업로드
    // ---------------------------
    async function handleUpload() {
        try {
            for (const g of groups) {
                const defaults = g.variants.filter(v => v.isDefault);
                if (defaults.length !== 1) {
                    throw new Error(
                        `${g.name}의 기본 variant를 1개 선택해야 합니다`
                    );
                }

                await uploadRacketToDB({
                    name: g.name,
                    brandName: g.brandName,
                    seriesName: g.seriesName,
                    note: null,
                    variants: g.variants,
                });
            }

            setLog("✅ 모든 라켓 업로드 완료");
        } catch (err) {
            setLog("업로드 오류: " + (err as Error).message);
        }
    }


    return (
        <div className="p-8 container mx-auto space-y-6">
            <h1 className="text-2xl font-bold">라켓 CSV / JSON 업로드</h1>

            {/* CSV 파일 업로드 */}
            <div className="justify-between items-cente  flex pr-6">
                <input
                    className="font-semibold mb-2 border border-slate-300 hover:bg-blue-50 rounded-2xl p-2"
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCsvFileUpload(file);
                    }}
                />
                <Link href={`/admin/upload/new`}>
                    <Button className="bg-slate-600 hover:bg-slate-900">수동 라켓 추가</Button>
                </Link>
            </div>

            {/* JSON / CSV 텍스트 입력 */}
            <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="CSV 또는 JSON을 직접 붙여넣어도 됩니다"
                className="h-96"
            />

            {/* 변환 버튼 */}
            <div className="flex gap-4">
                <Button onClick={handleConvert}>
                    변환
                </Button>

                <Button
                    onClick={handleUpload}
                    disabled={!convertedJson}
                    className="bg-slate-200 border border-slate-400 text-black"
                >
                    DB 업로드
                </Button>
            </div>

            {/* 로그 */}
            {log && (
                <pre className="p-4 bg-black text-white text-sm rounded whitespace-pre-wrap">
                    {log}
                </pre>
            )}

            {/* 변환 결과 */}
            {convertedJson && (
                <pre className="p-8 bg-slate-900 text-green-300 text-sm rounded overflow-x-auto h-[40vh]">
                    {JSON.stringify(convertedJson, null, 2)}
                </pre>
            )}

            {groups.length > 0 && (
                <div className="grid gap-6 mt-6">
                    {groups.map((group, gi) => (
                        <RacketVariantCard
                            key={group.name}
                            group={group}
                            onSelectDefault={(vi) => selectDefault(gi, vi)}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

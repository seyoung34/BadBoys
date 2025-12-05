"use client";

import { useState } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";

import {
    processRacketJson,
    processRacketJsonList
} from "./processRacket";

import { uploadRacketToDB } from "./uploadUtil";
import { NormalizedRacketInput } from "@/app/lib/types"; // 반드시 정의되어 있어야 함

export default function UploadRacketPage() {
    const [jsonText, setJsonText] = useState("");
    const [convertedJson, setConvertedJson] = useState<NormalizedRacketInput[] | null>(null);
    const [log, setLog] = useState("");

    // ---------------------------
    // 1) JSON → Normalized 변환
    // ---------------------------
    async function handleConvert() {
        setLog("");

        try {
            const parsed = JSON.parse(jsonText);

            const output = Array.isArray(parsed)
                ? await processRacketJsonList(parsed)
                : [await processRacketJson(parsed)];

            setConvertedJson(output);
            setLog("변환 완료! 아래 결과를 확인하세요.");
        } catch (err) {
            setConvertedJson(null);
            setLog("JSON 변환 오류: " + (err as Error).message);
        }
    }

    // ---------------------------
    // 2) DB 업로드
    // ---------------------------
    async function handleUpload() {
        if (!convertedJson) {
            setLog("먼저 변환을 진행하세요.");
            return;
        }

        try {
            let uploadLog = "";

            for (const r of convertedJson) {
                const racketId = await uploadRacketToDB(r);
                uploadLog += `라켓 업로드 완료 → racket_id=${racketId}\n`;
            }

            setLog(uploadLog);
        } catch (err) {
            setLog("업로드 오류: " + (err as Error).message);
        }
    }

    return (
        <div className="p-8 container mx-auto">
            <h1 className="text-2xl font-bold mb-4">라켓 JSON 업로드</h1>

            {/* JSON 입력 */}
            <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="크롤링된 JSON 객체 또는 배열을 입력하세요"
                className="h-96 mb-4"
            />

            {/* 변환 버튼 */}
            <Button onClick={handleConvert} className="mr-4">
                변환
            </Button>


            {/* 변환된 JSON 보기 */}
            {convertedJson && (
                <div>
                    <pre className="mt-6 p-4 bg-slate-900 text-green-300 text-sm rounded overflow-x-auto">
                        {JSON.stringify(convertedJson, null, 2)}
                    </pre>
                    <Button onClick={handleUpload} className="bg-slate-200 border border-slate-400 text-blck mt-4" disabled={!convertedJson}>
                        업로드
                    </Button>
                </div>
            )}

            {/* 로그 출력 */}
            {log && (
                <pre className="mt-6 p-4 bg-black text-white text-sm rounded whitespace-pre-wrap">
                    {log}
                </pre>
            )}
        </div>
    );
}

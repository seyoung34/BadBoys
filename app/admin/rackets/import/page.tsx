"use client";

import { useState } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { processRacketJson, processRacketJsonList } from "./processRacket";

export default function UploadRacketPage() {
    const [jsonText, setJsonText] = useState("");
    const [result, setResult] = useState("");

    async function handleUpload() {
        try {
            const parsed = JSON.parse(jsonText);

            const output = Array.isArray(parsed)
                ? await processRacketJsonList(parsed)
                : [await processRacketJson(parsed)];

            setResult(JSON.stringify(output, null, 2));
        } catch (err) {
            setResult("JSON Parse Error: " + (err as Error).message);
        }
    }




    return (
        <div className="p-8 container mx-auto">
            <h1 className="text-2xl font-bold mb-4">라켓 JSON 업로드</h1>

            <Textarea
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder="크롤링된 JSON을 여기에 붙여넣기"
                className="h-96 mb-4"
            />

            <Button onClick={handleUpload}>업로드</Button>

            {result && (
                <pre className="mt-6 p-4 bg-black text-white text-sm rounded">
                    {result}
                </pre>
            )}
        </div>
    );
}

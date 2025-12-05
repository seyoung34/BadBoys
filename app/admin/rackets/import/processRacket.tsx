"use server";

import { supabase } from "@/app/lib/supabaseClient";
import {
    NormalizedRacketInput,
    RacketCrawlInput
} from "../../../lib/types";


// ------------------------------
// 유틸
// ------------------------------
function extractNumber(value: string | null | undefined): number | null {
    if (!value) return null;
    const m = value.match(/\d+/);   //정수만 빼기
    return m ? Number(m[0]) : null;
}

function extractWeightCategory(text: string | null | undefined): string | null {
    if (!text) return null;
    const m = text.match(/([2345]U)/i); // 2U,3U,4U,5U 만 추출
    return m ? m[1].toUpperCase() : null;
}

function convertFlexToScale(flex: string | null | undefined): number | null {
    if (!flex) return null;
    const f = flex.toLowerCase();

    //todo sitffness 케이스 추가 하기
    if (f.includes("hi-flex")) return 2;
    if (f.includes("flexible")) return 3;
    if (f.includes("medium")) return 5;
    if (f.includes("stiff")) return 8;
    if (f.includes("extra stiff")) return 9;

    return null;
}

function extractGripSize(value: string | null | undefined): string | null {
    if (!value) return null;
    const m = value.match(/G[1-6]/i);
    return m ? m[0].toUpperCase() : null;
}

function extractPrice(v: string | null | undefined): number | null {
    if (!v) return null;
    const clean = v.replace(/[^0-9]/g, "");
    return clean ? Number(clean) : null;
}

function extractLength(v: string | null | undefined): number | null {
    if (!v) return null;
    const m = v.match(/(\d+)\s*mm/i);
    return m ? Number(m[1]) : null;
}


// ------------------------------------------------------
// ✨ RacketRow를 목표로 하는 Normalized 데이터 생성 함수
// ------------------------------------------------------
export async function processRacketJson(input: RacketCrawlInput): Promise<NormalizedRacketInput> {


    const variant = {
        weight: extractNumber(input.weight),
        weightCategory: extractWeightCategory(input.weight) ?? extractWeightCategory(input.weightGrip),
        balanceType: input.balance ?? null,
        shaft: convertFlexToScale(input.shaftFlex),
        gripSize: extractGripSize(input.gripSize),
        maxTension: extractNumber(input.maxTension),
        price: extractPrice(input.price),
        color: input.color ?? null,
        isDefault: true
    };

    const normalized: NormalizedRacketInput = {
        name: input.name,
        brandName: input.brand,
        seriesName: input.series ?? null,
        note: input.rawSpec ?? null,
        variants: [variant]
    };

    return normalized;
}

export async function processRacketJsonList(list: RacketCrawlInput[]): Promise<NormalizedRacketInput[]> {
    const results: NormalizedRacketInput[] = [];

    for (const item of list) {
        const r = await processRacketJson(item);  // 기존 함수 재사용
        results.push(r);
    }

    return results;
}


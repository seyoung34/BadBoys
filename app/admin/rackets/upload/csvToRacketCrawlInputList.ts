// csvToRacketCrawlInput.ts
import { RacketCrawlInput } from "@/app/lib/types";

function splitLine(line: string, delimiter: string): string[] {
    return line.split(delimiter).map(v => v.trim());
}

function detectDelimiter(headerLine: string): string {
    if (headerLine.includes("\t")) return "\t";
    return ","; // 기본 CSV
}

export function csvToRacketCrawlInputList(csvText: string): RacketCrawlInput[] {
    const lines = csvText
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);

    if (lines.length < 2) {
        throw new Error("CSV에 데이터가 없습니다.");
    }

    const delimiter = detectDelimiter(lines[0]);
    const headers = splitLine(lines[0], delimiter);

    const results: RacketCrawlInput[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = splitLine(lines[i], delimiter);

        const row: Partial<RacketCrawlInput> = {};

        headers.forEach((h, idx) => {
            const v = values[idx] ?? "";

            switch (h.toLowerCase()) {
                case "name":
                case "라켓명":
                    row.name = v;
                    break;

                case "brand":
                case "브랜드":
                    row.brand = v;
                    break;

                case "series":
                case "시리즈":
                    row.series = v || null;
                    break;

                case "weight":
                case "무게":
                    row.weight = v || null;
                    break;

                case "weightcategory":
                case "무게분류":
                    row.weightCategory = v || null;
                    break;

                case "balance":
                case "balancetype":
                case "밸런스":
                    row.balanceType = v || null;
                    break;

                case "shaft":
                case "flex":
                case "샤프트":
                    row.shaft = v || null;
                    break;

                case "gripsize":
                case "그립":
                    row.gripSize = v || null;
                    break;

                case "maxtension":
                case "텐션":
                    row.maxTension = v || null;
                    break;

                case "price":
                case "가격":
                    row.price = v || null;
                    break;

                case "color":
                case "색상":
                    row.color = v || null;
                    break;

                case "rawspec":
                case "spec":
                case "비고":
                    row.rawSpec = v || null;
                    break;

                default:
                    // 알 수 없는 컬럼은 무시 (확장 대비)
                    break;
            }
        });

        if (!row.name || !row.brand) {
            throw new Error(`필수 컬럼(name, brand) 누락 (line ${i + 1})`);
        }

        results.push(row as RacketCrawlInput);
    }

    return results;
}

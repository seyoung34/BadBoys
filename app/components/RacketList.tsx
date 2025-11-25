"use client";

import { useMemo, useState } from "react";
import type { RacketRow } from "@/app/lib/rackets";

type Props = {
    rackets: RacketRow[];
};

export default function RacketList({ rackets }: Props) {
    const [selectedBrand, setSelectedBrand] = useState<string>("all");
    const [selectedTag, setSelectedTag] = useState<string>("all");

    const brands = useMemo(
        () =>
            Array.from(
                new Set(
                    rackets
                        .map((r) => r.brands?.name)
                        .filter((b): b is string => Boolean(b))
                )
            ),
        [rackets]
    );

    const tags = useMemo(
        () =>
            Array.from(
                new Set(
                    rackets
                        .flatMap((r) =>
                            r.racket_tags
                                .map((rt) => rt.tags?.name)
                                .filter((t): t is string => Boolean(t))
                        )
                )
            ),
        [rackets]
    );

    const filtered = useMemo(() => {
        return rackets.filter((r) => {
            const b = r.brands?.name ?? "";
            const tagNames = r.racket_tags
                .map((rt) => rt.tags?.name)
                .filter((t): t is string => Boolean(t));

            const brandOk =
                selectedBrand === "all" ? true : b === selectedBrand;

            const tagOk =
                selectedTag === "all"
                    ? true
                    : tagNames.includes(selectedTag);

            return brandOk && tagOk;
        });
    }, [rackets, selectedBrand, selectedTag]);

    return (
        <div className="space-y-4">
            {/* 필터 영역 */}
            <section className="flex flex-wrap items-center gap-3 rounded-md bg-white p-3 shadow">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">브랜드</span>
                    <select
                        className="border rounded px-2 py-1 text-sm"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                        <option value="all">전체</option>
                        {brands.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">태그</span>
                    <select
                        className="border rounded px-2 py-1 text-sm"
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                    >
                        <option value="all">전체</option>
                        {tags.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="ml-auto text-xs text-black">
                    총 {filtered.length}개 / 전체 {rackets.length}개
                </div>
            </section>

            {/* 리스트 영역 */}
            <section className="grid gap-4 md:grid-cols-2">
                {filtered.map((r) => (
                    <article
                        key={r.id}
                        className="rounded-lg bg-white p-4 shadow hover:shadow-md transition-shadow"
                    >
                        <header className="mb-2 flex items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base font-semibold text-black">
                                    {r.name}
                                </h2>
                                <p className="text-xs text-black">
                                    {r.brands?.name ?? "Unknown"} ·{" "}
                                    {r.series?.name ?? "-"}
                                </p>
                            </div>

                            {r.price && (
                                <span className="text-sm font-semibold text-slate-800">
                                    {r.price.toLocaleString()}원
                                </span>
                            )}
                        </header>

                        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2 text-black">
                            <div>
                                <dt className="text-black">무게</dt>
                                <dd>
                                    {r.weight ?? "-"} g ({r.weightCategory ?? "-"})
                                </dd>
                            </div>
                            <div>
                                <dt className="text-black">밸런스</dt>
                                <dd>{r.balanceType ?? "-"}</dd>
                            </div>
                            <div>
                                <dt className="text-black">최대 텐션</dt>
                                <dd>{r.maxTension ? `${r.maxTension} lbs` : "-"}</dd>
                            </div>
                            <div>
                                <dt className="text-black">그립</dt>
                                <dd>{r.gripSize ?? "-"}</dd>
                            </div>
                            <div>
                                <dt className="text-black">샤프트</dt>
                                <dd>{r.shaft ?? "-"} / 10</dd>
                            </div>
                            <div>
                                <dt className="text-black">스타일</dt>
                                <dd>{r.playStyle ?? "-"}</dd>
                            </div>
                        </dl>

                        {/* 태그 */}
                        <div className="flex flex-wrap gap-1 mb-2">
                            {r.racket_tags.map((rt, idx) => {
                                const tagName = rt.tags?.name;
                                if (!tagName) return null;

                                return (
                                    <span
                                        key={tagName + idx}
                                        className="rounded-full border px-2 py-0.5 text-[11px] text-slate-700"
                                    >
                                        {tagName}
                                    </span>
                                );
                            })}
                            {r.racket_tags.length === 0 && (
                                <span className="text-[11px] text-slate-400">
                                    태그 없음
                                </span>
                            )}
                        </div>

                        {/* 링크 */}
                        {r.linkURL && (
                            <a
                                href={r.linkURL}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 underline"
                            >
                                제조사 페이지 열기
                            </a>
                        )}

                        {/* 비고 */}
                        {r.note && (
                            <p className="mt-2 text-xs text-slate-600">
                                {r.note}
                            </p>
                        )}
                    </article>
                ))}
            </section>
        </div>
    );
}

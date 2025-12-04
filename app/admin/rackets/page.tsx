// app/admin/rackets/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRackets } from "@/app/lib/rackets";
import type { RacketRow } from "@/app/lib/types";
import { Button } from "@/app/components/ui/button";

export default function AdminRacketListPage() {
    const [rackets, setRackets] = useState<RacketRow[]>([]);
    const [loading, setLoading] = useState(true);

    //캐싱
    useEffect(() => {
        async function load() {
            const data = await fetchRackets();
            setRackets(data);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return <p className="text-slate-600">불러오는 중...</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">라켓 관리</h1>
                <Link href="/admin/rackets/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        + 새 라켓 추가
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-200 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-2 font-semibold">ID</th>
                            <th className="px-4 py-2 font-semibold">이름</th>
                            <th className="px-4 py-2 font-semibold">브랜드</th>
                            <th className="px-4 py-2 font-semibold">시리즈</th>
                            <th className="px-4 py-2 font-semibold">무게</th>
                            <th className="px-4 py-2 font-semibold">가격</th>
                            <th className="px-4 py-2 font-semibold">대표 이미지</th>
                            <th className="px-4 py-2 font-semibold">관리</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rackets.map((r) => (
                            <tr key={r.id} className="border-b border-slate-200 last:border-none">
                                <td className="px-4 py-3">{r.id}</td>
                                <td className="px-4 py-3 font-medium">{r.name}</td>
                                <td className="px-4 py-3">{r.brandName}</td>
                                <td className="px-4 py-3">{r.seriesName}</td>
                                <td className="px-4 py-3">{r.weight ?? "-"}</td>
                                <td className="px-4 py-3">{r.price?.toLocaleString()}원</td>

                                {/* 대표 이미지 */}
                                <td className="px-4 py-3">
                                    {r.mainImage?.url ? (
                                        <img
                                            src={r.mainImage.url}
                                            className="w-16 h-16 object-cover rounded border"
                                            alt={r.mainImage.alt ?? ""}
                                        />
                                    ) : (
                                        <span className="text-slate-400 text-xs">없음</span>
                                    )}
                                </td>

                                {/* 버튼 영역 */}
                                <td className="px-4 py-3 flex gap-2">
                                    <Link href={`/admin/rackets/${r.id}/edit`}>
                                        <Button variant="outline" className="text-xs">수정</Button>
                                    </Link>
                                    <Link href={`/admin/rackets/${r.id}/images`}>
                                        <Button variant="outline" className="text-xs">이미지</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

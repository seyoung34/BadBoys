"use client";

import { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { FilterSidebar, type FilterState } from "./components/FilterSidebar";
import { RacketCard } from "./components/RacketCard";
import { RacketDetail } from "./components/RacketDetail";
import { RacketRow } from "./lib/types";
import { Input } from "./components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

type Props = {
    rackets: RacketRow[];
};

export default function HomePage({ rackets }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("featured");
    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        maxPrice: 500000,
        weightCategories: [],
        balanceTypes: [],
        stiffness: []
    });

    const [selectedRacket, setSelectedRacket] = useState<RacketRow | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // ----------------------------------------------------------
    //                 필터링 로직
    // ----------------------------------------------------------
    const filteredRackets = useMemo(() => {
        const search = searchQuery.toLowerCase();

        return rackets.filter((r) => {
            // =============================================
            // 검색: 이름, 태그, 시리즈
            // =============================================

            const matchesName = r.name?.toLowerCase().includes(search);

            const tagNames =
                r.tags
                    ?.map((t) => t?.name ?? "")
                    .filter((n): n is string => Boolean(n)) ?? [];

            const matchesTag = tagNames.some((t) =>
                t.toLowerCase().includes(search)
            );

            const matchesSeries = r.seriesName
                ?.toLowerCase()
                .includes(search);

            // 검색 문자열 기반 조건
            const matchesSearch = matchesName || matchesTag || matchesSeries;

            // =============================================
            // 브랜드 필터
            // =============================================
            const matchesBrand =
                filters.brands.length === 0 ||
                filters.brands.includes(r.brandName ?? "");

            // =============================================
            // 가격 필터 (variant.price 중 하나라도 조건 충족)
            // =============================================
            const matchesPrice = r.variants.some(
                (v) => (v.price ?? Infinity) <= filters.maxPrice
            );

            // =============================================
            // 무게 필터 (variants 기반)
            // =============================================
            const matchesWeightCategory =
                filters.weightCategories.length === 0 ||
                r.variants.some((v) =>
                    filters.weightCategories.includes(v.weightCategory ?? "")
                );

            // =============================================
            // 밸런스 필터
            // =============================================
            const matchesBalance =
                filters.balanceTypes.length === 0 ||
                r.variants.some((v) =>
                    filters.balanceTypes.includes(v.balanceType ?? "")
                );

            // =============================================
            // 샤프트 강성 필터 (숫자 비교)
            // =============================================
            const matchesStiffness =
                filters.stiffness.length === 0 ||
                r.variants.some((v) =>
                    filters.stiffness.includes(v.shaft ?? -1)
                );

            return (
                matchesSearch &&
                matchesBrand &&
                matchesPrice &&
                matchesWeightCategory &&
                matchesBalance &&
                matchesStiffness
            );
        });
    }, [rackets, searchQuery, filters]);

    // ----------------------------------------------------------
    //                 정렬 로직
    // ----------------------------------------------------------
    const sortedRackets = useMemo(() => {
        const list = [...filteredRackets];

        switch (sortOption) {
            case "price-asc":
                return list.sort((a, b) => {
                    const pa = a.variants[0]?.price ?? Infinity;
                    const pb = b.variants[0]?.price ?? Infinity;
                    return pa - pb;
                });

            case "price-desc":
                return list.sort((a, b) => {
                    const pa = a.variants[0]?.price ?? 0;
                    const pb = b.variants[0]?.price ?? 0;
                    return pb - pa;
                });

            case "name-asc":
                return list.sort((a, b) => a.name.localeCompare(b.name));

            default:
                return list;
        }
    }, [filteredRackets, sortOption]);


    const handleRacketClick = (racket: RacketRow) => {
        setSelectedRacket(racket);
        setDetailOpen(true);
    };




    // ----------------------------------------------------------
    //                 렌더링
    // ----------------------------------------------------------
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* 타이틀 + 검색 */}
                <div className="max-w-2xl mx-auto mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold">
                        인생 <span className="text-blue-600">라켓</span>을 찾아라
                    </h1>

                    <div className="relative mt-8 max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-12 h-14 rounded-full"
                            placeholder="이름, 태그, 시리즈 등을 검색하세요"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* 데스크톱 필터 */}
                    <aside className="hidden md:block w-64">
                        <FilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            rackets={rackets}
                        />
                    </aside>

                    {/* 모바일 필터 */}
                    <div className="md:hidden w-full mb-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full h-12">
                                    <SlidersHorizontal className="mr-2" />
                                    필터
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[320px]">
                                <FilterSidebar
                                    filters={filters}
                                    setFilters={setFilters}
                                    rackets={rackets}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* 결과 Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-slate-500">
                                결과 <span className="text-slate-900 font-bold">{sortedRackets.length}</span> 개
                            </p>

                            <Select value={sortOption} onValueChange={setSortOption}>
                                <SelectTrigger className="w-[180px] bg-white border-slate-200">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">기본</SelectItem>
                                    <SelectItem value="price-asc">가격 오름차순</SelectItem>
                                    <SelectItem value="price-desc">가격 내림차순</SelectItem>
                                    <SelectItem value="name-asc">이름순</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {sortedRackets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedRackets.map((r) => (
                                    <RacketCard key={r.id} racket={r} onClick={handleRacketClick} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border rounded-xl bg-white">
                                <Search className="mx-auto text-slate-300 w-10 h-10" />
                                <h3 className="mt-4 text-lg font-medium">조건에 맞는 결과가 없습니다</h3>

                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    onClick={() => {
                                        setFilters({
                                            brands: [],
                                            maxPrice: 500000,
                                            weightCategories: [],
                                            balanceTypes: [],
                                            stiffness: []
                                        });
                                        setSearchQuery("");
                                    }}
                                >
                                    초기화
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <RacketDetail
                racket={selectedRacket}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
        </div>
    );
}

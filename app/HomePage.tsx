"use client"
import { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { FilterSidebar, type FilterState } from "./components/FilterSidebar";
import { RacketCard } from "./components/RacketCard";
import { RacketDetail } from "./components/RacketDetail";
import { RacketRow } from "./lib/rackets";
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
        maxPrice: 250000,
        weightCategory: [],
        balances: [],
        stiffness: []
    });
    const [selectedRacket, setSelectedRacket] = useState<RacketRow | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const filteredRackets = useMemo(() => {
        return rackets.filter((racket) => {
            const search = searchQuery.toLowerCase();

            //이름
            const matchesName = racket.name?.toLowerCase().includes(search);


            const tagNames = racket.racket_tags?.map(
                rt => rt.tags?.name ?? ""
            ).filter(Boolean);

            //태그
            const matchesTag = tagNames.some(t =>
                t.toLowerCase().includes(search)
            );

            //시리즈
            const matchesSeries = racket.series?.name
                ?.toLowerCase()
                .includes(search);

            //브랜드
            const matchesBrand =
                filters.brands.length === 0 ||
                filters.brands.includes(racket.brands?.name ?? "");

            //가격
            const matchesPrice =
                !racket.price || racket.price <= filters.maxPrice;

            //무게 분류
            const matchesWeightCategory =
                filters.weightCategory.length === 0 ||
                filters.weightCategory.includes(racket.weightCategory ?? "");

            //밸런스 타입
            const matchesBalanceType =
                filters.balances.length === 0 ||
                filters.balances.includes(racket.balanceType ?? "");

            return (matchesName || matchesTag || matchesSeries) &&
                matchesBrand && matchesPrice && matchesWeightCategory && matchesBalanceType;
        });
    }, [rackets, searchQuery, filters]);


    const handleRacketClick = (racket: RacketRow) => {
        setSelectedRacket(racket);
        setDetailOpen(true);
    };

    console.log(rackets);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* 메인 타이틀과 검색창 */}
                <div className="max-w-2xl mx-auto mb-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        인생 <span className="text-blue-600">라켓</span>을 찾아라
                    </h1>

                    {/* 검색박스 */}
                    <div className="relative mt-8 max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                            className="pl-12 h-14 text-lg bg-white border-slate-200 shadow-lg shadow-slate-200/50 rounded-full focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-shadow hover:shadow-xl"
                            placeholder="이름, 스타일 등으로 검색해보세요"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 메인 내용 */}
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* 사이드바 (Desktop) */}
                    <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24">
                        <FilterSidebar filters={filters} setFilters={setFilters} rackets={rackets} />
                    </aside>

                    {/* 모바일 Filter Trigger */}
                    <div className="md:hidden w-full mb-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full flex gap-2 h-12 border-slate-200 bg-white text-slate-700 shadow-sm">
                                    <SlidersHorizontal className="h-4 w-4" /> Filter Results
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto bg-white">
                                <div className="pt-6">
                                    <FilterSidebar filters={filters} setFilters={setFilters} rackets={rackets} className="border-none shadow-none p-0" />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* 결과 Grid */}
                    <div className="flex-1 w-full">
                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-slate-500 font-medium">
                                결과  <span className="text-slate-900 font-bold">{filteredRackets.length}</span> 개
                            </p>
                            {/* 정렬 */}
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

                        {/* 검색 결과 아이템들 */}
                        {filteredRackets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
                                {filteredRackets.map(racket => (
                                    <RacketCard key={racket.id} racket={racket} onClick={handleRacketClick} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-2">조건에 맞는 결과가 없어요</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-6">다른 조건으로 검색해보세요.</p>
                                <Button
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-white"
                                    onClick={() => {
                                        setFilters({ brands: [], maxPrice: 250000, weights: [], balances: [], stiffness: [] });
                                        setSearchQuery("");
                                    }}
                                >
                                    조건 & 검색 초기화
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

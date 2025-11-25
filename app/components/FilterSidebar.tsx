"use client";

import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { X } from "lucide-react";
import { RacketRow } from "../../lib/rackets";
import { useMemo } from "react";

export interface FilterState {
  brands: string[];
  maxPrice: number;
  weights: string[]; // weightCategory 사용
  balances: string[];
  stiffness: number[]; // shaft 값 기반
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  rackets: RacketRow[];     // ★ rackets 전달받도록 수정
  onClose?: () => void;
  className?: string;
}

export function FilterSidebar({ filters, setFilters, rackets, onClose, className }: FilterSidebarProps) {

  // 동적 필터 목록 생성
  const brandOptions = useMemo(
    () => Array.from(
      new Set(
        rackets.map(r => r.brands?.name).filter((v): v is string => Boolean(v))
      )
    ),
    [rackets]
  );

  const weightOptions = useMemo(
    () => Array.from(
      new Set(
        rackets.map(r => r.weightCategory).filter((v): v is string => Boolean(v))
      )
    ),
    [rackets]
  );

  const balanceOptions = useMemo(
    () => Array.from(
      new Set(
        rackets.map(r => r.balanceType).filter((v): v is string => Boolean(v))
      )
    ),
    [rackets]
  );

  const stiffnessOptions = useMemo(
    () => Array.from(
      new Set(
        rackets.map(r => r.shaft).filter((v): v is number => v !== null && v !== undefined)
      )
    ).sort((a, b) => a - b),
    [rackets]
  );

  // 배열 필터 토글 함수
  function toggleArrayFilter<K extends keyof FilterState>(
    key: K,
    value: string | number
  ) {
    const current = filters[key] as (string | number)[];
    const newArr = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    setFilters({ ...filters, [key]: newArr });
  }



  // 초기화
  const clearFilters = () => {
    setFilters({
      brands: [],
      maxPrice: 500000,
      weights: [],
      balances: [],
      stiffness: []
    });
  };

  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-fit ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-slate-900">검색 조건</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 h-8 px-2 text-xs hover:text-blue-600">
            초기화
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 가격 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <Label className="text-sm font-semibold text-slate-700">최대 가격</Label>
          <span className="text-sm font-medium text-blue-600">{filters.maxPrice.toLocaleString()}원</span>
        </div>
        <Slider
          value={[filters.maxPrice]}
          max={500000}
          step={1000}
          onValueChange={(vals: number[]) => setFilters({ ...filters, maxPrice: vals[0] })}
        />
      </div>

      <Separator className="my-6" />

      {/* 브랜드 */}
      <Label className="text-sm font-semibold block mb-3">브랜드</Label>
      {brandOptions.map(brand => (
        <div key={brand} className="flex items-center space-x-2 mb-2">
          <Checkbox
            checked={filters.brands.includes(brand)}
            onCheckedChange={() => toggleArrayFilter("brands", brand)}
          />
          <span className="text-sm text-slate-600">{brand}</span>
        </div>
      ))}

      <Separator className="my-6" />

      {/* 무게 */}
      <Label className="text-sm font-semibold block mb-3">무게</Label>
      <div className="flex flex-wrap gap-2">
        {weightOptions.map(weight => (
          <button
            key={weight}
            onClick={() => toggleArrayFilter("weights", weight)}
            className={`px-3 py-1 text-xs rounded-full border ${filters.weights.includes(weight)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200"
              }`}
          >
            {weight}
          </button>
        ))}
      </div>

      {/* 밸런스 */}
      <Label className="text-sm font-semibold block mt-6 mb-3">밸런스</Label>
      <div className="flex flex-wrap gap-2">
        {balanceOptions.map(b => (
          <button
            key={b}
            onClick={() => toggleArrayFilter("balances", b)}
            className={`px-3 py-1 text-xs rounded-full border ${filters.balances.includes(b)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200"
              }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* 샤프트 */}
      <Label className="text-sm font-semibold block mt-6 mb-3">샤프트 강성</Label>
      <div className="flex flex-wrap gap-2">
        {stiffnessOptions.map(s => (
          <button
            key={s}
            onClick={() => toggleArrayFilter("stiffness", s)}
            className={`px-3 py-1 text-xs rounded-full border ${filters.stiffness.includes(s)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200"
              }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

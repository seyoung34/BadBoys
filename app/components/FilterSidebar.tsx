"use client";

import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { X } from "lucide-react";
import { useMemo } from "react";
import { RacketRow } from "../lib/types";

export interface FilterState {
  brands: string[];
  maxPrice: number;
  weightCategories: string[];
  balanceTypes: string[];
  stiffness: number[];
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  rackets: RacketRow[];
  onClose?: () => void;
  className?: string;
}

export function FilterSidebar({
  filters,
  setFilters,
  rackets,
  onClose,
  className
}: FilterSidebarProps) {

  // ================================
  // 옵션 목록 생성
  // ================================

  // 브랜드
  const brandOptions = useMemo(
    () =>
      Array.from(
        new Set(
          rackets
            .map((r) => r.brandName)
            .filter((v): v is string => Boolean(v))
        )
      ),
    [rackets]
  );

  // 무게 카테고리 (variants 기반)
  const weightOptions = useMemo(
    () =>
      Array.from(
        new Set(
          rackets.flatMap((r) =>
            r.variants
              .map((v) => v.weightCategory)
              .filter((x): x is string => Boolean(x))
          )
        )
      ),
    [rackets]
  );

  // 밸런스 타입
  const balanceOptions = useMemo(
    () =>
      Array.from(
        new Set(
          rackets.flatMap((r) =>
            r.variants
              .map((v) => v.balanceType)
              .filter((x): x is string => Boolean(x))
          )
        )
      ),
    [rackets]
  );

  // 샤프트 강성 (숫자)
  const stiffnessOptions = useMemo(
    () =>
      Array.from(
        new Set(
          rackets.flatMap((r) =>
            r.variants
              .map((v) => v.shaft)
              .filter((x): x is number => x !== null && x !== undefined)
          )
        )
      ).sort((a, b) => a - b),
    [rackets]
  );

  // ================================
  // 필터 토글 공통 함수
  // ================================
  function toggleArrayFilter<K extends keyof FilterState>(
    key: K,
    value: string | number
  ) {
    const arr = filters[key] as (string | number)[];
    const newArr = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];

    setFilters({ ...filters, [key]: newArr });
  }

  // ================================
  // 초기화
  // ================================
  const clearFilters = () => {
    setFilters({
      brands: [],
      maxPrice: 500000,
      weightCategories: [],
      balanceTypes: [],
      stiffness: []
    });
  };

  // ================================
  // 렌더링
  // ================================
  return (
    <div
      className={`bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-fit ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-slate-900">검색 조건</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-500 h-8 px-2 text-xs hover:text-blue-600"
          >
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
          <span className="text-sm font-medium text-blue-600">
            {filters.maxPrice.toLocaleString()}원
          </span>
        </div>
        <Slider
          value={[filters.maxPrice]}
          max={500000}
          step={1000}
          onValueChange={(vals) =>
            setFilters({ ...filters, maxPrice: vals[0] })
          }
        />
      </div>

      <Separator className="my-6" />

      {/* 브랜드 */}
      <Label className="text-sm font-semibold block mb-3">브랜드</Label>
      {brandOptions.map((brand) => (
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
        {weightOptions.map((w) => (
          <button
            key={w}
            onClick={() => toggleArrayFilter("weightCategories", w)}
            className={`px-3 py-1 text-xs rounded-full border ${filters.weightCategories.includes(w)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200"
              }`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* 밸런스 */}
      <Label className="text-sm font-semibold block mt-6 mb-3">밸런스</Label>
      <div className="flex flex-wrap gap-2">
        {balanceOptions.map((b) => (
          <button
            key={b}
            onClick={() => toggleArrayFilter("balanceTypes", b)}
            className={`px-3 py-1 text-xs rounded-full border ${filters.balanceTypes.includes(b)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200"
              }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* 샤프트 강성 */}
      <Label className="text-sm font-semibold block mt-6 mb-3">샤프트 강성</Label>
      <div className="flex flex-wrap gap-2">
        {stiffnessOptions.map((s) => (
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

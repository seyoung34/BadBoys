import type { RacketRow } from "../lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

interface RacketDetailProps {
  racket: RacketRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RacketDetail({ racket, open, onOpenChange }: RacketDetailProps) {

  // Hook은 무조건 컴포넌트 최상단에서 실행
  const [currentIndex, setCurrentIndex] = useState(0);

  // racket === null일 때도 안전하게 처리할 기본값
  const images = useMemo(() => {
    if (!racket) return [];
    const arr = [...(racket.images ?? [])];
    if (racket.mainImage) {
      return [racket.mainImage, ...arr.filter((i) => i.id !== racket.mainImage!.id)];
    }
    return arr;
  }, [racket]);

  const defaultRacket = racket
    ? racket.variants.find(v => v.isDefault) ?? racket.variants[0]
    : null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[1000px] sm:max-w-[1000px] h-[90vh] p-0 overflow-hidden bg-white gap-0">

        {/* racket이 없으면 빈 UI 표시 */}
        {!racket ? (
          <div className="p-8 text-center text-slate-500">라켓 정보 없음</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-0 h-full">

            {/* 이미지 슬라이더 */}
            <div className="bg-slate-50 p-4 flex flex-col items-center justify-center relative">
              <div className="relative w-full flex items-center justify-center">
                {images.length > 1 && (
                  <button
                    onClick={() =>
                      setCurrentIndex(prev =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2"
                  >
                    <ChevronLeft />
                  </button>
                )}

                <img
                  src={currentImage?.linkURL ?? racket.mainImage?.linkURL ?? "https://images.unsplash.com/photo-1716155249759-b5f068f74e63?q=80&w=800&auto=format&fit=crop"}
                  alt={currentImage?.alt ?? racket.name}
                  className="max-h-[380px] object-contain"
                />

                {images.length > 1 && (
                  <button
                    onClick={() =>
                      setCurrentIndex(prev =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2"
                  >
                    <ChevronRight />
                  </button>
                )}
              </div>

              {/* 썸네일 */}
              {images.length > 1 && (
                <div className="flex absolute bottom-2 gap-2 mt-4 overflow-x-auto p-2">
                  {images.map((img, idx) => (
                    <img
                      key={img.id}
                      src={img.linkURL}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border 
                        ${currentIndex === idx ? "border-blue-500" : "border-transparent"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 오른쪽 상세 */}
            <div className="p-8 flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-4xl font-bold mt-4">
                  {racket.name}
                </DialogTitle>
              </DialogHeader>

              <p className="text-slate-600 mt-4">{racket.note}</p>

              <div className="h-full items-center justify-center flex">
                <div className="mt-8 w-full h-full flex flex-col justify-evenly">
                  <DetailRow label="무게" value={defaultRacket?.weightCategory} />
                  <DetailRow label="밸런스" value={defaultRacket?.balanceType} />
                  <DetailRow label="샤프트 강성" value={defaultRacket?.shaft} />
                  <DetailRow label="가격" bold value={
                    defaultRacket?.price?.toLocaleString() + "원"
                  } />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 ">
                {racket.tags.map(tag => (
                  <Badge key={tag.name} variant="secondary">
                    <Check className="w-3 h-3 mr-1" /> {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}


function DetailRow({
  label,
  value,
  bold = true
}: {
  label: string;
  value: string | number | null | undefined;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 w-full">
      <span className="text-xl text-slate-500">{label}</span>
      <span className={`text-sl ${bold ? "font-bold text-slate-900" : "font-semibold text-slate-900"}`}>
        {value ?? "-"}
      </span>
    </div>
  );
}

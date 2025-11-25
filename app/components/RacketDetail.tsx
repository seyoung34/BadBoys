
import type { RacketRow } from "../lib/rackets";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface RacketDetailProps {
  racket: RacketRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RacketDetail({ racket, open, onOpenChange }: RacketDetailProps) {
  if (!racket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white gap-0">
        <div className="grid md:grid-cols-2 gap-0">

          <div className="bg-slate-50 p-4 flex items-center justify-center relative">
            <img
              src={"https://images.unsplash.com/photo-1716155249759-b5f068f74e63?q=80&w=800&auto=format&fit=crop"}
              alt={racket.name}
              className="max-h-[400px] w-auto object-contain mix-blend-multiply"
            />
            {/* <div className="absolute top-4 left-4">
              <Badge className="bg-white text-slate-900 shadow-sm hover:bg-white border border-slate-100">
                {racket.series}
              </Badge>
            </div> */}
          </div>

          <div className="p-8 flex flex-col h-full">
            <div className="mb-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{racket.brands?.name}</span>
              </div>
              <DialogHeader className="mb-4 text-left">
                <DialogTitle className="text-3xl font-bold text-slate-900">{racket.name}</DialogTitle>
                <DialogDescription className="text-lg font-medium text-slate-500 hidden">
                  {racket.series?.name}
                </DialogDescription>
              </DialogHeader>

              {/* 설명 */}
              <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                {racket.note}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">무게</span>
                  <span className="font-semibold text-slate-900 text-sm">{racket.weightCategory}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">밸런스</span>
                  <span className="font-semibold text-slate-900 text-sm">{racket.balanceType}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">샤프트 강성</span>
                  <span className="font-semibold text-slate-900 text-sm">{racket.shaft}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">가격</span>
                  <span className="font-bold text-slate-900 text-xl">{racket.price?.toLocaleString()}원</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {racket.racket_tags.map(tag => (
                  <Badge key={tag.tags?.name} variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600">
                    <Check className="w-3 h-3 mr-1 text-blue-500" /> {tag.tags?.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* <div className="flex gap-3 mt-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Add to Compare</Button>
              <Button variant="outline" className="flex-1 border-slate-200 hover:bg-slate-50">Find Retailer</Button>
            </div> */}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}


import type { RacketRow, RacketVariant } from "../lib/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

interface RacketCardProps {
  racket: RacketRow;
  onClick: (racket: RacketRow) => void;
}

export function RacketCard({ racket, onClick }: RacketCardProps) {

  const defaultRacket: RacketVariant = racket.variants.find(r => r.isDefault === true) ?? racket.variants[0];

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-blue-300 border-transparent ring-1 ring-slate-100"
      onClick={() => onClick(racket)}
    >

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        <img
          src={racket.mainImage?.linkURL ?? "https://images.unsplash.com/photo-1716155249759-b5f068f74e63?q=80&w=800&auto=format&fit=crop"}
          alt={racket.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 mix-blend-multiply opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 shadow-sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="p-4 pb-2 space-y-1">
        <div className="flex justify-between items-center w-full">
          <p className="text-xs font-semibold text-blue-600 tracking-wide uppercase">{racket.brandName}</p>
          <span className="font-bold text-slate-900">{defaultRacket.price?.toLocaleString()}원</span>
        </div>
        <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">{racket.name}</h3>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {defaultRacket.weight}
          </Badge>
          <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {defaultRacket.balanceType}
          </Badge>
          <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {defaultRacket.shaft}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

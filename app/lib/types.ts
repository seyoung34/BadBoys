// ./lib/types.ts

export type RacketTag = {
    id: number;
    name: string;
    category: string | null;
};

export type RacketImage = {
    id: number;
    url: string;
    alt: string | null;
    orderIndex: number | null;
    isMain: boolean;
};

export type RacketVariant = {
    id: number;
    weight: number | null;
    weightCategory: string | null;
    balanceType: string | null;
    shaft: number | null;
    gripSize: string | null;
    maxTension: number | null;
    price: number | null;
    color: string | null;
    isDefault: boolean;
};

export type RacketRow = {
    id: number;
    name: string;
    note: string | null;

    brandName: string | null;
    seriesName: string | null;

    variants: RacketVariant[];

    mainImage: RacketImage | null;
    images?: RacketImage[];

    tags: RacketTag[];
};



export type RacketCrawlInput = {
    /** 필수 필드 */
    name: string;           // 라켓 이름
    brand: string;          // 제조사
    url: string;            // 상품 페이지 URL

    /** 선택 필드 – 어떤 형식이든 허용 */
    series?: string | null;
    weight?: string | null;
    weightGrip?: string | null;

    balance?: string | null;
    shaftFlex?: string | null;
    shaftMaterial?: string | null;
    frameMaterial?: string | null;

    maxTension?: string | null;
    length?: string | null;
    gripSize?: string | null;
    color?: string | null;
    price?: string | null;

    /** 전체 스펙 블록 (HTML 원문일 수도 있음) */
    rawSpec?: string | null;

    /** 파싱용 기타 필드 (계속 확장 가능) */
    extra?: Record<string, string | null>;

    /** 크롤링 시각 */
    crawledAt: string;
};

export type NormalizedRacketInput = {
    name: string;
    brandName: string;
    seriesName: string | null;
    note: string | null;
    variants: Omit<RacketVariant, "id">[];
};






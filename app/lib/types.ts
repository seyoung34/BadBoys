export type RacketTag = {
    name: string;
    category: string | null;
};

export type RacketMainImage = {
    id: number | null;
    url: string | null;
    alt: string | null;
    orderIndex: number | null;
    isMain: boolean | null;
};

export type RacketRow = {
    id: number;
    name: string;
    weight: number | null;
    weightCategory: string | null;
    balanceType: string | null;
    length: number | null;
    maxTension: number | null;
    playStyle: string | null;
    price: number | null;
    gripSize: string | null;
    shaft: number | null;
    linkURL: string | null;
    note: string | null;

    brandName: string | null;
    seriesName: string | null;

    mainImage: RacketMainImage | null;

    tags: RacketTag[];
};

export type RacketViewRow = {
    id: number;
    name: string;
    weight: number | null;
    weight_category: string | null;
    balance_type: string | null;
    length: number | null;
    max_tension: number | null;
    play_style: string | null;
    price: number | null;
    grip_size: string | null;
    shaft: number | null;
    link_url: string | null;
    note: string | null;

    brand_id: number | null;
    brand_name: string | null;

    series_id: number | null;
    series_name: string | null;

    main_image_id: number | null;
    main_image_url: string | null;
    main_image_alt: string | null;
    main_image_order_index: number | null;
    main_image_is_main: boolean | null;

    tags: {
        name: string;
        category: string | null;
    }[];
};

export type RacketViewCamelRow = {
    id: number;
    name: string;
    weight: number | null;
    weightCategory: string | null;
    balanceType: string | null;
    length: number | null;
    maxTension: number | null;
    playStyle: string | null;
    price: number | null;
    gripSize: string | null;
    shaft: number | null;
    linkURL: string | null;
    note: string | null;

    brandId: number | null;
    brandName: string | null;

    seriesId: number | null;
    seriesName: string | null;

    mainImageId: number | null;
    mainImageUrl: string | null;
    mainImageAlt: string | null;
    mainImageOrderIndex: number | null;
    mainImageIsMain: boolean | null;

    tags: {
        name: string;
        category: string | null;
    }[];
};

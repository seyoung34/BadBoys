//db 컬럼명 매핑

import { RacketImage } from "./types";

export type ImageRow = {
    id: number;
    url: string;
    alt: string | null;
    order_index: number;
    is_main: boolean;
};


export function mapDbToRacketImage(row: ImageRow): RacketImage {
    return {
        id: row.id,
        linkURL: row.url, // DB url → linkURL
        alt: row.alt,
        orderIndex: row.order_index,
        isMain: row.is_main,
    };
}

export function mapRacketImageToDb(img: RacketImage) {
    return {
        id: img.id,
        url: img.linkURL, // linkURL → DB url
        alt: img.alt,
        order_index: img.orderIndex,
        is_main: img.isMain,
    };
}


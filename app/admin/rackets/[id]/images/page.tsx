"use client";

import { RacketImageManager } from "../../../components/RacketImageManager";
import { useParams } from "next/navigation";

export default function RacketImagesPage() {
    const params = useParams();
    const racketId = Number(params.id);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">라켓 {racketId}번 이미지 관리</h1>
            <RacketImageManager racketId={racketId} />
        </div>
    );
}

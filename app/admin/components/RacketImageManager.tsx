"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { RacketImage } from "@/app/lib/types"
import { mapDbToRacketImage } from "@/app/lib/convertDB";


interface Props {
    racketId: number;
}

export function RacketImageManager({ racketId }: Props) {
    const [images, setImages] = useState<RacketImage[]>([]);
    const [loading, setLoading] = useState(true);

    // 대표 이미지 선택 상태(UI 전용)
    const [selectedMainId, setSelectedMainId] = useState<number | null>(null);

    // DB에서 이미지 목록 불러오기
    async function loadImages(): Promise<RacketImage[]> {
        const { data } = await supabase
            .from("racket_images")
            .select("*")
            .eq("racket_id", racketId)
            .order("order_index", { ascending: true });

        return (data ?? []).map(mapDbToRacketImage);
    }


    useEffect(() => {
        let mounted = true;

        async function fetch() {
            setLoading(true);
            const imgs = await loadImages();

            if (mounted) {
                setImages(imgs);

                // 기존 대표 이미지 UI 표시
                const main = imgs.find((x) => x.isMain);
                setSelectedMainId(main?.id ?? null);

                setLoading(false);
            }
        }

        fetch();

        return () => {
            mounted = false;
        };
    }, [racketId]);

    // 업로드
    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newImages: RacketImage[] = [];

        for (const file of files) {
            const filePath = `${racketId}/${crypto.randomUUID()}-${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from("Rackets")
                .upload(filePath, file);

            if (uploadError) {
                console.error(uploadError);
                continue;
            }

            const publicUrl = supabase.storage
                .from("Rackets")
                .getPublicUrl(filePath).data.publicUrl;

            const { data } = await supabase
                .from("racket_images")
                .insert({
                    racket_id: racketId,
                    url: publicUrl,
                    alt: file.name,
                    is_main: false,
                    order_index: images.length + newImages.length,
                })
                .select("*")
                .single();

            // 변환 후 사용
            newImages.push(mapDbToRacketImage(data));

        }

        setImages((prev) => [...prev, ...newImages]);
    }

    // 삭제
    async function deleteImage(image: RacketImage) {
        const path = image.linkURL.split("/storage/v1/object/public/Rackets/")[1];
        await supabase.storage.from("Rackets").remove([path]);

        await supabase.from("racket_images").delete().eq("id", image.id);

        loadImages().then((imgs) => {
            setImages(imgs);

            const main = imgs.find((x) => x.isMain);
            setSelectedMainId(main?.id ?? null);
        });
    }

    // 저장 버튼 클릭 → DB에 대표 이미지 반영
    async function saveMainImage() {
        if (selectedMainId == null) {
            alert("대표 이미지를 선택해주세요.");
            return;
        }

        // 기존 대표 해제
        await supabase
            .from("racket_images")
            .update({ is_main: false })
            .eq("racket_id", racketId);

        // 새로운 대표 설정
        await supabase
            .from("racket_images")
            .update({ is_main: true })
            .eq("id", selectedMainId);

        const imgs = await loadImages();
        setImages(imgs);

        alert("대표 이미지가 저장되었습니다.");
    }

    if (loading) return <p>불러오는 중…</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">이미지 관리</h2>

            {/* 업로드 */}
            <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                className="mb-6"
            />

            {/* 이미지 리스트 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="border rounded p-2 relative">
                        <img
                            src={img.linkURL}
                            alt={img.alt ?? ""}
                            className="w-full h-auto object-cover rounded"
                        />

                        <div className="mt-2 flex justify-between items-center">
                            {/* 라디오 버튼 (대표 선택) */}
                            <label className="flex items-center gap-1 text-sm">
                                <input
                                    type="radio"
                                    name="mainImage"
                                    checked={selectedMainId === img.id}
                                    onChange={() => setSelectedMainId(img.id)}
                                />
                                대표
                            </label>

                            <Button
                                variant="outline"
                                className="text-xs"
                                onClick={() => deleteImage(img)}
                            >
                                삭제
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 대표 이미지 저장 버튼 */}
            <Button
                onClick={saveMainImage}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
                대표 이미지 저장
            </Button>
        </div>
    );
}

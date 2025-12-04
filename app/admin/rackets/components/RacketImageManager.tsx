"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

type ImageRow = {
    id: number;
    url: string;
    alt: string | null;
    order_index: number;
    is_main: boolean;
};

interface Props {
    racketId: number;
}

export function RacketImageManager({ racketId }: Props) {
    const [images, setImages] = useState<ImageRow[]>([]);
    const [loading, setLoading] = useState(true);

    // 1) 이미지 목록 불러오기
    async function loadImages(): Promise<ImageRow[]> {
        const { data } = await supabase
            .from("racket_images")
            .select("*")
            .eq("racket_id", racketId)
            .order("order_index", { ascending: true });

        return data ?? [];
    }


    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            const imgs = await loadImages();
            if (isMounted) {
                setImages(imgs);
                setLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [racketId]);


    // 2) 다중 업로드 처리
    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newImages: ImageRow[] = [];

        for (const file of files) {
            const filePath = `${racketId}/${crypto.randomUUID()}-${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from("Rackets")
                .upload(filePath, file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                continue;
            }

            const publicUrl = supabase.storage
                .from("Rackets")
                .getPublicUrl(filePath).data.publicUrl;

            const { data: inserted, error } = await supabase
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

            if (!error && inserted) {
                newImages.push(inserted);
            }
        }

        setImages((prev) => [...prev, ...newImages]);
    }

    // 3) 대표 이미지 설정
    async function setMainImage(imageId: number) {
        await supabase
            .from("racket_images")
            .update({ is_main: false })
            .eq("racket_id", racketId);

        await supabase
            .from("racket_images")
            .update({ is_main: true })
            .eq("id", imageId);

        loadImages();
        console.log("대표 이미지 설정");
    }

    // 4) 삭제
    async function deleteImage(image: ImageRow) {
        // Storage 삭제
        const path = image.url.split("/storage/v1/object/public/Rackets/")[1];
        await supabase.storage.from("Rackets").remove([path]);

        // DB 삭제
        await supabase.from("racket_images").delete().eq("id", image.id);

        loadImages();
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="border rounded p-2 relative">
                        <img
                            src={img.url}
                            alt={img.alt ?? ""}
                            className="w-full h-32 object-cover rounded"
                        />

                        <div className="flex justify-between mt-2">
                            <Button
                                variant={img.is_main ? "default" : "outline"}
                                className="text-xs border-1 border-slate-900 "
                                onClick={() => setMainImage(img.id)}
                            >
                                대표
                            </Button>

                            <Button
                                variant="default"
                                className="text-xs border-1 border-slate-900"
                                onClick={() => deleteImage(img)}
                            >
                                삭제
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

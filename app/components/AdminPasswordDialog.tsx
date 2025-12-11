"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AdminPasswordDialog({ open, onOpenChange }: Props) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit() {
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS;

        if (!adminPass) {
            setError("관리자 비밀번호가 설정되지 않았습니다.");
            return;
        }

        if (password !== adminPass) {
            setError("비밀번호가 올바르지 않습니다.");
            return;
        }

        // ✅ 성공 → 관리자 페이지 이동
        onOpenChange(false);
        setPassword("");
        router.push("/admin");
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>관리자 접근</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="관리자 비밀번호 입력"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        확인
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

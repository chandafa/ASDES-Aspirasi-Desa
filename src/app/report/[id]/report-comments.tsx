"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowRight, Loader2, Send, User } from "lucide-react";
import type { Report, ReportComment } from "@/lib/types";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface ReportCommentsProps {
    report: Report;
    onCommentAdded: (newComment: ReportComment) => void;
}

export default function ReportComments({ report, onCommentAdded }: ReportCommentsProps) {
    const { user } = useAuth();
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || newComment.trim() === "") return;

        setIsSubmitting(true);
        const commentData: ReportComment = {
            userUid: user.uid,
            userName: user.displayName || "Warga",
            userAvatar: user.photoURL || "",
            text: newComment,
            createdAt: new Date().toISOString(),
        };

        try {
            const reportRef = doc(db, "reports", report.id);
            await updateDoc(reportRef, {
                comments: arrayUnion(commentData),
            });
            onCommentAdded(commentData);
            setNewComment("");
             toast({
                title: "Komentar Terkirim",
                description: "Terima kasih atas masukan Anda.",
            });
        } catch (error) {
            console.error("Error adding comment: ", error);
             toast({
                variant: "destructive",
                title: "Gagal Mengirim Komentar",
                description: "Terjadi kesalahan. Silakan coba lagi.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Diskusi & Komentar Warga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {report.comments && report.comments.length > 0 ? (
                        report.comments
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((comment, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={comment.userAvatar} />
                                        <AvatarFallback>
                                            {comment.userName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{comment.userName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(comment.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Belum ada komentar. Jadilah yang pertama berkomentar!
                        </p>
                    )}
                </div>

                <div className="border-t pt-6">
                    {user ? (
                        <form onSubmit={handleSubmitComment} className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.photoURL ?? ""} />
                                    <AvatarFallback>
                                        <User />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                     <Textarea
                                        placeholder="Tulis komentar Anda di sini..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        disabled={isSubmitting}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting || newComment.trim() === ""}>
                                    {isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 h-4 w-4" />
                                    )}
                                    Kirim
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center p-4 border rounded-lg bg-muted/50">
                            <p className="text-muted-foreground mb-4">
                                Anda harus masuk untuk dapat memberikan komentar.
                            </p>
                            <Button asChild>
                                <Link href="/auth/login">
                                    Login untuk Berkomentar
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

import { useState } from "react";
import { Copy, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/inputs/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/core/components/ui/table";
import { useAdTokens, useCreateAdToken } from "@/modules/ad-tokens/hooks/useAdTokens";

export default function AdTokensPage() {
    const [reference, setReference] = useState("");
    const { data: adTokens, isLoading } = useAdTokens();
    const createAdTokenMutation = useCreateAdToken();

    const link = 'https://выносмусора.рф/'
    const handleCreateToken = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reference.trim()) {
            toast.error("Поле референс не может быть пустым");
            return;
        }

        try {
            await createAdTokenMutation.mutateAsync({ reference: reference.trim() });
            setReference("");
            toast.success("Рекламная ссылка успешно создана");
        } catch (error) {
            console.error("Error creating ad token:", error);
        }
    };

    const handleCopyLink = async (token: string) => {
        const links = `${link}?adToken=${token}`;
        try {
            await navigator.clipboard.writeText(links);
            toast.success("Ссылка скопирована в буфер обмена");
        } catch (error) {
            toast.error("Не удалось скопировать ссылку");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Рекламные ссылки</h1>
            </div>

            <form onSubmit={handleCreateToken} className="flex gap-4 items-end">
                <div className="flex-1">
                    <label htmlFor="reference" className="block text-sm font-medium mb-2">
                        Референс
                    </label>
                    <Input
                        id="reference"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Введите референс для новой ссылки"
                        disabled={createAdTokenMutation.isPending}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={createAdTokenMutation.isPending || !reference.trim()}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Создать ссылку
                </Button>
            </form>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Дата создания</TableHead>
                            <TableHead>Референс</TableHead>
                            <TableHead>Ссылка</TableHead>
                            <TableHead>Количество переходов</TableHead>
                            <TableHead>Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {adTokens?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    Рекламные ссылки не найдены
                                </TableCell>
                            </TableRow>
                        ) : (
                            adTokens?.map((token) => (
                                <TableRow key={token.id}>
                                    <TableCell>
                                        {new Date(token.createdAt).toLocaleString("ru-RU")}
                                    </TableCell>
                                    <TableCell className="font-medium">{token.reference}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {link}?adToken={token.token}
                                    </TableCell>
                                    <TableCell>{token.clickCount}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopyLink(token.token)}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Копировать
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

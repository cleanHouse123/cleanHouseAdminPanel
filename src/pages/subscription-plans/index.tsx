import { useState } from 'react';
import { useSubscriptionPlans } from '@/modules/subscription-plans/hooks/useSubscriptionPlans';
import { SubscriptionPlan, SubscriptionPlanFormData } from '@/modules/subscription-plans/types/subscription-plan';
import { SubscriptionPlanCard } from '@/modules/subscription-plans/components/SubscriptionPlanCard';
import { SubscriptionPlanForm } from '@/modules/subscription-plans/components/SubscriptionPlanForm';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';

export const SubscriptionPlansPage = () => {
    const {
        plans,
        isLoading,
        createPlan,
        updatePlan,
        deletePlan,
        isCreating,
        isUpdating,
        isDeleting,
    } = useSubscriptionPlans();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
    const [deletingPlan, setDeletingPlan] = useState<SubscriptionPlan | null>(null);

    const handleCreatePlan = () => {
        setEditingPlan(null);
        setIsFormOpen(true);
    };

    const handleEditPlan = (plan: SubscriptionPlan) => {
        setEditingPlan(plan);
        setIsFormOpen(true);
    };

    const handleDeletePlan = (plan: SubscriptionPlan) => {
        setDeletingPlan(plan);
    };

    const handleConfirmDelete = () => {
        if (deletingPlan) {
            deletePlan(deletingPlan.id);
            setDeletingPlan(null);
        }
    };

    const handleFormSubmit = (formData: SubscriptionPlanFormData) => {
        const submitData = {
            ...formData,
            priceInKopecks: Math.round((formData.priceInRubles || 0) * 100),
        };

        if (editingPlan) {
            updatePlan(editingPlan.id, submitData);
        } else {
            createPlan(submitData);
        }
        setIsFormOpen(false);
        setEditingPlan(null);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingPlan(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Планы подписок</h1>
                    <p className="text-gray-600">Управление планами подписок</p>
                </div>
                <Button onClick={handleCreatePlan} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Создать план
                </Button>
            </div>

            {plans.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Планы подписок не найдены</h3>
                            <p className="text-gray-600 mb-4">Создайте первый план подписки</p>
                            <Button onClick={handleCreatePlan}>
                                <Plus className="w-4 h-4 mr-2" />
                                Создать план
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {plans.map((plan) => (
                        <SubscriptionPlanCard
                            key={plan.id}
                            plan={plan}
                            onEdit={handleEditPlan}
                            onDelete={handleDeletePlan}
                        />
                    ))}
                </div>
            )}

            {/* Форма создания/редактирования */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPlan ? 'Редактировать план подписки' : 'Создать план подписки'}
                        </DialogTitle>
                    </DialogHeader>
                    <SubscriptionPlanForm
                        plan={editingPlan || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                        isLoading={isCreating || isUpdating}
                    />
                </DialogContent>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog open={!!deletingPlan} onOpenChange={() => setDeletingPlan(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Подтверждение удаления</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Вы уверены, что хотите удалить план подписки <strong>"{deletingPlan?.name}"</strong>?</p>
                        <p className="text-sm text-gray-600 mt-2">Это действие нельзя отменить.</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeletingPlan(null)}>
                            Отмена
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                            {isDeleting ? 'Удаление...' : 'Удалить'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

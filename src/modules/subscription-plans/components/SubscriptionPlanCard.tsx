import { SubscriptionPlan } from '../types/subscription-plan';
import { Card } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Edit, Trash2, Package } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import { kopecksToRubles } from '@/core/utils/price';

interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
    onEdit: (plan: SubscriptionPlan) => void;
    onDelete: (plan: SubscriptionPlan) => void;
}

function formatOrdersLimit(ordersLimit?: number, usedOrders?: number) {
    if (ordersLimit === undefined || ordersLimit === null) {
        return 'Лимит не установлен';
    }

    if (ordersLimit === -1) {
        return 'Безлимитные заказы';
    }

    const remaining = ordersLimit - (usedOrders || 0);
    return `${usedOrders || 0}/${ordersLimit} заказов (осталось: ${remaining})`;
}

export const SubscriptionPlanCard = ({ plan, onEdit, onDelete }: SubscriptionPlanCardProps) => {
    return (
        <Card className={cn(
            'relative transition-all hover:shadow-lg h-full flex flex-col justify-between gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 bg-muted/50 text-card-foreground border border-border/50',
            plan.popular && 'ring-2 ring-[#FF5D00]'
        )}>
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="rounded px-2 py-[2px] text-white text-[12px] bg-[#FF5D00]">🔥 Популярная</span>
                </div>
            )}

            <div className="flex flex-col gap-3 sm:gap-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-card-foreground">
                    {plan.name}
                </h3>
                <div className="text-xs sm:text-sm font-medium text-[#FF5D00]">
                    {plan.duration}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{plan.description}</p>

                {/* Информация о лимитах заказов */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted rounded-lg p-2 sm:p-3 border border-border/50">
                    <Package className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{formatOrdersLimit(plan.ordersLimit, plan.usedOrders)}</span>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 pt-1 sm:pt-2">
                    {plan.features.map((feature, index) => {
                        const isLastTwo = index >= plan.features.length - 2;
                        const isGreenFeature = plan.badgeColor === 'green' && isLastTwo;

                        return (
                            <div
                                key={feature}
                                className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs ${isGreenFeature ? 'bg-muted text-muted-foreground border border-border/50' : 'bg-muted text-muted-foreground border border-border/50'
                                    }`}
                            >
                                {feature}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-muted-foreground">
                        {kopecksToRubles(plan.priceInKopecks)} ₽
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(plan)}
                        className="flex-1 min-w-0 border-border/50 bg-muted/50 text-card-foreground hover:bg-muted hover:border-border"
                    >
                        <Edit className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Редактировать</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(plan)}
                        className="flex-1 min-w-0 border-border/50 text-muted-foreground bg-muted/50 hover:bg-muted hover:border-border hover:text-card-foreground"
                    >
                        <Trash2 className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Удалить</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

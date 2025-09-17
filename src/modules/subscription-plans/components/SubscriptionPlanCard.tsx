import { SubscriptionPlan } from '../types/subscription-plan';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Calendar, Zap, Star, Crown, Diamond, Shield, Rocket, Heart, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/core/lib/utils';

interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
    onEdit: (plan: SubscriptionPlan) => void;
    onDelete: (plan: SubscriptionPlan) => void;
}

const iconMap = {
    calendar: Calendar,
    zap: Zap,
    star: Star,
    crown: Crown,
    diamond: Diamond,
    shield: Shield,
    rocket: Rocket,
    heart: Heart,
};

const badgeColorMap = {
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
};

export const SubscriptionPlanCard = ({ plan, onEdit, onDelete }: SubscriptionPlanCardProps) => {
    const IconComponent = iconMap[plan.icon as keyof typeof iconMap] || Calendar;
    const priceInRubles = (plan.priceInKopecks / 100).toFixed(2);

    return (
        <Card className={cn(
            'relative transition-all hover:shadow-lg',
            plan.popular && 'ring-2 ring-blue-500'
        )}>
            {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">🔥 Популярная</Badge>
                </div>
            )}

            <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                    <div className={cn(
                        'p-3 rounded-full',
                        badgeColorMap[plan.badgeColor]
                    )}>
                        <IconComponent className="w-6 h-6" />
                    </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-2xl font-bold text-green-600">
                    ₽{priceInRubles}
                </div>
                <div className="text-sm text-gray-500">{plan.duration}</div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Возможности:</h4>
                    <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm flex items-center">
                                <span className="text-green-500 mr-2">✅</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(plan)}
                        className="flex-1"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Редактировать
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(plan)}
                        className="flex-1"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

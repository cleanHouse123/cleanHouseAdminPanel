import { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanFormData } from '../types/subscription-plan';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/inputs/input';
import { Textarea } from '@/core/components/ui/inputs/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/inputs/select';
import { Switch } from '@/core/components/ui/switch';
import { Label } from '@/core/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Plus, X } from 'lucide-react';

interface SubscriptionPlanFormProps {
    plan?: SubscriptionPlan;
    onSubmit: (data: SubscriptionPlanFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const badgeColorOptions = [
    { value: 'blue', label: 'Синий' },
    { value: 'green', label: 'Зелёный' },
];

export const SubscriptionPlanForm = ({ plan, onSubmit, onCancel, isLoading }: SubscriptionPlanFormProps) => {
    const [formData, setFormData] = useState<SubscriptionPlanFormData>({
        type: 'monthly',
        name: '',
        description: '',
        priceInRubles: undefined as unknown as number,
        duration: '',
        features: [''],
        icon: 'calendar',
        badgeColor: 'blue',
        popular: false,
        ordersLimit: undefined,
    });

    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        if (plan) {
            setFormData({
                type: plan.type,
                name: plan.name,
                description: plan.description,
                priceInRubles: plan.priceInKopecks / 100,
                duration: plan.duration,
                features: plan.features,
                icon: plan.icon,
                badgeColor: plan.badgeColor,
                popular: plan.popular,
                ordersLimit: plan.ordersLimit,
            });
            setNewFeature('');
        } else {
            // Сброс формы при создании нового плана
            setFormData({
                type: 'monthly',
                name: '',
                description: '',
                priceInRubles: undefined as unknown as number,
                duration: '',
                features: [''],
                icon: 'calendar',
                badgeColor: 'blue',
                popular: false,
                ordersLimit: undefined,
            });
            setNewFeature('');
        }
    }, [plan]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const updateFeature = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => i === index ? value : feature)
        }));
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {plan ? 'Редактировать план подписки' : 'Создать план подписки'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="type" className="mb-2 block">Тип подписки</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: 'monthly' | 'yearly') =>
                                    setFormData(prev => ({ ...prev, type: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите тип подписки" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Месячная</SelectItem>
                                    <SelectItem value="yearly">Годовая</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="name" className="mb-2 block">Название</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="mb-2 block">Описание</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="priceInRubles" className="mb-2 block">Цена в рублях</Label>
                            <Input
                                id="priceInRubles"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.priceInRubles || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, priceInRubles: parseFloat(e.target.value) || 0 }))}
                                placeholder="Введите цену"
                                required
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>

                        <div>
                            <Label htmlFor="duration" className="mb-2 block">Длительность</Label>
                            <Input
                                id="duration"
                                value={formData.duration}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                placeholder="например: 1 месяц"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2 block">Цвет возможностей</Label>
                        <Select
                            value={formData.badgeColor}
                            onValueChange={(value: 'blue' | 'green') =>
                                setFormData(prev => ({ ...prev, badgeColor: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите цвет возможностей" />
                            </SelectTrigger>
                            <SelectContent>
                                {badgeColorOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="popular"
                            checked={formData.popular}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                        />
                        <Label htmlFor="popular">Популярная подписка</Label>
                    </div>

                    <div>
                        <Label htmlFor="ordersLimit" className="mb-2 block">Лимит заказов</Label>
                        <Input
                            id="ordersLimit"
                            type="number"
                            min="-1"
                            value={formData.ordersLimit || ''}
                            onChange={(e) => {
                                const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                                setFormData(prev => ({ ...prev, ordersLimit: value }));
                            }}
                            placeholder="-1 для безлимита, пустое для неограниченного"
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            -1 = безлимит, пустое = неограниченно
                        </p>
                    </div>

                    <div>
                        <Label className="mb-2 block">Возможности</Label>
                        <div className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        placeholder="Введите возможность"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFeature(index)}
                                        className="flex-shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <div className="flex gap-2 items-center">
                                <Input
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="Добавить новую возможность"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addFeature}
                                    className="flex-shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Сохранение...' : (plan ? 'Обновить' : 'Создать')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

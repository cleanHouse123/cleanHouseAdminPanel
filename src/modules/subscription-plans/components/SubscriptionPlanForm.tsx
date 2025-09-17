import { useState, useEffect } from 'react';
import { SubscriptionPlan, SubscriptionPlanFormData } from '../types/subscription-plan';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/inputs/input';
import { Textarea } from '@/core/components/ui/inputs/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/inputs/select';
import { Switch } from '@/core/components/ui/switch';
import { Label } from '@/core/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Plus, X, Calendar, Zap, Star, Crown, Diamond, Shield, Rocket, Heart } from 'lucide-react';

interface SubscriptionPlanFormProps {
    plan?: SubscriptionPlan;
    onSubmit: (data: SubscriptionPlanFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const iconOptions = [
    { value: 'calendar', label: 'Календарь', icon: Calendar },
    { value: 'zap', label: 'Молния', icon: Zap },
    { value: 'star', label: 'Звезда', icon: Star },
    { value: 'crown', label: 'Корона', icon: Crown },
    { value: 'diamond', label: 'Алмаз', icon: Diamond },
    { value: 'shield', label: 'Щит', icon: Shield },
    { value: 'rocket', label: 'Ракета', icon: Rocket },
    { value: 'heart', label: 'Сердце', icon: Heart },
];

const badgeColorOptions = [
    { value: 'blue', label: 'Синий' },
    { value: 'purple', label: 'Фиолетовый' },
    { value: 'green', label: 'Зеленый' },
    { value: 'yellow', label: 'Желтый' },
    { value: 'red', label: 'Красный' },
];

export const SubscriptionPlanForm = ({ plan, onSubmit, onCancel, isLoading }: SubscriptionPlanFormProps) => {
    const [formData, setFormData] = useState<SubscriptionPlanFormData>({
        type: 'monthly',
        name: '',
        description: '',
        priceInRubles: 0,
        duration: '',
        features: [''],
        icon: 'calendar',
        badgeColor: 'blue',
        popular: false,
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
            });
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
                                value={formData.priceInRubles}
                                onChange={(e) => setFormData(prev => ({ ...prev, priceInRubles: parseFloat(e.target.value) || 0 }))}
                                required
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
                        <Label className="mb-2 block">Иконка</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {iconOptions.map(option => {
                                const IconComponent = option.icon;
                                return (
                                    <label
                                        key={option.value}
                                        className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.icon === option.value
                                            ? 'border-[#008000]'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="icon"
                                            value={option.value}
                                            checked={formData.icon === option.value}
                                            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                            className="sr-only"
                                        />
                                        <IconComponent className="w-6 h-6 mb-1" />
                                        <span className="text-xs text-center">{option.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="badgeColor" className="mb-2 block">Цвет значка</Label>
                            <Select
                                value={formData.badgeColor}
                                onValueChange={(value: 'blue' | 'purple' | 'green' | 'yellow' | 'red') =>
                                    setFormData(prev => ({ ...prev, badgeColor: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите цвет значка" />
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
                        <Label className="mb-2 block">Возможности</Label>
                        <div className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        placeholder="Введите возможность"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFeature(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <Input
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="Добавить новую возможность"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addFeature}
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

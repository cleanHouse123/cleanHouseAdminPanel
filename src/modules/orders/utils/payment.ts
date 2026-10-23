import { PaymentDto } from "../types/orders";

/**
 * Заказ закрыт лимитом подписки: денег по нему не брали, платёж записан
 * с нулевой суммой. `price` при этом хранит обычную стоимость выноса —
 * она нужна для расчёта возврата по подписке (пункт 6.7 Оферты), поэтому
 * показывается с пометкой, а не вместо неё.
 */
export const isPaidBySubscription = (payments: PaymentDto[] = []): boolean =>
  payments.some((payment) => payment.method === "subscription");

import { IOrder, IProduct, FormErrors, IOrderForm, IAppState } from '../types';
import { Model } from './base/Model';
import {IEvents} from "./base/events";

export class Product extends Model<IProduct> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

/*
  * Класс, описывающий состояние приложения
  * */
export class AppState extends Model<IAppState> {
  // Корзина с товарами
  basket: Product[] = [];

  // Массив со всеми товарами
  store: Product[];

  // Объект заказа клиента
  order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  };

  // Объект с ошибками форм
  formErrors: FormErrors = {};

  addToBasket(value: Product) {
    this.basket.push(value);
  }

  deleteFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id)
  }

  clearBasket() {
    this.basket.length = 0;
  }

  getBasketAmount() {
    return this.basket.length;
  }

  setItems() {
    this.order.items = this.basket.map(item => item.id)
  }

  setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
    this.order[field] = value;
    if (this.validateOrder(field)) {
        this.events.emit('order:ready', this.order);
    }
  }

  validateOrder(field: keyof IOrder) {
    const errors: Partial<Record<keyof IOrder, string>> = {};

    // Проверка для полей email и phone
    if (field === 'email' || field === 'phone') {
        const emailError = !this.order.email.match(/^\S+@\S+\.\S+$/)
            ? 'email'
            : '';
        const phoneError = !this.order.phone.match(/^\+7\d{10}$/)
            ? 'телефон'
            : '';

        if (emailError && phoneError) {
            errors.email = `Необходимо указать ${emailError} и ${phoneError}`;
        } else if (emailError) {
            errors.email = `Необходимо указать ${emailError}`;
        } else if (phoneError) {
            errors.phone = `Необходимо указать ${phoneError}`;
        }
    } else if (!this.order.address) errors.address = 'Необходимо указать адрес';
    else if (!this.order.payment)
        errors.address = 'Необходимо выбрать тип оплаты';

    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}

  refreshOrder() {
    this.order = {
      items: [],
      total: null,
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
  }

  getTotalBasketPrice() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }

  setStore(items: IProduct[]) {
    this.store = items.map((item) => new Product({ ...item, selected: false }, this.events));
    this.emitChanges('items:changed', { store: this.store });
  }

  resetSelected() {
    this.store.forEach(item => item.selected = false)
  }
}

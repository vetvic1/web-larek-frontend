export type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

export interface IProductItem {
    id: string;
    category: CategoryType;
    description: string;
    title: string;
    price: number | null;
    image: string;    
  }

export  type PaymentType =
  | 'online'
  | 'cash';  


export interface IOrder {
    items: string[];
    payment: PaymentType;
    total: number;
	  address: string;
	  email: string;
	  phone: string;
}

export interface IAppData {
	products: IProductItem[];
  basket: IProductItem[];
  order: IOrder;
}

export type  TProduct = Omit<IProductItem, "description">

export type  TBasketProduct = Pick<IProductItem, "id" | "title" | "price">

export type IOrderForm = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IOrderResult {
  id: string; 
  total: number;
}
  

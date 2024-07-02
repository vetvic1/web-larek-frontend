import { IEvents } from './base/events';
import { Form } from './common/Form';
import { IOrder } from "../types";
/*
  * Класс, описывающий окошко заказа товара
  * */
export class OrderForm extends Form<IOrder> {
  // Сссылки на внутренние элементы
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(
    protected blockName: string,
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container, events);

    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    this._card.addEventListener('click', () => this.togglePaymentMethod('card'));
    this._cash.addEventListener('click', () => this.togglePaymentMethod('cash'));
    }

    toggleCard(state: boolean = true) {
        this.toggleClass(this._card, 'button_alt-active', state);
    }

    toggleCash(state: boolean = true) {
        this.toggleClass(this._cash, 'button_alt-active', state);
    }

    togglePaymentMethod(selectedPayment: string) {
        const isCardActive = this._card.classList.contains('button_alt-active');
        const isCashActive = this._cash.classList.contains('button_alt-active');

        if (selectedPayment === 'card') {
            this.toggleCard(!isCardActive);
            this.onInputChange('payment', 'card')
            if (!isCardActive) this.toggleCash(false);
        } else if (selectedPayment === 'cash') {
            this.toggleCash(!isCashActive);
            this.onInputChange('payment', 'cash')
            if (!isCashActive) this.toggleCard(false);
        }
    }
   // Метод, отключающий подсвечивание кнопок
    disableButtons() {
      this.toggleCard(false);
      this.toggleCash(false);
    }    
  }

  

 


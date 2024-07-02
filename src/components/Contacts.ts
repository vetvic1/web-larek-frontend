import { IEvents } from './base/events';
import { Form } from './common/Form';

/*
  * Интерфейс, описывающий окошко контакты
  * */
export interface IContacts {
  // Телефон
  phone: string;

  // Электронная почта
  email: string;
}

/*
  * Класс, описывающий окошко контакты
  * */
export class ContactsForm extends Form<IContacts> {
  // Конструктор принимает родительский элемент и обработчик событий
  protected _inputPhone: HTMLInputElement;
  protected _inputEmail: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);

      this._inputPhone = container.querySelector<HTMLInputElement>('input[name="phone"]');
      this._inputEmail = container.querySelector<HTMLInputElement>('input[name="email"]');
  }

  set phone(value: string) {
      if (this._inputPhone) {
          this._inputPhone.value = value;
      }
  }

  set email(value: string) {
      if (this._inputEmail) {
          this._inputEmail.value = value;
      }
  }
}

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
  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
  }
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }    
}

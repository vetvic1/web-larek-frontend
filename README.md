
https://github.com/vetvic1/web-larek-frontend


# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Документация

### Данные и типы данных, используемые в приложении

Тип описывающий категории товара

```
type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';
```

Карточка товара

```
export interface IProductItem {
  id: string; // уникальный ID
  category: CategoryType; // категория товара
  description: string; // описание товара
  title: string; // название
  price: number | null; // цена товара, может быть null
  image: string; // ссылка на картинку
}
```

Тип оплаты заказа

```
export type PaymentType =
  | 'online'
  | 'cash';
```

Заказ

```
export interface IOrder {
  items: string[]; // Массив ID купленных товаров
  payment: PaymentType; // Способ оплаты
  total: number; // Сумма заказа
  address: string; // Адрес доставки
  email: string; // Электронная почта
  phone: string; // Телефон
}
```

Модель

```
export interface IAppData {
	products: IProductItem[]
    basket: IProductItem[]
    order: IOrder
}
```

Отображение продукта на главной странице

```
export type  TProduct = Omit<IProductItem, "description"> // исключаем поле описание
```

Отображение продукта в корзине

```
export type  TBasketProduct = Pick<IProductItem, "id" | "title" | "price"> // оставляем только id, название и цену 
```

Результат заказа

```
export interface IOrderResult {
    id: string // идентификатор заказа
    total: number // сумма заказа
}
```

## Архитектура приложения

## Об архитектуре 

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

Методы: 
- `get(uri: string)` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleResponse(response: Response)` - защищенный метод, в случае успеха выполнения запроса возвращает объект в виде json. В случае неуспеха - статус и текст ошибки. Принимает в параметрах Response

#### Класс EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события\
Класс используется в презентере для обработки событий и в слоях приложения для генерации событий\
Основные методы, реализуемые классом описаны интерфейсом IEvents:

- `on(eventName: EventName, callback: (event: T) => void)` - добавляем обработчик на определенное событие. 
- `off(eventName: EventName, callback: Subscriber)` - удаляем обработчик с определенного события. 
- `emit(eventName: string, data?: T)` - инициирует событие с передачей данных(опционально). 
- `onAll(callback: (event: EmitterEvent) => void)` - слушать все события. 
- `offAll()` - удалить все обработчики событий 
- `trigger(eventName: string, context?: Partial<T>)` - возвращает функцию, генерирующую событие при вызове

#### Класс Component
Базовый класс для представлений. Работает с дженериками. В конструкторе принимает элемент разметки, который будет заполняться данными из модели.

Основные методы:
```
  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: string): void;

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean): void;

  // Скрыть
  protected setHidden(element: HTMLElement): void;

  // Показать
  protected setVisible(element: HTMLElement): void;

  // Установить изображение с алтернативным текстом
  protected setImage(el: HTMLImageElement, src: string, alt?: string): void;

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement;
}
```

#### Класс Model

Родительский класс модели данных, работает с дженериками

Конструктор:
- `constructor(data: Partial<T>, protected events: IEvents)` - принимает данные выбранного нами типа(возможно неполные) и экземпляр IEvents для работы с событиями

Основные методы:

- `emitChanges(event: string, payload?: object)` - сообщает всем, что модель изменилась. Принимает на вход событие и данные, которые изменились


### Слой данных
#### Класс IAppState
Интерфейс, описывающий внутреннее состояние приложения\
Используется для хранения карточек, корзины, заказа пользователя, ошибок в формах\
Так же имеет методы для работы с карточками и корзиной

```
interface IAppState {
  basket: Product[]; // Корзина с товарами
  store: Product[]; // Массив карточек товара
  order: IOrder; // Информация о заказе при покупке товара
  formErrors: FormErrors; // Ошибки при заполнении форм
  addToBasket(value: Product): void; // Метод для добавления товара в корзину
  deleteFromBasket(id: string): void; // Метод для удаления товара из корзины
  clearBasket(): void; // Метод для полной очистки корзины
  getBasketAmount(): number; // Метод для получения количества товаров в корзине
  getTotalBasketPrice(): number; // Метод для получения суммы цены всех товаров в корзине
  setItems(): void; // Метод для добавления ID товаров в корзине в поле items для order
  setOrderField(field: keyof IOrderForm, value: string): void; // Метод для заполнения полей email, phone, address, payment в order
  validateContacts(): boolean; // Валидация форм для окошка "контакты"
  validateOrder(): boolean; // Валидация форм для окошка "заказ"
  refreshOrder(): boolean; // Очистить order после покупки товаров
  setStore(items: IProduct[]): void; // Метод для превращения данных, полученых с сервера в тип данных приложения
  resetSelected(): void; // Метод для обновления поля selected во всех товарах после совершения покупки
}
```

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.


Класс, описывающий главную страницу
```
class Page extends Component<IPage> {
  // Ссылки на внутренние элементы
  protected _counter: HTMLElement;
  protected _store: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLElement, protected events: IEvents);

  // Сеттер для счётчика товаров в корзине
  set counter(value: number);

  // Сеттер для карточек товаров на странице
  set store(items: HTMLElement[]);

  // Сеттер для блока прокрутки
  set locked(value: boolean);
}
``` 

Класс, описывающий карточку товара
```
class Card extends Component<ICard> {
  // Ссылки на внутренние элементы карточки
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский контейнер
  // и объект с колбэк функциями
  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions);

  // Сеттер и геттер для уникального ID
  set id(value: string);
  get id(): string;

  // Сеттер и гетер для названия
  set title(value: string);
  get title(): string;

  // Сеттер для кратинки
  set image(value: string);

  // Сеттер для определения выбрали товар или нет
  set selected(value: boolean);

  // Сеттер для цены
  set price(value: number | null);

  // Сеттер для категории
  set category(value: CategoryType);
}
```

Класс, описывающий корзину товаров
```
export class Basket extends Component<IBasket> {
  // Ссылки на внутренние элементы
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents);

  // Сеттер для общей цены
  set price(price: number);

  // Сеттер для списка товаров 
  set list(items: HTMLElement[]);

  // Метод отключающий кнопку "Оформить"
  disableButton(): void;

  // Метод для обновления индексов таблички при удалении товара из корзины
  refreshIndices(): void;
}
```
Класс, описывающий окошко заказа товара
```
export class Order extends Form<IOrder> {
  // Сссылки на внутренние элементы
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents);

  // Метод, отключающий подсвечивание кнопок
  disableButtons(): void;
}
```
Класс, описывающий окошко контакты
```
export class Contacts extends Form<IContacts> {
  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLFormElement, events: IEvents);
}
```

### Дополнительные классы
Класс для работы с Api
```
class Api {
  // Базовый URL для Api
  readonly baseUrl: string;

  // Опции для fetch
  protected options: RequestInit;

  // Конструктор принимает базовый URL и опции
  constructor(baseUrl: string, options: RequestInit = {});

  // Обрабатывает запрос и возвращает промис с данными
  protected async handleResponse(response: Response): Promise<Partial<object>>;

  // Get запрос
  async get(uri: string);

  // Post запрос
  async post(uri: string, data: object);
}
```
### Описание событий

Инициируется при изменении списка товаров и вызывает перерисовку списка товаров на странице
```
'items:changed'
```
Инициируется при клике на карточку товара в классе StoreItem и приводит
    к открытию модального окна с подробным описанием товара
```
'card:select'
```
Инициируется при клике на кнопку "В корзину" на карточке StoreItemPreview
    В AppState добавляет товар в корзину, обновляет счётчик на корзине
    в классе Page
    Делает поле selected на товаре true для отключения кнопки, чтобы больше
    товар добавить было нельзя
```
'card:toBasket'
```
Инициируется при клике на кнопку "корзина" и открывает модальное окно
    с классом Basket, где отображаются товары добавленные в корзину
```
'basket:open'
```
Инициируется при клике на кнопку удаления товара в корзине
    Удаляет товар из массива basket в классе AppData
    Обновляет счётчик корзины на странице
    Обновляет поле selected на товаре, делая его false
    Обновляет сумму заказа в корзине
    Обвновляет порядковые номера в списке корзины
```
'basket:delete'
```
Инициируется при клике на кнопку "Оформить" в корзине
    Открывает окно с формой для заполнения адреса и способа оплаты
    Используемый класс Order
```
'basket:order'
```
Инициируется при нажатии на кнопку "Далее" на стадии заполнения адреса и
    способа оплаты в окошке Order
```
'order:submit'
```
Инициируется при нажатии на кнопку "Оплатить" на стадии заполнения телефона
    и электронной почты в окошке Contacts
```
'contacts:submit'
```
Инициируется при вводе данных в форму заказа Order и контактов Contacts
    Начинает процесс валидации формы
```
'orderInput:change'
```
Инициируется при вводе данных в форму окошка Order и совершает
    процесс валидации формы, возвращает ошибки формы
```
'orderFormErrors:change'
```
Инициируется при вводе данных в форму окошка Contacts и совершает
    процесс валидации формы, возвращает ошибки формы
```
'contactsFormErrors:change'
```
Инициируется при успешном ответе сервера при оплате товара
    Открывает модальное окно сообщающее об успешной оплате
```
'order:success'
```
Инициируется при клике на кнопку закрытия модального окна
    или при клике на свободное место вокруг модального окна
```
'modal:close'
```
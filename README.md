# Fantastic Waffle

Веб-приложение-мессенджер (учебный аналог Telegram) на TypeScript. В проекте реализованы:

- авторизация и регистрация;
- список чатов;
- страница профиля;
- страницы ошибок `404` и `500`;
- клиентская навигация между экранами.

![Fantastic Waffle Logo](./fantastic-waffle.png)

[Figma-макет](https://www.figma.com/design/UcGHGaVBO55ydc7s5gucfN/Chat_external_link--Copy-?node-id=1-498&t=QS3E2sWImRb3lX6A-0)

## Демо

[https://glistening-biscuit-be70f5.netlify.app/](https://glistening-biscuit-be70f5.netlify.app/)

## Технологии

- TypeScript
- Vite
- Handlebars
- SCSS
- Express (для отдачи сборки)
- ESLint + Prettier + Stylelint
- Mocha + Chai + JSDOM (unit-тесты)
- Husky (pre-commit)

## Установка

```bash
npm install
```

## Запуск

```bash
# режим разработки
npm run dev

# production-сборка + запуск express-сервера
npm start

# только сборка
npm run build

# предпросмотр production-сборки
npm run preview
```

## Тесты

```bash
# однократный запуск unit-тестов
npm test

# запуск тестов в watch-режиме
npm run test:watch
```

Тестовые файлы расположены рядом с тестируемыми модулями:

- `src/components/routes/Routes.test.ts`
- `src/services/Component.test.ts`
- `src/services/HTTPTransport.test.ts`

## Качество кода

```bash
npm run lint
npm run stylelint
```

На `pre-commit` автоматически запускаются:

- `npm run lint`
- `npm run stylelint`
- `npm run test`

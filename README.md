# Music Service — Курсова робота з баз даних

## Опис
**Music Service** — це веб-додаток для керування музичними треками, виконавцями, альбомами, жанрами та плейлістами. Реалізовано на **Node.js (Express)** з використанням **MySQL** для зберігання даних. Додаток дозволяє створювати, редагувати, видаляти й переглядати плейлісти, додавати треки, альбоми та виконавців, а також завантажувати зображення й музичні файли.

---

## Використані технології
- **HTML / CSS / JavaScript** — фронтенд;
- **Node.js + Express** — бекенд-сервер;
- **MySQL** — база даних;
- **Multer** — завантаження файлів (зображення / треки);
- **dotenv** — керування змінними середовища.

---

## Структура проєкту
'''
music_service/
├── node_modules/ # Залежності Node.js
├── sql/
│ └── dump.sql # SQL-дамп бази даних
├── src/
│ ├── backend/
│ │ ├── config/
│ │ │ └── config.js # Підключення до бази даних
│ │ ├── controllers/ # Логіка обробки запитів
│ │ │ ├── albums_controller.js
│ │ │ ├── artists_controller.js
│ │ │ ├── favorites_controller.js
│ │ │ ├── genres_controller.js
│ │ │ ├── playlist_tracks_controller.js
│ │ │ ├── playlists_controller.js
│ │ │ ├── tracks_controller.js
│ │ │ └── users_controller.js
│ │ ├── middlewares/
│ │ │ └── upload.js # Налаштування multer для завантаження файлів
│ │ ├── models/ # Запити до бази даних
│ │ │ ├── albums_model.js
│ │ │ ├── artists_model.js
│ │ │ ├── favorites_model.js
│ │ │ ├── genres_model.js
│ │ │ ├── playlist_tracks_model.js
│ │ │ ├── playlists_model.js
│ │ │ ├── tracks_model.js
│ │ │ └── users_model.js
│ │ ├── routes/ # Маршрути API
│ │ │ ├── albums.js
│ │ │ ├── artists.js
│ │ │ ├── favorites.js
│ │ │ ├── genres.js
│ │ │ ├── playlist_tracks.js
│ │ │ ├── playlists.js
│ │ │ ├── tracks.js
│ │ │ └── users.js
│ │ ├── uploads/ # Завантажені файли
│ │ │ ├── albums/
│ │ │ ├── artists/
│ │ │ ├── playlists/
│ │ │ └── tracks/
│ │ ├── app.js # Головний файл застосунку (Express)
│ │ ├── server.js # Запуск сервера
│ │ └── .env # Налаштування середовища
│ └── public/ # Клієнтська частина
│ ├── assets/
│ │ ├── css/
│ │ │ └── style.css
│ │ └── js/
│ │ └── script.js
│ └── index.html
├── package.json
├── package-lock.json
└── README.md
'''

---

## Вимоги
Перед запуском потрібно встановити:
- [Node.js] (https://nodejs.org/)
- [MySQL] (https://www.mysql.com/)

---

## Запуск проєкту
1. Відкрити термінал у кореневій папці проєкту

2. Перейти в папку src/backend командою: 
cd src/backend

3. Запустити сервер:
node server.js

4. Після успішного запуску в консолі з’явиться:
✅ MySQL підключено успішно
🚀 Сервер запущено на http://localhost:3000
✅ Підключено до MySQL!

5. Відкрити у браузері адресу: http://localhost:3000

---

## Можливості
- Реєстрація користувача;
- створення, редагування і видалення плейлістів;
- додавання треків, альбомів, виконавців, жанрів;
- завантаження обкладинок і музичних файлів;
- збереження улюблених треків.
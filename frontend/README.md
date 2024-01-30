This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Also run the backend API by following this [README](https://github.com/hwuiwon/cs4261-fpa/blob/main/backend/README.md).

## Description
This app is made with NextJs and React.

You would also have to run backend following the description that's in README.md of backend folder in order to make interactions with the database and fetch weather data from third party API.

Use `test@gmail.com` for id and `testpassword` for password.

When you're running the app, first you will see the login screen. After you login, you will see the box including your location, temperature, 
description for weather, and today's date. We brought this data from third-party weather api and based on your location, it brings the data for weather. You can also specify the location using the ZIP code -- for example, if you use 10001, our app will show the weather of NYC.

You can also view current todo items that you have and add/delete todo items. Feel free to play with it.

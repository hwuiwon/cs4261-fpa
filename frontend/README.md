# Frontend

## Tech Stack
Expo with React Native

## Description
This app is made with React Native and Expo. To execute this app, you need an expo app on you phone and put
and put "npx expo start" in your terminal. Then, you can scan the generated QR code to run the app.

You would also have to run backend following the description that's in README.md of backend folder in order to make interactions with the database and fetch weather data from third party API.

When you're running the app, first you will see the login screen. After you login, you will see the box including your location, temperature, 
description for weather, and today's date. We brought this data from third-party weather api and based on your location, it brings the data for weather. You can also specify the location using the ZIP code -- for example, if you use 10001, our app will show the weather of NYC.

Also, for the main goals of our app, there are three "goal boxes" below the weather box. You can hold and press each box to edit your goals!
Then, you can add "todo" items below each goal boxes and of couse, you can delete each items when you're done with them.

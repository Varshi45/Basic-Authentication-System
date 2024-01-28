# Login-Signup App with Firebase and Express

This is a simple login/signup application built using Express.js, Firebase, and bcrypt for password hashing. It allows users to sign up, log in, and log out securely.

## Features

- User authentication with Firebase Firestore
- Password hashing with bcrypt
- Session management with Express session
- Static file serving for login/signup and dashboard pages

## Prerequisites

Before running this application, make sure you have the following:

- Node.js installed on your machine
- Firebase project set up with Firestore and Service Account JSON file
- Basic knowledge of Express.js and Firebase

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Varshi45/Basic-Authentication-System
   ```

2. Navigate to the project directory:

   ```bash
   cd Basic-Authentication-System
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Add your Firebase Service Account JSON file to the project directory and name it `firebase-key.json`.

## Configuration

Before running the application, you need to configure Firebase. Update the `firebase-key.json` file with your Firebase project credentials.

## Usage

To start the server, run:

```bash
npm start
```

This will start the Express server on port 3000 by default.

## Endpoints

- `POST /signup`: Allows users to sign up with a new account.
- `POST /login`: Allows users to log in with existing credentials.
- `GET /dashboard`: Serves the dashboard page if the user is logged in.
- `POST /logout`: Logs out the user and destroys the session.

## Folder Structure

```
Basic-Authentication-System/
├── firebase-key.json
├── dashboard.html
├── main.html
├── package.json
├── server.js
└── Login-Signup/
    ├── css/
    ├── js/
    └── images/
```

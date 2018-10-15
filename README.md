# qgym-api
[![CircleCI](https://circleci.com/gh/AnthonyGW/qgym-api.svg?style=svg)](https://circleci.com/gh/AnthonyGW/qgym-api)
[![codecov](https://codecov.io/gh/AnthonyGW/qgym-api/branch/develop/graph/badge.svg)](https://codecov.io/gh/AnthonyGW/qgym-api) 
-
\
Backend API for the Quick Gym project

## Developer Setup
1. Ensure node and npm are installed on the target machine.
2. Clone the repo with `git clone https://github.com/AnthonyGW/qgym-api.git`.
3. Install node dependencies with `npm install`.
4. Create a `.env` file in the project root directory and add environment variables following the format of the `.env.example` file. Source this `.env` to apply the environment variables.
5. Check the values in the `config/default.json` and `config/test.json` and modify them to suit your environment.
6. Run test suites with `npm test`.
7. Start the server with `npm start:dev`.
8. Get test coverage report with `npm run coverage`. Report is exported to the `./coverage` folder.

## Available Endpoints

| Type | Endpoint | Data | Authorization Required | Expected Response |
| --- | --- | --- | --- | --- | 
| `POST` | `/api/v1/users/signup` | `{ email, password }` | `No` | `200, { id: "", email: "" }` |
| `POST` | `/api/v1/users/signin` | `{ email, password }` | `No` | `200, { message: "Authorization successful. Check session ID named connect.sid in cookies." }` |
| `GET` | `/api/v1/users/signout` | None | `Yes` | `200, { message: "Logged out successfully." }` |
| `PUT` | `/api/v1/users/update` | `{ currentPassword, newEmail, newPassword }` | `Yes` | `200, { message: "User data has been updated." }` |
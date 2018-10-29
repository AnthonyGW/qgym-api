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
5. Execute `node ./scripts/replace_values.js` from the project's root directory to apply those settings from the environment variables into the configs. If necessary, use `node ./scripts/clear_values.js` to clear the current values.
6. Run test suites with `npm test`.
7. Start the server with `npm run start:dev`.
8. Get test coverage report with `npm run coverage`. Report is exported to the `./coverage` folder.

## Deployment
1. Ensure that all the environment variables are set. See `.example.env` for what they should look like.
2. Run `npm run build` from the project's root directory. The files are output to a new folder on the project root named `dist`.
3. Proceed either manually or with Docker.

### Manual Production Build
1. Run `npm run start:prod`. That's all.

### Docker
1. Run `docker build -t quickgym-api .` from the project's root directory.
2. Try out the docker image with `docker run -d -p 3030:3030 --name quickgym-api quickgym-api`.

## Available Endpoints

| Type | Endpoint | Data | Authorization Required | Expected Response |
| --- | --- | --- | --- | --- | 
| `POST` | `/api/v1/users/signup` | `{ email, password }` | `No` | `200, { id: "", email: "" }` |
| `POST` | `/api/v1/users/signin` | `{ email, password }` | `No` | `200, { message: "Authorization successful. Check session ID named connect.sid in cookies." }` |
| `GET` | `/api/v1/users/signout` | None | `Yes` | `200, { message: "Logged out successfully." }` |
| `PUT` | `/api/v1/users/update` | `{ currentPassword, newEmail, newPassword }` | `Yes` | `200, { message: "User data has been updated." }` |
| `POST` | `/api/v1/workouts` | `{ name, exercises, track }` | `Yes` | `200, { id, name, exercises, track }` |
| `GET` | `/api/v1/workouts` | None | `Yes` | `200, [ { id, name, exercises, track } ]` |
| `PUT` | `/api/v1/workouts/:workoutID` | `{ name, exercises, track }` | `Yes` | `200, { id, name, exercises, track }` |
| `DELETE` | `/api/v1/workouts/:workoutID` | None | `Yes` | `200, [ { message: 'Workout deleted.' } ]` |
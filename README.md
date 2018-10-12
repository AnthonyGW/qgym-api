# qgym-api
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
| `POST` | `/signup` | `{ email, password, confirmPassword }` | `No` | `200, { message: "<username> created successfully." }` |
| `POST` | `/login` | `{ email, password }` | `No` | `200, { message: "Authorization successful. Check session ID named connect.sid in cookies." }` |

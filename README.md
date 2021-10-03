# Usage

Endpoint mini documentation pritned to console while in development.

Use curl, example

```
curl -X POST http://localhost:3000/v1/user --data '{"email": "test@test.com", "password": "Hejsan1245465$"}' --header "Content-Type: application/json"
```

```
curl -X GET http://localhost:3000/v1/auth/rotate --header "Content-Type: application/json" --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE2M2FmY2NkOTdkM2ViOWViMjQ5YmMwIiwiaWF0IjoxNjMzOTI2NTQwLCJleHAiOjE2MzM5MzM3NDB9.rdiTbyztBdnxz3D-DVghZ79G-SRGKta1QFsZRm4DiZY"
```

# Development

`npm install`

`cp .env.example .env`

Run in watch mode

`npm run start:watch`

or with Docker

`npm start`

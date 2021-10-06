# Usage

Endpoint mini documentation pritned to console while in development.

Use curl, example

```
curl -X POST http://localhost:3000/v1/user --data '{"email": "test@test.com", "password": "Hejsan1245465$"}' --header "Content-Type: application/json"
```

```
curl -X GET http://localhost:3000/v1/auth/rotate --header "Content-Type: application/json" --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE2M2FmY2NkOTdkM2ViOWViMjQ5YmMwIiwiaWF0IjoxNjMzOTI2NTQwLCJleHAiOjE2MzM5MzM3NDB9.rdiTbyztBdnxz3D-DVghZ79G-SRGKta1QFsZRm4DiZY"
```

```
curl -X POST http://localhost:3000/v1/cabinet --data '{"address":{"street":"Test 123","zipcode":"1337","city":"world","loc":{"x":60.1
4959,"y":15.18776}},"lockers":[{"height":100,"width":100,"depth":100},{"height":
50,"width":50,"depth":50},{"height":25,"width":25,"depth":25}]}' --header "Content-Type: application/json" --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE2M2FmY2NkOTdkM2ViOWViMjQ5YmMwIiwiaWF0IjoxNjMzOTI2NTQwLCJleHAiOjE2MzM5MzM3NDB9.rdiTbyztBdnxz3D-DVghZ79G-SRGKta1QFsZRm4DiZY"
```

```
curl -X POST http://localhost:3000/v1/package --data '{"address":{"street":"Test 123","zipcode":"1337","phone":"123","city":"world","
loc":{"x":60.13993787457239,"y":15.196131420732488}},"dimension":{"height":30,"w
idth":30,"depth":30}}' --header "Content-Type: application/json" --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE2M2FmY2NkOTdkM2ViOWViMjQ5YmMwIiwiaWF0IjoxNjMzOTI2NTQwLCJleHAiOjE2MzM5MzM3NDB9.rdiTbyztBdnxz3D-DVghZ79G-SRGKta1QFsZRm4DiZY"
```

# Development

`npm install`

`cp .env.example .env`

Run in watch mode

`npm run start:watch`

Or for full logs:

`start:watch:debug`

or with Docker

`npm start`

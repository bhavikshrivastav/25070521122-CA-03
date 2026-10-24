# Notes App (MERN)

Full-stack app: React (client) + Node/Express (server) + MongoDB.

## Features
- Sign up and Login (JWT, bcrypt)
- Create, read, update and delete notes

## How to run
1. Start MongoDB (Compass connects to mongodb://127.0.0.1:27017)
2. Server: cd server, npm install, create .env, npm run dev
3. Client: cd client, npm install, npm run dev

## .env (in server)
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/flexi_db
JWT_SECRET=anysecretkey123
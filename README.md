<h1 align="center">⚽ Welcome to the Football Score Board Project ⚽</h1>

## Requirements
```
Docker version 20.10.14
Docker-compose version 1.29.2
NodeJS version 16.13.2
Npm version 8.1.2
```

## Install and Usage 
- This project is configured to use ports 3000 (front-end), 3001(back-end) and 3002 (database), so they need to be available on your computer or changed on the project.

# .env File

- Here is an example of my env files needed to run the project.
## My backend .env file looks like this:
```
PORT=3004
DB_USER=root
DB_PASS=******
DB_NAME=TRYBE_FUTEBOL_CLUBE
DB_HOST=localhost
DB_PORT=3306
```
## My frontend .env file looks like this
```
SKIP_PREFLIGHT_CHECK=true
```

# Run on root directory:
```sh
npm run compose:up
npm run compose:down
```

# Run without docker:
- Start mySql server and create a database using db.example.sql file;
```sh
npm install
```

```sh
/app/backend
npm run nodemon
```

```sh
/app/frontend
npm start
```

Your database, backend and frontend should be mounted and connected through docker.

# Once mounted, you should see the application at:
localhost:3000

## Core abilities: NodeJS, Sequelize, OOP, API-Rest, Mocha-chai

## Description: 

This is a fullStack project which I have worked only at the backend to create a leaderboard for a football competition.

Anyone can see the leaderboards but to start or finish a match or modify the number of goals, you need to be logged in. To test this functionality, you can use the administrator data user: "admin@admin.com" and password: "secret_admin".

Login uses Jwt validation token and bcrypt.

At the frontend there are 2 score tables: First one builds a leaderboard considering home team matches, and second one considers matches where the teams are playing as away home.
# MovieCritic-FrontEnd

Repository to host the project developed for 'Web Development 2', a 2nd year subject at UMAIA.

Developed by Group inf24dw2g34: [@jbbernardo7](https://github.com/jbbernardo7)

## Project Description

MovieCritic Frontend is a responsive, user-friendly web application built with React and Material UI that allows users to discover, review, and share their thoughts on movies. This frontend interfaces with the MovieCritic API to provide a complete movie review platform experience. It features a modern UI with material design, user authentication, responsive layouts, and an intuitive interface for browsing and interacting with movie content.

## Features

- Modern user interface built with Material UI
- User authentication with Google OAuth 2.0
- Interactive movie browsing
- Detailed movie and director information pages
- User review system with star ratings and comments
- Like/favorite system for movies
- User profiles
- Dockerized for deployment

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/inf24dw2g34/MovieCritic-FrontEnd.git
cd MovieCritic-FrontEnd
```
### Step 2: Set up Google OAuth

- Create a project and OAuth 2.0 client ID at https://console.developers.google.com

### Step 3: Configure Environment Variables
- In the API Folder, copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- Fill in all required variables in `.env` (Google Credentials, etc...)

### Step 4: Build and Run the Project

- In the root folder:
```bash
docker-compose -f compose.yaml up --build -d
```

## API Documentation

After running the project,

- Access the React app at:
[http://localhost:3002](http://localhost:3002)

- Access the Swagger docs at:  
[http://localhost:3000/docs](http://localhost:3000/docs)


## Technologies

* [React](https://reactjs.org/)
* [Material UI](https://mui.com/)
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Docker](https://www.docker.com/)

## DockerHub Images

API Image: [inf24dw2g34/moviecritic-api](https://hub.docker.com/repository/docker/inf24dw2g34/moviecritic-api/general)
Database Image: [inf24dw2g34/moviecritic-db](https://hub.docker.com/repository/docker/inf24dw2g34/moviecritic-db/general) (Contains preloaded data)

## Team
* João Bernardo [@jbbernardo7](https://github.com/jbbernardo7)

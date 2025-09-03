# Real-Time Game Platform

This project is a platform for simple real-time multiplayer games, built with Node.js, Express, Socket.IO, and Vue.js.

## Project Structure

The project is organized as a monorepo with the following structure:

-   `/client`: The Vue.js frontend application.
-   `/server`: The Express.js and Socket.IO backend server.
-   `/games`: Contains the specific logic for each game.

Each game has its own directory under `/games`, which is further divided into `client`, `server`, and `mechanic` subdirectories.

## Getting Started

### Prerequisites

-   Node.js and npm

### Installation

1.  **Install server dependencies:**
    ```bash
    npm install --prefix server
    ```

2.  **Install client dependencies:**
    ```bash
    npm install --prefix client
    ```

### Running the Application

1.  **Start the server:**
    ```bash
    npm start --prefix server
    ```
    The server will start on `http://localhost:3000`.

2.  **Start the client (for development):**
    ```bash
    npm run dev --prefix client
    ```
    The client development server will start on a different port (usually `http://localhost:5173`).

### Building the Client

To create a production build of the client, run the following command from the `client` directory:

```bash
npm run build --prefix client
```

This will generate a single `index.html` file in the `client/dist` directory, which is then served by the main server.

## How to Add a New Game

1.  Create a new directory inside the `/games` folder. The name of the directory will be used as the game's slug (e.g., `my-new-game`).
2.  Inside the new game's directory, create three subdirectories: `client`, `server`, and `mechanic`.
3.  The server will automatically detect the new game and add it to the list of available games.
4.  You can then add your game-specific logic in the corresponding directories.

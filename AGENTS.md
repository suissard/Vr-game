## Project Structure

This project is a monorepo containing a server and a client. The main goal is to provide a platform for simple real-time multiplayer games.

-   `/client`: A Vue.js single-page application that serves as the frontend.
-   `/server`: An Express.js server with Socket.IO for real-time communication.
-   `/games`: This directory contains the specific logic for each game.

### Game Structure

Each game has its own directory under `/games`. The directory name is a slug version of the game's title (e.g., `galaxy_gliders`).

Each game's directory is structured as follows:

-   `/mechanic`: Contains code that is shared between the client and the server for that specific game. This could include things like game rules, physics, or data structures.
-   `/server`: Contains the server-side logic for the game. This code is loaded by the main server application.
-   `/client`: Contains the client-side components and logic for the-   `/client`: Contains the client-side components and logic for the game. This allows each game to have its own UI and interactions.

## Development Workflow

1.  **Server:** The main server is located in the `/server` directory. To start it, run `npm install` and then `npm start` from within that directory.
2.  **Client:** The main client is in the `/client` directory. To start the development server, run `npm install` and then `npm run dev`.
3.  **Adding a new game:**
    *   Create a new directory in `/games` with a slugified name.
    *   Create the `client`, `server`, and `mechanic` subdirectories.
    *   The server will automatically detect the new game and add it to the list.
    *   Implement the game's logic in the corresponding directories.

## Coding Conventions

-   Use Prettier for code formatting.
-   Follow the Vue.js style guide for client-side code.
-   Write clear and concise commit messages.
-   All client builds must be in a single file.
-   Pinia should be used for state management in the Vue app.

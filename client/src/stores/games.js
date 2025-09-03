import { defineStore } from 'pinia';
import socket from '../socket';

export const useGamesStore = defineStore('games', {
  state: () => ({
    games: [],
    selectedGame: null,
  }),
  actions: {
    fetchGames() {
      socket.emit('get games');
      socket.on('games list', (games) => {
        this.games = games;
      });
    },
    selectGame(gameId) {
      this.selectedGame = this.games.find(g => g.id === gameId);
      if (this.selectedGame) {
        socket.emit('join', this.selectedGame.id);
      }
    },
    unselectGame() {
      if (this.selectedGame) {
        socket.emit('leave');
        this.selectedGame = null;
      }
    },
  },
});

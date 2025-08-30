<template>
  <div id="app">
    <GameList v-if="!selectedGame" @select-game="handleSelectGame" />
    <GameView v-else :game="selectedGame" @back="handleBack" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GameList from './components/GameList.vue';
import GameView from './components/GameView.vue';
import { games } from './games';

const selectedGameId = ref(null);
const selectedGame = ref(null);

function handleSelectGame(gameId) {
  selectedGameId.value = gameId;
  selectedGame.value = games.find(g => g.id === gameId);
}

function handleBack() {
  selectedGameId.value = null;
  selectedGame.value = null;
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

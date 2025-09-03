<template>
  <div id="app">
    <GameList v-if="!gamesStore.selectedGame" @select-game="handleSelectGame" />
    <GameView v-else :game="gamesStore.selectedGame" @back="handleBack" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGamesStore } from './stores/games';
import GameList from './components/GameList.vue';
import GameView from './components/GameView.vue';

const gamesStore = useGamesStore();

onMounted(() => {
  gamesStore.fetchGames();
});

function handleSelectGame(gameId) {
  gamesStore.selectGame(gameId);
}

function handleBack() {
  gamesStore.unselectGame();
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

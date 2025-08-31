<template>
  <div>
    <h1>Game Hub</h1>
    <ul>
      <li v-for="game in games" :key="game.id" @click="$emit('select-game', game.id)">
        {{ game.name }} - {{ game.players }} players online
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { socket } from '../socket';

const games = ref([]);

onMounted(() => {
  socket.emit('get games');

  socket.on('games list', (gamesList) => {
    games.value = gamesList;
  });
});

onUnmounted(() => {
  socket.off('games list');
});
</script>

<style scoped>
li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
li:hover {
  background-color: #f0f0f0;
}
</style>

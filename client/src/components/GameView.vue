<template>
  <div>
    <button @click="$emit('back')">Back to Game List</button>
    <h1>{{ game.name }}</h1>
    <p>{{ playerCount }} players online</p>

    <div class="game-container">
      <div class="game-area">
        <div class="player self" :style="{ transform: `translate(${position.x}px, ${position.y}px)` }">You</div>
        <div
          v-for="(player, id) in otherPlayers"
          :key="id"
          class="player other"
          :style="{ transform: `translate(${player.x}px, ${player.y}px)` }"
        >
          Other
        </div>
      </div>
      <div class="chat-area">
        <h3>Chat</h3>
        <div class="messages">
          <div v-for="(message, index) in messages" :key="index">
            <strong>{{ message.user }}:</strong> {{ message.text }}
          </div>
        </div>
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, onUnmounted, computed } from 'vue';
import { socket } from '../socket';

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const playerCount = ref(props.game.players);
const messages = ref([]);
const newMessage = ref('');

const position = ref({ x: 0, y: 0 });
const allPlayers = ref({});
let positionInterval = null;

const otherPlayers = computed(() => {
  const players = { ...allPlayers.value };
  delete players[socket.id];
  return players;
});

function sendMessage() {
  if (newMessage.value.trim() !== '') {
    socket.emit('chat message', { user: 'You', text: newMessage.value });
    newMessage.value = '';
  }
}

onMounted(() => {
  socket.emit('join', props.game.id);

  socket.on('player count', (count) => {
    playerCount.value = count;
  });

  socket.on('chat message', (msg) => {
    messages.value.push(msg);
  });

  socket.on('player positions', (positions) => {
    allPlayers.value = positions;
  });

  // Simulate player movement and send position to server
  let angle = 0;
  positionInterval = setInterval(() => {
    position.value.x = Math.cos(angle) * 100;
    position.value.y = Math.sin(angle) * 100;
    angle += 0.1;
    socket.emit('player position', position.value);
  }, 100);
});

onUnmounted(() => {
  socket.emit('leave');
  socket.off('player count');
  socket.off('chat message');
  socket.off('player positions');
  clearInterval(positionInterval);
});
</script>

<style scoped>
.game-container {
  display: flex;
  gap: 20px;
}
.game-area {
  flex-grow: 1;
  border: 1px solid #ccc;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.player {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  left: 50%;
  top: 50%;
  margin-left: -25px;
  margin-top: -25px;
}
.self {
  background-color: blue;
}
.other {
  background-color: red;
}
.chat-area {
  width: 300px;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 5px;
}
</style>

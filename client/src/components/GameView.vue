<template>
  <div>
    <button @click="$emit('back')">Back to Game List</button>
    <h1>{{ game.name }}</h1>
    <p>{{ game.players }} players online</p>

    <div class="game-container">
      <div class="game-area">
        <!-- This is where the game would be rendered -->
        <p>Game Area</p>
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
import { ref, defineProps } from 'vue';

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const messages = ref([
  { user: 'Alice', text: 'Hey everyone!' },
  { user: 'Bob', text: 'Hi Alice! Ready to play?' },
]);
const newMessage = ref('');

function sendMessage() {
  if (newMessage.value.trim() !== '') {
    messages.value.push({ user: 'You', text: newMessage.value });
    newMessage.value = '';
  }
}
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

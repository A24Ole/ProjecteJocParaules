<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import GameEngine from './components/gameEngine.vue';
import SalaEspera from './components/SalaEspera.vue';
import Lobby from './components/Lobby.vue';
import { io } from 'socket.io-client';

const vistaActual = ref('salaEspera');
const nomJugador = ref('');
const jugadors = ref([]);
const selectedTime = ref('30');
const gameMode = ref('time');
const numWords = ref(10);

let socket;

function connectarAlServidor(name) {
  nomJugador.value = name;
  socket = io('http://localhost:27344'); // Connect to the backend Socket.IO server

  socket.on('connect', () => {
    console.log('Conectado al servidor Socket.IO');
    socket.emit('setPlayerName', { name: nomJugador.value });
    vistaActual.value = 'lobby';
  });

  socket.on('updatePlayerList', (updatedJugadors) => {
    jugadors.value = updatedJugadors;
  });

  socket.on('disconnect', () => {
    console.log('Desconectado del servidor Socket.IO');
    vistaActual.value = 'salaEspera';
    jugadors.value = [];
  });
}

function startGame(data) {
  selectedTime.value = data.time;
  gameMode.value = data.gameMode;
  numWords.value = data.numWords;
  vistaActual.value = 'joc';
}
</script>

<template>
  <main class="app-container">
    <SalaEspera v-if="vistaActual === 'salaEspera'" @connect="connectarAlServidor" />
    <Lobby v-else-if="vistaActual === 'lobby'" :jugadors="jugadors" :selectedTime="selectedTime" @start-game="startGame" />
    <GameEngine v-else-if="vistaActual === 'joc'" :tempsMaxim="Number(selectedTime)" :gameMode="gameMode" :numWords="numWords" />
  </main>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script setup>
import { ref } from 'vue';

defineProps({
  jugadors: Array,
  selectedTime: String
});

const emit = defineEmits(['start-game']);

const time = ref('30');
const gameMode = ref('time');
const numWords = ref(10);

function startGame() {
  emit('start-game', { time: time.value, gameMode: gameMode.value, numWords: numWords.value });
}
</script>

<template>
  <div class="lobby-container">
    <h2>Jugadors Connectats</h2>
    <ul class="player-list">
      <li v-for="jugador in jugadors" :key="jugador.id">{{ jugador.name }}</li>
    </ul>
    <div class="time-selector">
      <label> Durada de la partida:</label>
      <select v-model="time">
        <option value="15">15 segons</option>
        <option value="30" selected>30 segons</option>
        <option value="60">60 segons</option>
      </select>
    </div>
    <div class="game-mode-selector">
      <label>Mode de joc:</label>
      <select v-model="gameMode">
        <option value="time">Temps</option>
        <option value="words">Paraules</option>
        <option value="quote">Cita</option>
      </select>
    </div>
    <div v-if="gameMode === 'words'" class="num-words-selector">
      <label>Nombre de paraules:</label>
      <input type="number" v-model="numWords" min="1" max="100" />
    </div>
    <button @click="startGame">Comença a Jugar!</button>
  </div>
</template>

<style scoped>
.lobby-container {
  text-align: center;
  background-color: var(--color-secondary);
  padding: 40px;
  border-radius: 10px;
  width: 400px;
}

h2 {
  color: var(--color-primary);
  margin-bottom: 20px;
}

.player-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 20px;
}

.player-list li {
  background: var(--color-background);
  margin: 5px 0;
  padding: 6px;
  border-radius: 5px;
}

.time-selector {
  margin-bottom: 20px;
}

.game-mode-selector {
  margin-bottom: 20px;
}

.num-words-selector {
  margin-bottom: 20px;
}
</style>

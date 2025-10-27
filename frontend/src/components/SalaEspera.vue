<script setup>
import { ref } from 'vue';

defineProps({
  nomJugador: String
});

const emit = defineEmits(['connect']);

const nom = ref('');

function connect() {
  emit('connect', nom.value);
}
</script>

<template>
  <div class="wait-room-container">
    <h1 class="game-title">Type Racer Royale</h1>
    <input type="text" v-model="nom" placeholder="Introdueix el teu nom" />
    <button @click="connect">Entra al Lobby</button>
  </div>
</template>

<style scoped>
.wait-room-container {
  text-align: center;
  background-color: var(--color-secondary);
  padding: 40px;
  border-radius: 10px;
  width: 400px;
}

.game-title {
  font-size: 2.2em;
  color: var(--color-primary);
  margin-bottom: 20px;
}

input {
  width: 80%;
  margin-bottom: 20px;
  text-align: center;
}
</style>

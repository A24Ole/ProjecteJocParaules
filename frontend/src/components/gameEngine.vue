<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  tempsMaxim: { type: Number, default: 30 },
  jugadors: { type: Array, default: () => [] },
  gameMode: { type: String, default: 'time' },
  numWords: { type: Number, default: 10 }
});

const paraules = ref([
    { id: 1, text: 'component', estat: 'pendent' },
    { id: 2, text: 'reactivitat', estat: 'pendent' },
    { id: 3, text: 'javascript', estat: 'pendent' },
    { id: 4, text: 'framework', estat: 'pendent' },
    { id: 5, text: 'template', estat: 'pendent' }
  ]);
const indexParaulaActiva = ref(0);
const textEntrat = ref('');
const jocFinalitzat = ref(false);
const tempsRestant = ref(props.tempsMaxim);
const tempsTotal = ref(0);
const errorsTotals = ref(0);
const lletresParaulaActiva = ref([]);

const wpm = computed(() => {
  if (tempsTotal.value === 0) return 0;
  const paraulesCorrectes = paraules.value.filter(p => p.estat === 'correcte').length;
  const minuts = tempsTotal.value / 60;
  return Math.round(paraulesCorrectes / minuts);
});

let timer;

function iniciarTimer() {
  timer = setInterval(() => {
    tempsRestant.value--;
    tempsTotal.value++;
    if (tempsRestant.value === 0) {
      finalitzarJoc();
    }
  }, 1000);
}

function finalitzarJoc() {
  clearInterval(timer);
  jocFinalitzat.value = true;
}

function reiniciarJoc() {
  jocFinalitzat.value = false;
  indexParaulaActiva.value = 0;
  textEntrat.value = '';
  tempsRestant.value = props.tempsMaxim;
  tempsTotal.value = 0;
  errorsTotals.value = 0;
  paraules.value.forEach(p => p.estat = 'pendent');
  lletresParaulaActiva.value = [];
  startCountdown();
}

function handleInput(event) {
  if (jocFinalitzat.value) return;

  if (!timer && countdown.value === 0) {
    iniciarTimer();
  }

  const paraulaActual = paraules.value[indexParaulaActiva.value];
  textEntrat.value = event.target.value;

  if (textEntrat.value.endsWith(' ')) {
    if (textEntrat.value.trim() === paraulaActual.text) {
      paraulaActual.estat = 'correcte';
    } else {
      paraulaActual.estat = 'incorrecte';
      errorsTotals.value++;
    }
    indexParaulaActiva.value++;
    textEntrat.value = '';

    if (indexParaulaActiva.value === paraules.value.length) {
      finalitzarJoc();
    }
  } else {
    lletresParaulaActiva.value = textEntrat.value.split('').map((lletra, index) => {
      return lletra === paraulaActual.text[index] ? 'correct-letter' : 'incorrect-letter';
    });
  }
}


const isFocused = ref(false);
const countdown = ref(3);

const caretLeftPosition = computed(() => {
  const letterWidth = 14.4;
  return textEntrat.value.length * letterWidth;
});

function startCountdown() {
  countdown.value = 3;
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(interval);
    }
  }, 1000);
}

onMounted(() => {
  window.addEventListener('keydown', handleVisualKeystroke);
  startCountdown();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleVisualKeystroke);
  clearInterval(timer);
});

// teclat visual
const Teclat = ref([
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]);

const teclaPremuda = ref('');

function handleVisualKeystroke(event) {
  const tecla = event.key.toUpperCase();
  teclaPremuda.value = tecla;
  setTimeout(() => (teclaPremuda.value = ''), 100);
}
</script>

<template>
  <div class="game-engine" :class="{ 'is-focused': isFocused }">
  <div class="timer">
    <div class="timer-text">{{ tempsRestant }}s</div>
    <div class="wpm-text">{{ wpm }} WPM</div>
  </div>



    <div v-if="countdown > 0" class="countdown">
      {{ countdown }}
    </div>

    <div class="words-container" v-if="!jocFinalitzat && countdown === 0">
      <div
        v-for="(paraula, index) in paraules"
        :key="paraula.id"
        class="word"
        :class="{ 'active-word': index === indexParaulaActiva, 'correcte': paraula.estat === 'correcte', 'incorrecte': paraula.estat === 'incorrecte' }"
      >
        <template v-if="index === indexParaulaActiva">
          <div class="active-word-letters">
            <span class="caret" :style="{ left: caretLeftPosition + 'px' }"></span>
            <span
              v-for="(lletra, lletraIndex) in paraula.text.split('')"
              :key="lletraIndex"
              class="letter"
              :class="lletresParaulaActiva[lletraIndex]"
            >
              {{ lletra }}
            </span>
          </div>
        </template>
        <template v-else>
          {{ paraula.text }}
        </template>
      </div>
    </div>

    <input
      type="text"
      class="word-input"
      v-model="textEntrat"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
      placeholder="Comença a escriure..."
      aria-label="Escriu la paraula aquí"
      :disabled="countdown > 0"
      autofocus
    />

    <div v-if="jocFinalitzat" class="results">
      <h2>Resultats del Joc</h2>
      <p>WPM: {{ wpm }}</p>
      <p>Temps total: {{ tempsTotal }} segons</p>
      <p>Errors totals: {{ errorsTotals }}</p>
      <button @click="reiniciarJoc">Reiniciar joc</button>
    </div>

    <div class="keyboard">
      <div v-for="(fila, indexFila) in Teclat" :key="indexFila" class="keyboard-row">
        <div
          v-for="tecla in fila"
          :key="tecla"
          class="key"
          :class="{ 'is-pressed': tecla === teclaPremuda }"
        >
          {{ tecla }}
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped>
/*  GENERAL STRUCTURE  */
.game-engine {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/*  TIMER  */
.timer {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.timer-text, .wpm-text {
  font-size: 20px;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.countdown {
  font-size: 4rem;
  color: var(--color-primary);
  margin-bottom: 20px;
}

/*  WORDS  */
.words-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 800px;
  gap: 10px;
  font-size: 24px;
  line-height: 1.8;
  color: var(--color-inactive);
}

.word {
  user-select: none;
  transition: color 0.3s ease;
}

.active-word {
  color: var(--color-primary);
  font-weight: 600;
  transform: scale(1.05);
}

.correcte {
  color: green;
}

.incorrecte {
  color: red;
}

.letter {
  transition: color 0.15s ease, transform 0.15s ease;
}

.correct-letter {
  color: var(--color-text);
}

.incorrect-letter {
  color: var(--color-error);
}

/*  INPUT  */
.word-input {
  position: absolute;
  top: -9999px;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}

/*  RESULTATS  */
h2 {
  color: var(--color-primary);
  margin-bottom: 15px;
}

p {
  margin: 6px 0;
  color: #aaa;
}

.active-word-letters {
  position: relative;
}

.caret {
  position: absolute;
  width: 2px;
  height: 1.5rem;
  background-color: var(--color-primary);
  animation: blink 1s infinite;
  left: 0;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.is-focused .timer {
  display: none;
}

.is-focused .results {
  display: none;
}

/* KEYBOARD */
.keyboard {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.key {
  background-color: var(--color-secondary);
  color: var(--color-text);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.1s, transform 0.1s;
}

.key.is-pressed {
  background-color: var(--color-primary);
  color: var(--color-secondary);
  transform: scale(0.95);
}
</style>
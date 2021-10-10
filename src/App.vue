<template>
  <div class="game">
    <h1>Uczymy się niemieckich słówek z użyciem Supermemo!</h1>
    <p class="question"><strong>{{ exercise.question }}</strong> to po niemiecku:</p>
    <ul class="options">
      <li v-for="(answer, index) in exercise.options" @click="noteAnswer(exercise, answer, index)" :class="{
        right: paused && exercise.answer === answer,
        wrong: paused && index === lastAnswer.index && (!lastAnswer.success),
      }">
        {{ answer }}
      </li>
    </ul>

    <div class="results">
      <p>Seria dobrych odpowiedzi: <strong>{{ numberOfConsecutiveCorrectAnswers }}</strong></p>
      <p>Dobre odpowiedzi: <strong>{{ answers.map(answer => answer.success).filter(state => state).length }}</strong></p>
      <p>Złe odpowiedzi: <strong>{{ answers.map(answer => !answer.success).filter(state => state).length }}</strong></p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    const questions = [
      { id: 1001, question: 'Ciastko', answer: 'der Kuchen', type: 'noun' },
      { id: 1002, question: 'Jogurt', answer: 'der Joghurt', type: 'noun' },
      { id: 1003, question: 'Mleko', answer: 'die Milch', type: 'noun' },
      { id: 1004, question: 'Masło', answer: 'die Butter', type: 'noun' },
      { id: 1005, question: 'Chleb', answer: 'das Brot', type: 'noun' },
      { id: 1006, question: 'Kurczak', answer: 'das Hähnchen', type: 'noun' },
      { id: 1007, question: 'Bułka', answer: 'das Brötchen', type: 'noun' },
      { id: 1008, question: 'Mango', answer: 'die Mango', type: 'noun' },
      { id: 1009, question: 'Jabłko', answer: 'der Apfel', type: 'noun' },
      { id: 1010, question: 'Ser', answer: 'der Käse' },
      { id: 1011, question: 'Banan', answer: 'die Banane' },
      { id: 1012, question: 'Jajko', answer: 'das Ei' },
      { id: 1013, question: 'Jajka', answer: 'die Eier' },
      { id: 1014, question: 'Szynka', answer: 'der Schinken' },
      { id: 1015, question: 'Kotlet', answer: 'das Kotlet' },
      // { id: 1016, question: 'Posiłki', answer: 'die Mahlzeiten' },
      // { id: 1017, question: 'Mięso', answer: 'das Fleisch' },
      // { id: 1018, question: 'Owoce', answer: 'die Obst' },
      // { id: 1019, question: 'Warzywa', answer: 'die Gemüse' },
      // { id: 1020, question: 'Woda', answer: 'das Wasser' },
      // { id: 2001, question: 'iść', answer: 'gehen', type: 'verb' },
      // { id: 2002, question: 'jechać', answer: 'fahren', type: 'verb' },
      // { id: 2003, question: 'biec', answer: 'laufen', type: 'verb' },
      // { id: 2004, question: 'jeść', answer: 'essen', type: 'verb' },
      // { id: 2005, question: 'sikać', answer: 'pinkeln', type: 'verb' },
      // { id: 2006, question: 'uczyć się', answer: 'lernen', type: 'verb' },
      // { id: 3001, question: 'pierwszy', answer: 'erster', type: 'numeral' },
      // { id: 3002, question: 'pierwsza', answer: 'erste', type: 'numeral' },
      // { id: 3003, question: 'pierwsze', answer: 'erstes', type: 'numeral' },
      // { id: 3004, question: 'drugi', answer: 'zweiter', type: 'numeral' },
      // { id: 3005, question: 'druga', answer: 'zweite', type: 'numeral' },
      // { id: 3006, question: 'drugie', answer: 'zweites', type: 'numeral' },
      // { id: 3007, question: 'trzeci', answer: 'dritter', type: 'numeral' },
      // { id: 3008, question: 'trzecia', answer: 'dritte', type: 'numeral' },
      // { id: 3009, question: 'trzecie', answer: 'drittes', type: 'numeral' },
      // { id: 4001, question: 'mu, jemu', answer: 'ihm', type: 'pronoun' },
      // { id: 4002, question: 'go, niego', answer: 'ihn', type: 'pronoun' },
      // { id: 4003, question: 'dokąd', answer: 'wohin', type: 'pronoun' },
      // { id: 4004, question: 'gdzie', answer: 'wo', type: 'pronoun' },
      // { id: 4005, question: 'skąd', answer: 'woher', type: 'pronoun' },
      // { id: 4006, question: 'mój', answer: 'mein', type: 'pronoun' },
      // { id: 4007, question: 'moja', answer: 'meiner', type: 'pronoun' },
      // { id: 4008, question: 'moje', answer: 'mein', type: 'pronoun' },
      // { id: 4009, question: 'twój', answer: 'dein', type: 'pronoun' },
      // { id: 4010, question: 'twoja', answer: 'deine', type: 'pronoun' },
      // { id: 4011, question: 'twoje', answer: 'dein', type: 'pronoun' },
      // { id: 4012, question: 'ja', answer: 'ich', type: 'pronoun' },
      // { id: 4013, question: 'ty', answer: 'du', type: 'pronoun' },
      // { id: 4014, question: 'on', answer: 'er', type: 'pronoun' },
      // { id: 4015, question: 'ona', answer: 'sie', type: 'pronoun' },
      // { id: 4016, question: 'ono (np. to dziecko)', answer: 'es', type: 'pronoun' },
      // { id: 4017, question: 'oni', answer: 'Sie', type: 'pronoun' },
      // { id: 5001, question: 'ładny', answer: 'schön', type: 'adjective' },
      // { id: 5002, question: 'brzydki', answer: 'hässlich', type: 'adjective' },
      // { id: 5003, question: 'szybki', answer: 'schnell', type: 'adjective' },
      // { id: 5004, question: 'wysoki', answer: 'groß', type: 'adjective' },
      // { id: 5005, question: 'niski', answer: 'niedrig', type: 'adjective' },
      // { id: 5006, question: 'smaczny', answer: 'lecker', type: 'adjective' },
      // { id: 5006, question: 'czerwony', answer: 'rot', type: 'adjective' },
      // { id: 5006, question: 'zielony', answer: 'grün', type: 'adjective' },
      // { id: 5006, question: 'niebieski', answer: 'blau', type: 'adjective' },
      // { id: 5006, question: 'biały', answer: 'weiß', type: 'adjective' },
      // { id: 5006, question: 'czarny', answer: 'schwarz', type: 'adjective' },
      // { id: 6001, question: 'szybko', answer: 'schnell', type: 'adverb' },
      // { id: 6002, question: 'wolno', answer: 'langsam', type: 'adverb' },
      // { id: 6003, question: 'wysoko', answer: 'hoch', type: 'adverb' },
      // { id: 6004, question: 'nisko', answer: 'niedrig', type: 'adverb' },
      // { id: 6005, question: 'daleko', answer: 'weit', type: 'adverb' },
      // { id: 6006, question: 'blisko', answer: 'nah', type: 'adverb' },
      // { id: 6007, question: 'nisko', answer: 'niedrig', type: 'adverb' },
    ]
    return {
      questionIndex: Math.floor(Math.random() * questions.length),
      paused: false,
      pauseLength: 2,
      questions,
      answers: [],
    }
  },
  computed: {
    exercise() {
      const { question, answer, type } = this.questions[this.questionIndex]
      const translated = answer.split(' ')[1]

      const questions = this.questions.filter(question => question.type === type)

      if (type === 'noun') {
        return {
          question,
          answer,
          options: [
            ...(['die', 'der', 'das'].map(artikel => [ artikel, translated ].join(' '))),
            ...(questions.filter(question => question.answer !== answer).random(4).map(question => question.answer))
          ].shuffle()
        }
      } else {
        return {
          question,
          answer,
          options: [
            answer,
            ...(questions.filter(question => question.answer !== answer).random(4).map(question => question.answer))
          ].shuffle()
        }
      }
    },
    lastAnswer() {
      return this.answers.last()
    },
    numberOfConsecutiveCorrectAnswers() {
      let result = 0
      for (let i = this.answers.length - 1; i >= 0; i--) {
        if (this.answers[i].success) {
          result++
        } else {
          break
        }
      }

      return result
    }
  },
  methods: {
    noteAnswer(exercise, answer, index) {
      if (this.paused) return

      this.answers.push({ index, success: exercise.answer === answer, exercise })

      this.paused = true
      setTimeout(() => {
        this.paused = false
        while (true) {
          const index = Math.floor(Math.random() * this.questions.length)
          if (index !== this.questionIndex) {
            this.questionIndex = index
            break;
          }
        }

      }, this.pauseLength * 1000)
    }
  }
})
</script>

<style>
html {
  font-family: Arial, Helvetica, sans-serif;
}
</style>

<style lang="scss" scoped>
.game {
  margin-left: 100px;
}

.question {
  font-size: 42px;
  strong {
    text-transform: uppercase;
  }
}

.options {
  font-size: 32px;
  list-style: disc;
  margin: 0 0 64px 64px;
  padding: 0;

  li {
    padding: 4px 8px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
  .right {
    background-color: green;
  }
  .wrong {
    background-color: red;
  }
}

.results {
  font-size: 24px;
  p {
    margin: 0; padding: 0;
  }
}
</style>

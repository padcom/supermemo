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
      { id: 1, question: 'Ciastko', answer: 'der Kuchen' },
      { id: 2, question: 'Jogurt', answer: 'der Joghurt' },
      { id: 3, question: 'Mleko', answer: 'die Milch' },
      { id: 4, question: 'Masło', answer: 'die Butter' },
      { id: 5, question: 'Chleb', answer: 'das Brot' },
      { id: 6, question: 'Kurczak', answer: 'das Hähnchen' },
      { id: 7, question: 'Bułka', answer: 'das Brötchen' },
      { id: 8, question: 'Mango', answer: 'die Mango' },
      { id: 9, question: 'Jabłko', answer: 'der Apfel' },
      { id: 10, question: 'Ser', answer: 'der Käse' },
      { id: 11, question: 'Banan', answer: 'die Banane' },
      { id: 12, question: 'Jajko', answer: 'das Ei' },
      { id: 13, question: 'Jajka', answer: 'die Eier' },
      { id: 14, question: 'Szynka', answer: 'der Schinken' },
      { id: 15, question: 'Kotlet', answer: 'das Kotlet' },
      { id: 16, question: 'Posiłki', answer: 'die Mahlzeiten' },
      { id: 17, question: 'Mięso', answer: 'das Fleisch' },
      { id: 18, question: 'Owoce', answer: 'die Obst' },
      { id: 19, question: 'Warzywa', answer: 'die Gemüse' },
      { id: 20, question: 'Woda', answer: 'das Wasser' },
    ]
    return {
      questionIndex: 0,
      paused: false,
      pauseLength: 2,
      questions,
      answers: [],
    }
  },
  computed: {
    exercise() {
      const { question, answer } = this.questions[this.questionIndex]
      const translated = answer.split(' ')[1]
      return {
        question,
        answer,
        options: [
          ...(['die', 'der', 'das'].map(artikel => [ artikel, translated ].join(' '))),
          ...(this.questions.filter(question => question.answer !== answer).random(4).map(question => question.answer))
        ].shuffle()
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

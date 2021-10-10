import { createApp } from 'vue'
import App from './App.vue'

import 'array-prototype-functions/last'

Array.prototype.random = function(n) {
  if (this.length === 0) {
    return null
  } else {
    const used = []
    while (used.length < n) {
      const index = Math.floor(Math.random() * this.length)
      if (used.indexOf(index) === -1) {
        used.push(index)
      }
    }
    const result = []
    for (let i = 0; i < used.length; i++) {
      result.push(this[used[i]])
    }

    return result
  }
}

Array.prototype.shuffle = function() {
  const array = [...this]
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
createApp(App).mount('#app')

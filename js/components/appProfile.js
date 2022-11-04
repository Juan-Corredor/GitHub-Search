app.component('app-profile', {
  props: ['result', 'isFavorite'],
  methods: {
    addFavorite() {
      this.$emit('add-favorite')
    },
    removeFavorite() {
      this.$emit('remove-favorite')
    }
  },
  template:
  /* html */ `
  <div class="result">
      <a 
        v-if="isFavorite" 
        href="#" 
        class="result__toggle-favorite" 
        @click="removeFavorite"
      >   Eliminar de Favorito ❌ 
      </a>
      <a v-else href="#" class="result__toggle-favorite" @click="addFavorite">Agregar a Favorito ⭐️</a>
      <h2 class="result__name">{{ result.name }}</h2>
      <img v-bind:src="result.avatar_url" :alt="result.name" class="result__avatar">
      <p class="result__bio"> 
        <span v-if="result.bio"> {{ result.bio }} </span>
        <span v-else="result.bio"> No se encontró biografía del usuario... </span>
        <br>
        <a :href="result.html_url" class="result__blog" target="_blank">{{ result.html_url }}</a>
      </p>
  </div>
  `
})
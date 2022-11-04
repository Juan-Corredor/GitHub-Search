const API = "https://api.github.com/users/";
const requestMaxTimeMs = 3000

const app = Vue.createApp({
  data() {
    return {
      search: null, //juanwmedia      
      result: null,
      error: null,
      favorites: new Map()
    }
  },
  created() {
    const saveFavorities = JSON.parse(window.localStorage.getItem("favorities"))

    if (saveFavorities?.length) {
      const favorites = new Map(saveFavorities.map(fav => [fav.login, fav]))
      this.favorites = favorites;
    }
  },
  computed: {
    isFavorite() {
      let resultValue = false;
      this.result?.length ? resultValue : resultValue = this.favorites.has(this.result.login)
      return resultValue
    },
    allFavorities() {
      return Array.from(this.favorites.values())
    }
  },
  methods: {
    async doSearch() {
      const foundInFavorities = this.favorites.get(this.search)

      const shouldRequestAgain = (() => {
        if (!!foundInFavorities) {
          const { lastRequest } = foundInFavorities;
          const now = Date.now();
          return (now - lastRequest) > requestMaxTimeMs;
        }

        return false;
      })() //IIFE

      //!!: convierte en booleado
      if (!!foundInFavorities && !shouldRequestAgain) {
        console.log("Found and we use the cached version ❌");
        return this.result = foundInFavorities;
      }

      await this.doRequest()
      if (foundInFavorites) foundInFavorites.lastRequest = new Date();
    },
    async doRequest() {
      this.result = this.error = null;
      try {
        console.log("Not found or cached version is too old ✅");
        const response = await fetch(API + this.search)
        const data = await response.json()

        if (!response.ok) throw new Error("User not found");
        this.result = data;
      } catch (error) {
        this.error = error;
      } finally {
        this.search = null;
      }
    },
    checkFavorite(login) {
      return this.result?.login === login
    },
    addFavorite() {
      this.result.lastRequest = new Date()
      this.favorites.set(this.result.login, this.result);
      this.updateStorage()
    },
    removeFavorite() {
      this.favorites.delete(this.result.login);
      this.updateStorage()
    },
    showFavorite(favorite) {
      this.result = favorite
    },
    updateStorage() {
      window.localStorage.setItem('favorities', JSON.stringify(this.allFavorities))
    }
  }
});

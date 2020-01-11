import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:9000/"
})

export default {
    async search({ commit, state }, { searchTerm, page }) {
        if (state.searchTerm != searchTerm) {
            let response = await api.get('gogo', {
                params: {
                    keyword: searchTerm,
                    page: page
                }
            })
            if (response.status === 200) {
                commit('setSearch', { searchTerm: searchTerm, searchResults: response.data})
            }
        }
    },
    async fetchAnime({ commit, state }, anime) {
        if (state.anime[anime] == undefined) {
            let response = await api.get('gogoCategory', {
                params: {
                    category: anime.catURL
                }
            })
            if (response.status === 200) {
                commit('setAnime', { anime, episodes: response.data.episodes })
            }
        }
    }
}
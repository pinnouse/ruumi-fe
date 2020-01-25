import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/",
})

export default {
    async search({ commit, state }, searchTerm) {
        if (state.searchTerm != searchTerm) {
            let response = await api.get('api/search', {
                params: {
                    q: searchTerm
                }
            })
            if (response.status === 200) {
                commit('setSearch', { searchTerm: searchTerm, searchResults: response.data})
            }
        }
    },
    async fetchAnime({ commit, state }, animeId) {
        if (!state.anime[animeId]) {
            let response = await api.get('api/anime', {
                params: {
                    id: animeId
                }
            })
            if (response.status === 200) {
                commit('setAnime', response.data)
            }
        }
    },
    async getRoom({ commit }, roomId) {
        let response = await api.get('getRoom', {
            params: {
                room: roomId
            }
        })
        if (response.status === 200) {
            commit('setRoom', {room: response.data})
        }
    }
}
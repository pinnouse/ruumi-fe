import axios from "axios";

const api = axios.create({
    baseURL: (process.env.hostProtocol || 'http') + '://' +
        (process.env.NODE_ENV === 'production' ? process.env.hostUrl : "localhost:3000/"),
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
    async list({ commit }) {
        try {
            let response = await api.get('api/list', {
                params: {
                    a: 20
                }
            })
            if (response.status === 200) {
                commit('setSearch', { searchResults: response.data })
            }

        } catch(e) {
            console.error(e)
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
    async fetchEpisode({ commit }, { animeId, epNum }) {
        console.log(animeId, epNum)
        let response = await api.get('api/episode', {
            params: {
                id: animeId,
                ep: epNum
            }
        })
        if (response.status === 200) {
            commit('setEpisode', { source: response.data.url })
            return response.data
        }
    },
    async createRoom({ dispatch, state }, {user, episode, anime}) {
        await dispatch('fetchEpisode', {animeId: anime.id, epNum: episode})
        return await api.post('createRoom', {
            data: {
                user, episode, anime,
                source: state.source
            }
        })
    },
    async delRoom({}, data) {
        return await api.post('delRoom', {
            data: data
        })
    },
    async getRoom({ commit }, room) {
        let response = await api.get('getRoom', {
            params: {
                room: room
            }
        })
        if (response.status === 200) {
            commit('setRoom', {room: response.data})
        }
    }
}
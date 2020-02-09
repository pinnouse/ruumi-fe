export default {
    setSearch(state, { searchTerm, searchResults}) {
        state.searchTerm = searchTerm
        state.search = searchResults
    },
    setAnime(state, anime) {
        state.anime[anime.id] = anime
    },
    setEpisode(state, { animeId, epNum, source }) {
        if (state.anime[animeId]) {
            state.anime[animeId].episodes.find(a => a.epNum == epNum).source = source
        }
    },
    setRoom(state, {room}) {
        state.room = room
    },
    setUser(state, user) {
        state.user = user
    }
}
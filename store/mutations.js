export default {
    setSearch(state, { searchTerm, searchResults}) {
        state.searchTerm = searchTerm
        state.search = searchResults
    },
    setAnime(state, anime) {
        state.anime[anime.id] = anime
    },
    setRoom(state, {room}) {
        state.room = room
    },
    setUser(state, user) {
        state.user = user
    }
}
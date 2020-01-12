export default {
    setSearch(state, { searchTerm, searchResults}) {
        state.searchTerm = searchTerm
        state.search = searchResults
    },
    setAnime(state, { anime, episodes }) {
        anime.episodes = episodes
        state.anime[anime.catURL.substr(10)] = anime
    },
    setRoom(state, {room}) {
        state.room = room
    }
}
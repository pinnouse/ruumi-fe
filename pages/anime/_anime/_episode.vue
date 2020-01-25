<template>
    <div>
        <h1>{{anime.title}}</h1>
        <h5>Episode {{$route.params.episode}}</h5>
        <router-link :to="`/anime/${$route.params.anime}`">Back to episode list</router-link>
        <button v-if="user" type="submit" @click="createRoom">Create Room</button>
        <template v-else>
            <h5>You must be logged in first</h5>
            <a href="/login">Login</a>
        </template>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    async asyncData({ store, params, error }) {
        try {
            if (!store.state.anime[params.anime]) {
                await store.dispatch('fetchAnime', params.anime)
            }
            if (!/^[0-9]+$/.test(params.episode)) {
                error({ statusCode: 404, message: "Improper episode format." })
            } else if (!store.state.anime[params.anime].episodes.find(e => e.epNum == params.episode)) {
                error({ statusCode: 404, message: "Episode not found." })
            }
        } catch(e) {
            console.error(e)
            error({ statusCode: 404, message: "Anime not found." })
        }
    },
    computed: {
        anime() {
            return this.$store.state.anime[this.$route.params.anime]
        },
        episode() {
            return this.anime.episodes.find(e => e.epNum == this.$route.params.episode)
        },
        user() {
            return Object.entries(this.$store.state.user).length > 0 ? this.$store.state.user : false
        }
    },
    methods: {
        async createRoom() {
            try {
                let r = await axios.post('http://localhost:3000/createRoom', {
                    data: {
                        user: this.user,
                        episode: this.episode,
                        anime: this.anime
                    }
                })
                window.location.href = `http://localhost:3000/room/${r.data.roomId}`
            } catch(e) {
                console.log(e);
            }
        }
    }
}
</script>
<template>
    <div id="episode">
        <div class="bg">
            <img :src="anime.poster" />
            <div class="fade-cover"></div>
        </div>
        <div class="inner-container">
            <div class="anime-title">
                <img class="poster" :src="anime.poster" />
                <h2>{{anime.title}}</h2>
                <h5 v-if="alts"><i>{{alts}}</i></h5>
            </div>
            <h3>Episode {{$route.params.episode}}</h3>
            <router-link :to="`/anime/${$route.params.anime}`">Back to episode list</router-link>
            <button v-if="user" type="submit" @click="createRoom">Create Room</button>
            <template v-else>
                <h5>You must be logged in first</h5>
                <a href="/login">Login</a>
            </template>
        </div>
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
        },
        alts() {
            return this.anime.altTitles && this.anime.altTitles.length > 0
                ? this.anime.altTitles.join(', ') : false
        }
    },
    methods: {
        async createRoom() {
            try {
                await this.$store.dispatch('fetchEpisode', { animeId: this.anime.id, epNum: this.episode.epNum})
            } catch(e) {
                console.error(e.response)
                alert(e)
                return
            }
            try {
                let r = await this.$store.dispatch('createRoom', {user: this.user, episode: this.episode, anime: this.anime })
                this.$router.push(`/room/${r.data.roomId}`)
            } catch(e) {
                console.error(e);
            }
        }
    }
}
</script>

<style lang="scss">
.bg {
    z-index: -1;
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    overflow: hidden;
    width: 100vw;
    
    & > .fade-cover {
        z-index: 3;
        width: 100%;
        height: 100%;
        background: linear-gradient(transparent 20%, var(--background-color) 90%);
    }

    & > img {
        z-index: -1;
        position: absolute;
        top: -5%;
        left: -5%;
        width: 110%;
        filter: blur(9px);
    }
}

#episode .inner-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: var(--background-color);
    margin-top: 40vh;
    flex: 1;
    align-self: stretch;
    border-radius: 8px;
    padding: 18px;
    box-shadow: 4px 8px 16px 3px rgba(16, 10, 12, 0.308);

    & > .anime-title {
        position: relative;
        font-size: 28px;
        padding: 8px 0 12px 240px;
        min-height: 220px;
        margin-bottom: 12px;
        align-self: stretch;
        border-bottom: 3px solid #ad3952;

        & > h2 {
            margin-bottom: 4px;
        }

        & > h5 {
            margin: 6px 0;
        }

        & > .poster {
            user-select: none;
            position: absolute;
            top: -120px;
            left: 0;
            width: 220px;
            pointer-events: none;
            border-radius: 4px;
        }
    }
}
</style>
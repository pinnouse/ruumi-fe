<template>
    <div id="anime">
        <div class="bg">
            <img :src="anime.poster" />
            <div class="fade-cover"></div>
        </div>
        <div class="inner-container">
            <div class="anime-title">
                <img class="poster" :src="anime.poster" />
                <h2>{{anime.title}}</h2>
                <h5 v-if="alts">{{alts}}</h5>
                <h5 v-else><i>No alternate titles</i></h5>
            </div>
            <router-link class="btn" to="/search">Back</router-link>
            <h4 v-if="anime.episodes != 1">{{anime.episodes}} episodes.</h4>
            <h5 v-if="!user || user.guest">You must <a class="btn" href="/login">login</a> to create a room!</h5>
            <template v-else>
                <h4>Watch</h4>
                <div class="episode-list" v-if="anime.episodes != 1">
                    <div v-for="i in anime.episodes"
                        :key="anime.title + i"
                        :style="{
                            'animation-delay': `${Math.sqrt(i) * 0.066}s`
                            }">
                        <button @click="createRoom(i)">Episode {{i}}</button>
                    </div>
                </div>
                <div class="episode-list" v-else>
                    <div>
                        <button @click="createRoom(1)">Watch</button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ store, params, error }) {
        try {
            return await store.dispatch('fetchAnime', params.anime)
        } catch(e) {
            error({ statusCode: 404, message: "Anime not found." })
        }
    },
    computed: {
        anime() {
            let anim = this.$route.params.anime
            if (!this.$store.state.anime && !this.$store.state.anime[anim])
                return this.$store.state.search.find(s => s.id == anim)
            return this.$store.state.anime[anim]
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
        async createRoom(epNum) {
            if (!this.user) {
                alert("You must be logged in to create a room!")
                return
            }
            try {
                let r = await this.$store.dispatch('createRoom', {user: this.user, episode: epNum, anime: this.anime })
                this.$router.push(`/room/${r.data.roomId}`)
            } catch(e) {
                console.error(e);
                alert("Failed to create room: " + e)
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

#anime .inner-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: var(--background-color);
    margin-top: 40vh;
    flex: 1;
    align-self: stretch;
    padding: 18px;
    box-shadow: 4px 8px 4px 4px rgba(16, 10, 12, 0.062);

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
            box-shadow: 2px 2px 6px 0 rgba(16, 10, 12, 0.199);
        }
    }
}

.episode-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    & > div {
        display: inline-block;
        margin: 8px;
        opacity: 0;
        animation: fade-in .3s ease-out forwards;
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(-30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
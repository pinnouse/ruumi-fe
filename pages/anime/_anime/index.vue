<template>
    <div>
        <h1>ANIME</h1>
        <h2>{{anime.title}}</h2>
        <h5 v-if="alts">
            Also known as: <i>{{alts}}</i>
        </h5>
        <router-link to="/search">Back</router-link>
        <h4>Currently has {{anime.episodes.length}} episode(s).</h4>
        <div class="episode-list">
            <div v-for="(e, i) in anime.episodes"
                :key="e"
                :style="{
                    'animation-delay': `${Math.sqrt(i) * 0.066}s`
                    }">
                <router-link :to="`./${anime.id}/${e.epNum}`">Episode {{e.epNum}}</router-link>
            </div>
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
        alts() {
            return this.anime.altTitles.length > 0
                ? this.anime.altTitles.join(', ') : false
        }
    },
}
</script>

<style lang="scss">
.episode-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    & > div {
        display: inline-block;
        margin: 8px;
        opacity: 0;
        animation: fade-in .3s ease-out forwards;

        & > a {
            display: block;
            padding: 14px;
            border-radius: 2px;
            background-color: #df465f;
            color: #ffffff;
            text-decoration: none;
            transition: .12s;

            &:hover {
                background-color: #ad3952;
            }
        }
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(60px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
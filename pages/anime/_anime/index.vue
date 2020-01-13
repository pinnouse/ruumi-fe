<template>
    <div>
        <h1>ANIME</h1>
        <h2>{{anime.name}}</h2>
        <router-link to="/search">Back</router-link>
        <h4>Currently has {{anime.episodes}} episodes.</h4>
        <div class="episode-list">
            <div v-for="(e, i) in anime.episodes"
                :key="e"
                :style="{
                    'animation-delay': `${Math.sqrt(i) * 0.066}s`
                    }">
                <router-link :to="`./${anime.catURL.substr(10)}/${e}`">{{e}}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ store, params }) {
        return await store.dispatch(
            'fetchAnime',
            store.state.search.find(s => s.catURL.substr(10) == params.anime)
            )
    },
    computed: {
        anime() {
            let anim = this.$route.params.anime
            if (!this.$store.state.anime && !this.$store.state.anime[anim])
                return this.$store.state.search.find(s => s.catURL.substr(10) == anim)
            return this.$store.state.anime[anim]
        }
    },
    validate({ params, store }) {
        return (store.state.anime && store.state.anime[params.anime] != undefined) ||
            store.state.search.findIndex(s => s.catURL.substr(10) == params.anime) >= 0
    }
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
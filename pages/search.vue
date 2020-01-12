<template>
    <div>
        <h1>SEARCH</h1>
        <router-link to="/">Home</router-link>
        <form class="search" @submit.prevent="newSearch">
            <input type="text" placeholder="Search" v-model="keyword">
            <button type="submit">Search</button>
        </form>
        <div class="search-results">
            <template v-if="!loading">
                <span v-if="noResults">
                    No results found.
                </span>
                <template v-else>
                    <div v-for="(a, i) in search"
                        :key="i"
                        :style="{
                            'animation-delay': `${i*0.026}s`
                            }">
                        <router-link :to="`/anime/${a.catURL.replace(/^\/category\//i, '')}`">{{a.name}}</router-link>
                    </div>
                </template>
            </template>
            <span v-else>
                Loading...
            </span>
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ store, query }) {
        if (query.q) {
            return await store.dispatch("search", { searchTerm: query.q, page: query.p || 1})
        }
    },
    computed: {
        search() {
            return this.$store.state.search
        },
        noResults() {
            return this.search.length == 0 || this.search[0].catURL.startsWith('https://')
        }
    },
    data() {
        return {
            keyword: this.$route.query.q || this.$store.state.searchTerm || "",
            loading: false,
            page: 1
        }
    },
    methods: {
        async newSearch() {
            this.loading = true
            await this.$store.dispatch("search", { searchTerm: this.keyword, page: 1 })
            this.page = 1
            this.loading = false
        }
    }
}
</script>

<style lang="scss">
.search-results {
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

*:focus {
    outline: none;
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
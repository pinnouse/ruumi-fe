<template>
    <div>
        <h1>SEARCH</h1>
        <router-link to="/">Home</router-link>
        <form class="search" @submit.prevent="newSearch">
            <input type="text" placeholder="Search" v-model="keyword" autofocus>
            <button type="submit">Search</button>
        </form>
        <div class="search-results">
            <template v-if="!loading && error.message.length == 0">
                <span v-if="noResults">
                    No results found.
                </span>
                <template v-else>
                    <div v-for="(a, i) in search"
                        :key="i"
                        :style="{
                            'animation-delay': `${Math.sqrt(i) * 0.066}s`
                            }"
                        class="result">
                        <router-link :to="`/anime/${a.id}`"
                            :title="a.title">
                            <img :src="a.poster" />
                            <h3>{{a.title}}</h3>
                        </router-link>
                    </div>
                </template>
            </template>
            <span v-else-if="error.message == 0">
                Loading...
            </span>
            <span v-else class="error">
                <h2>{{error.title}}</h2>
                <p v-html="error.message"></p>
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
            return this.search.length == 0
        }
    },
    data() {
        return {
            keyword: this.$route.query.q || this.$store.state.searchTerm || "",
            loading: false,
            error: {
                type: "",
                message: "",
            },
        }
    },
    methods: {
        async newSearch() {
            this.loading = true
            try {
                this.error.message = ""
                await this.$store.dispatch("search", this.keyword)
            } catch(e) {
                this.error = {
                    title: "Server error",
                    message: `Main server might be down or backed up, this should be resolved shortly.
                    <br />
                    Please report this error if it lasts too long.`
                }
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style lang="scss">
.search-results {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    & > .result {
        display: inline-block;
        margin: 8px;
        opacity: 0;
        animation: fade-in .3s ease-out forwards;

        & > a {
            display: flex;
            flex-direction: column;
            padding: 0;
            background-color: #df465f;
            color: #ffffff;
            text-decoration: none;
            box-shadow: 3px 4px 8px 5px rgba(24, 24, 24, 0.425);
            max-width: 260px;
            transition: .12s;

            & > img {
                display: inline-block;
                border-radius: 4px 4px 0 0;
                width: 260px;
                transition: .12s;
            }

            & > h3 {
                font-size: 20px;
                margin: 0;
                padding: 14px 10px;
            }

            &:hover {
                background-color: #ad3952;
                transform: translateY(-5px);

                & > img {
                    opacity: .8;
                }
            }
        }
    }

    & > span {
        display: inline-block;
        font-size: 20px;

        &.error {
            opacity: 0;
            animation: fade-in .3s ease-out forwards;

            & > h2 {
                font-size: 25px;
                color: #df465f;
                font-weight: bold;
                margin-bottom: 4px;
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
        transform: translateY(-30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
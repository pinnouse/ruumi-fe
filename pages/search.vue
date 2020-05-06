<template>
    <div>
        <h1>SEARCH</h1>
        <router-link class="btn" to="/">Home</router-link>
        <form class="search" @submit.prevent="newSearch" style="margin-bottom: 12px;">
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
                        <router-link class="btn" :to="`/anime/${a.id}`"
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
        } else if (store.state.search.length == 0) {
            return await store.dispatch("list")
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
    justify-content: center;
    width: 100%;

    & > .result {
        display: inline-block;
        margin: 32px 16px 8px;
        opacity: 0;
        animation: fade-in .3s ease-out forwards;

        & > a {
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 0;
            color: var(--alt-font-color);
            text-decoration: none;
            box-shadow: 2px 4px 3px 5px rgba(24, 24, 24, 0.075);
            max-width: 260px;
            transition: all .12s ease-out;

            & > img {
                display: inline-block;
                border-radius: 4px 4px 0 0;
                width: 260px;
                transition: .12s;
            }

            & > h3 {
                position: absolute;
                top: calc(100% - 16px);
                left: 12px;
                width: 100%;
                background-color: var(--theme-color);
                font-size: 16px;
                font-weight: normal;
                margin: 0;
                padding: 18px 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                box-shadow: 2px 4px 6px 2px rgba(29, 5, 17, 0.103);
            }

            &:hover {
                background-color: var(--secondary-color);
                transform: translateY(-12px);

                & > img {
                    opacity: .87;
                }

                & > h3 {
                    background-color: var(--secondary-color);
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
                color: var(--secondary-color);
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
        transform: translateY(-40px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
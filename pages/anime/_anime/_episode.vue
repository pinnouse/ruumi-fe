<template>
    <div>
        <h1>EPISODE {{$route.params.episode}}</h1>
        <router-link :to="`/anime/${$route.params.anime}`">Back to episode list</router-link>
        <button type="submit" @click="createRoom">Create Room</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    validate({params, store}) {
        return /^\d+/.test(params.episode) && store.state.anime && store.state.anime[params.anime]
    },
    computed: {
        anime() {
            return this.$store.state.anime[this.$route.params.anime]
        }
    },
    methods: {
        async createRoom() {
            try {
                let r = await axios.get('http://localhost:9000/gogoEpisode', {
                    params: {
                        category: this.anime.catURL,
                        episode: this.$route.params.episode,
                    }
                })
                if (r.status === 200) {
                    let ep = r.data;
                    let r2 = await axios.post('http://localhost:3000/createRoom', {
                        data: {
                            user: this.$store.state.user,
                            episode: ep,
                            anime: this.anime
                        }
                    })
                    window.location.href = `http://localhost:3000/room/${r2.data.roomId}`
                } else {
                    alert('There was an error retrieving episode data.');
                }
            } catch(e) {
                console.log(e);
            }
        }
    }
}
</script>
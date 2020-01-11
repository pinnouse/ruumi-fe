<template>
    <div>
        Hi
    </div>
</template>

<script>
import axios from 'axios';

export default {
    validate({params}) {
        return /^\d+/.test(params.episode)
    },
    async fetch({ params, store, redirect }) {
        let rooms = await axios.get('http://localhost:9000/gogoEpisode', {
            params: {
                category: `/category/${params.anime}`,
                episode: parseInt(params.episode)
            }
        })
    }
}
</script>
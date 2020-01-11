<template>
    <div class="container">
        <router-link to="search">Search</router-link>
        <form @submit.prevent="joinRoom">
            <input type="text" placeholder="Room ID" v-model="roomId">
            <button type="submit">Join Room</button>
        </form>
    </div>
</template>

<script>
export default {
    methods: {
        joinRoom() {
          
        }
    },
    data() {
        return {
            roomId: ""
        }
    }
}
</script>
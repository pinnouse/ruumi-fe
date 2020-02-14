<template>
    <div>
        <div id="home">
            <div class="hero">
                <h1>Ruumi</h1>
                <span v-if="hasUser" style="font-size: 10pt;">Hey there, {{user.username}}#{{user.discriminator}}!</span>
                <span>{{motd}}</span>
            </div>
            <div>
                <router-link class="btn" to="search">Search</router-link>
                <a class="btn" v-if="!hasUser" href="/login">Login</a>
                <a class="btn" v-else href="/logout">Logout</a>
            </div>
        </div>
    </div>
</template>

<script>
const MESSAGES = [
    "Watch anime with friends in ruuuuums. Get it?",
    "Stream anime in rooms!",
    "Cool chatting things so you can talk.",
    "I don't do anything illegal IDK what you're on about. You're the illegal one.",
    "Yay rooms",
    "ルーミ！！",
    "Made with 💖",
]
export default {
    computed: {
        hasUser() {
            return !(Object.entries(this.$store.state.user).length === 0 && this.$store.state.user.constructor === Object)
        },
        user() {
            return this.$store.state.user
        },
        motd() {
            return MESSAGES[Math.floor(Math.random()*MESSAGES.length)]
        }
    },
    methods: {
        joinRoom() {
          
        }
    },
    data() {
        return {
            roomId: "",
        }
    }
}
</script>

<style lang="scss">
#home {
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    min-height: 90vh;
    min-width: 50vw;
    flex: 1;

    & > * {
        opacity: 0;
        margin-bottom: 12px;
        animation: fade-bottom 0.3s ease-out 0.2s forwards;
    }

    & > .hero {
        text-align: center;
        margin-bottom: 38px;
        animation: fade-in 0.6s ease-out forwards;

        & > h1 {
            font-size: 3.2em;
            margin-bottom: 4px;
        }

        & > span {
            display: block;
            font-size: 16px;
            margin-bottom: 4px;
        }
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateY(-80px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-bottom {
    0% {
        opacity: 0;
        transform: translateY(40px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
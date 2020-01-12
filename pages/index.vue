<template>
    <div class="container">
        <div id="home">
            <div class="hero">
                <h1>Ruumi</h1>
                <span>{{motd}}</span>
            </div>
            <router-link to="search">Search</router-link>
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
    methods: {
        joinRoom() {
          
        }
    },
    data() {
        return {
            roomId: "",
            motd: MESSAGES[Math.floor(Math.random()*MESSAGES.length)]
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
            font-size: 16px;
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
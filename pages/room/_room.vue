<template>
    <div>
        <button type="submit" @click="leaveRoom">Leave</button>
        <div class="inner-container">
            <div class="video-container">
                <h1>{{room.anime.title}}</h1>
                <h3>Episode {{room.episode.epNum}}</h3>
                <div class="player">
                    <video ref="video"
                        @timeupdate="setTime"
                        @pause="pauseHandler"
                        @playing="playingHandler"
                        @dblclick.stop="fullscreen"
                        @loadedmetadata="loadDuration"
                        controls>
                        <source :src="room.episode.source" type="video/mp4">
                    </video>
                    <div class="controls" @click.stop="playPause" @dblclick.stop="fullscreen" ref="controls">
                        <button class="play" data-icon="P" aria-label="play pause toggle" @click.stop="playPause">{{pauseText}}</button>
                        <div class="timer" ref="timerWrapper">
                            <div ref="timerBar"></div>
                            <span aria-label="timer" ref="timer">{{currentSeek}} / {{durationText}}</span>
                        </div>
                    </div>
                </div>
                <h5>{{room.owner.username}}#{{room.owner.discriminator}}'s room {{privateText}}</h5>
                <span>Room link: <u class="copy-link" @click="copyLink" title="Copy room link">https://ruumi.net/room/{{room.id}}</u></span>
            </div>
            <div class="chat-container">
                <div class="chat-users">
                    <span class="user" v-for="u in users"
                        :key="u.id"
                        :class="{
                            owner: u.id == room.owner.id,
                            me: u.id == user.id
                            }">
                        {{u.username}}#{{u.discriminator}}
                    </span>
                </div>
                <div class="chat-items">
                    <div v-for="(c, i) in chat"
                        :key="i">
                        <strong :class="{
                            owner: c.user.id == room.owner.id,
                            me: c.user.id == user.id
                            }">
                            {{c.user.username}}#{{c.user.discriminator}}
                        </strong>
                        <span>{{c.message}}</span>
                    </div>
                </div>
                <form id="chat-form" @submit.prevent="sendMessage">
                    <input type="text" placeholder="Start chatting..." v-model="message">
                    <button type="submit"><img src="~assets/send.svg" /></button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    layout: 'roomLayout',
    async asyncData({store, params, error}) {
        try {
            return await store.dispatch('getRoom', params.room)
        } catch(e) {
            error({ statusCode: 404, message: 'Room not found' })
        }
    },
    data() {
        return {
            paused: true,
            hours: false,
            duration: 0,
            currentSeek: "00:00",
            message: "",
            chat: [],
            ws: {},
        }
    },
    computed: {
        room() {
            return this.$store.state.room
        },
        user() {
            return this.$store.state.user
        },
        users() {
            return this.$store.state.room.users
        },
        pauseText() {
            return this.paused ? '▶' : '⏸'
        },
        durationText() {
            let s = Math.floor(this.duration) % 60
            let m = Math.floor(this.duration / 60)
            let h = Math.floor(this.duration / 3600)
            function twoDigit(d) {
                return ("0" + d).slice(-2)
            }
            if (h) return `${twoDigit(h)}:${twoDigit(m)}:${twoDigit(s)}`
            return `${twoDigit(m)}:${twoDigit(s)}`
        },
        privateRoom() {
            return this.room.password && this.room.password.length > 0
        },
        privateText() {
            return this.privateRoom ? '🔒' : '🔓'
        }
    },
    methods: {
        pauseHandler() {
            this.paused = true
        },
        playingHandler() {
            this.paused = false
        },
        loadDuration(e) {
            this.duration = e.target.duration
            if (this.duration > 3600) {
                this.hours = true
                this.currentSeek = "00:00:00"
            }
        },
        leaveRoom() {
            window.location.href = '../';
            if (this.room && this.room.owner && this.room.owner.id == this.$store.state.user.id) {
                this.$store.dispatch('delRoom', { roomId: this.room.id, userId: this.$store.state.user.id })
            }
        },
        copyLink() {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(`https://ruumi.net/room/${this.room.id}`)
            }
        },
        playPause() {
            if (this.$refs.video) {
                if (this.$refs.video.paused) {
                    this.$refs.video.play()
                } else {
                    this.$refs.video.pause()
                }
            }
        },
        setTime() {
            let media = this.$refs.video;
            if (media) {
                let s = Math.floor(media.currentTime) % 60
                let m = Math.floor(media.currentTime / 60)
                let h = Math.floor(media.currentTime / 3600)
                function twoDigit(d) {
                    return ("0" + d).slice(-2)
                }
                if (this.hours) this.currentSeek = `${twoDigit(h)}:${twoDigit(m)}:${twoDigit(s)}`
                else this.currentSeek = `${twoDigit(m)}:${twoDigit(s)}`
    
                let barLength = this.$refs.timerWrapper.clientWidth * (media.currentTime/media.duration);
                this.$refs.timerBar.style.width = barLength + 'px';
            }
        },
        fullscreen() {
            var elem = this.$refs.video;
            if (elem) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { 
                    elem.msRequestFullscreen();
                }
            }
        },
        sendMessage() {
            if (this.ws && this.message.trim().length > 0) {
                this.ws.send(JSON.stringify({message: this.message.trim(), user: this.user}))
                this.message = ""
            }
        }
    },
    mounted() {
        if (this.$refs.video) {
            this.$refs.video.removeAttribute('controls');
            this.$refs.controls.style.visibility = 'visible';
        }
        let _vm = this;
        let ws = undefined;
        function connectWS() {
            ws = new WebSocket(`ws://localhost:3000/?r=${_vm.$route.params.room}`);
            _vm.ws = ws;
            ws.onopen = handleWS;
            ws.onerror = ev => {
                console.log('Failed to connect to chat WS');
                console.error(ev);
                setTimeout(connectWS, 1000 * 5);
            }
        }
        function handleWS() {
            ws.onmessage = ev => {
                if (!ev.data) return;
                let data = JSON.parse(ev.data)
                console.log(data)
                _vm.chat.push(data)
            }
            ws.onclose = () => {
                console.log('Chat WS closed, reconnecting...');
                setTimeout(connectWS, 1000 * 5);
            }
            ws.onerror = ev => {
                console.log('Failed to connect to chat WS');
                console.error(ev);
                setTimeout(connectWS, 1000 * 5);
            }
        }
        connectWS();
    },
    head() {
        return {
            title: `${this.room.owner.username}'s ruum | Ruumi`
        }
    }
}
</script>

<style lang="scss">
.room .inner-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    & > .video-container {
        width: 60%;
        cursor: default;
        user-select: none;

        & > .player {
            cursor: pointer;
            position: relative;
        
            & > video {
                position: relative;
                display: block;
                width: 100%;
                background: #000000;
                box-shadow: 5px 6px 18px 2px rgba(6, 2, 4, 0.33);
            }

            & > .controls {
                box-sizing: border-box;
                visibility: hidden;
                opacity: 0;
                width: 100%;
                height: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                background-color: rgba(6, 2, 4, 0.33);
                transition: all .23s;
                display: flex;

                & > button {
                    position: absolute;
                    top: calc(50% - 40px);
                    left: calc(50% - 40px);
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    height: 80px;
                    width: 80px;
                    border-radius: 50%;
                    padding: 0;
                    margin: 0;
                    opacity: .6;
                    transition: opacity 0.33s;

                    &:hover {
                        opacity: .8;
                        background-color: #df465f;
                    }
                }
            }

            &:hover > .controls,
            &:focus > .controls {
                opacity: 1;
                transition: opacity .53s;
            }
        }
    }

    & > .chat-container {
        display: flex;
        flex-direction: column;
        width: 30%;
        min-height: 700px;
        box-shadow: 5px 6px 18px 2px rgba(6, 2, 4, 0.33);

        & > .chat-users {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;
            max-height: 60px;
            background: #ad3952;
            box-sizing: border-box;
            padding: 8px 4px;
            overflow-y: auto;

            & > .user {
                margin: 4px 6px;
                padding: 4px 10px;
                font-size: 10px;
                border-radius: 9px;
                background: #816b6f;

                &.me {
                    background: #8a3644;
                }

                &.owner {
                    background: #df465f !important;
                }
            }
        }

        & > .chat-items {
            flex: 1;
            background: #000000;
            font-size: 12px;

            & > div {
                padding: 8px;

                & > strong {
                    background: #614a4f;
                    padding: 2px;
                    margin-right: 6px;

                    &.me {
                        background: #742536;
                    }

                    &.owner {
                        background: #df465f !important;
                    }
                }

                &:nth-child(2n) {
                    background: #181614;
                }
            }
        }

        & > form#chat-form {
            position: relative;
            display: block;
        
            & > input {
                outline: none;
                border: none;
                border-top: 3px solid #ad3952;
                border-radius: unset;
                background: #000000;
                color: #ffffff;
                width: 100%;
                max-width: unset;
                margin: 0;
                font-size: 14px;
                padding: 20px 12px;
                box-sizing: border-box;
                transition: background .33s;

                &:focus {
                    background: #241c1f;
                }
            }

            & > button {
                display: block;
                position: absolute;
                top: 0;
                right: 0;
                width: 28px;
                height: 28px;
                padding: unset;
                background: unset;

                & > img {
                    width: inherit;
                    height: inherit;
                }
            }
        }
    }
}

.timer {
    line-height: 38px;
    height: 38px;
    font-size: 10px;
    color: white;
    flex: 5;
    position: absolute;
    bottom: 0;
}

.timer div {
    position: absolute;
    background-color: rgba(255,255,255,0.2);
    left: 0;
    top: 0;
    width: 0;
    height: 38px;
    z-index: 2;
}

.timer span {
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    z-index: 3;
    left: 19px;
    bottom: 0;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
}

.copy-link {
    cursor: pointer;
}
</style>
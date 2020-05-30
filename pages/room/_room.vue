<template>
    <div>
        <button type="submit" @click="leaveRoom">Leave</button>
        <div class="inner-container">
            <div class="video-container">
                <h1>{{room.anime.title}}</h1>
                <h3>Episode {{room.episode}}</h3>
                <div class="player">
                    <video ref="video"
                        autoplay
                        @timeupdate="setTime"
                        @pause="pauseHandler"
                        @playing="playingHandler"
                        @dblclick="fullscreen"
                        @loadedmetadata="loadDuration"
                        :controls="user.id && room.owner.id == user.id">
                        <source :src="room.source" type="video/mp4">
                    </video>
                    <div class="controls" ref="controls">
                        <div class="timer">
                            <div class="back"></div>
                            <div class="bar"
                                :style="{
                                    width: (duration > 0 ? current / duration : 0) * 100 + '%'
                                }"></div>
                            <div class="hov" :style="{ width: hovSeek * 100 + '%' }"></div>
                            <div class="padding" v-if="user.id && room.owner.id == user.id" @click.stop="seekHandler" @mouseleave="setHoverLeave" @mousemove="setHoverSeek"></div>
                        </div>
                        <div class="buttons-row">
                            <button class="play" data-icon="P" aria-label="play pause toggle" v-if="user.id && room.owner.id == user.id" @click.stop="playPause">
                                <img v-if="paused" src="~assets/pl.svg" />
                                <img v-else src="~assets/pa.svg" />
                            </button>
                            <div class="volume">
                                <div class="back"></div>
                                <div class="bar" :style="{width: volume * 100 + '%'}"></div>
                                <div class="hov" :style="{width: hovVol * 100 + '%'}"></div>
                                <div class="padding" @click="volHandler" @mousemove="hoverVolume" @mouseleave="hoverLeaveVolume"></div>
                            </div>
                            <span aria-label="timer" ref="timer">{{currentSeek}} / {{durationText}}</span>
                            <button class="fullscreen" @click.stop="fullscreen" title="Fullscreen"><img src="~assets/fs.svg" /></button>
                        </div>
                    </div>
                </div>
                <h5>{{room.owner.username}}#{{room.owner.discriminator}}'s room {{privateText}}</h5>
                <span>Room link: <u class="copy-link" @click="copyLink" title="Copy room link">{{roomUrl}}</u></span>
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
    watch: {
        paused(p) {
            if (!p) {
                document.querySelector('body').classList.add('playing')
            } else {
                document.querySelector('body').classList.remove('playing')
            }
        },
        volume(v) {
            this.$refs.video.volume = v
        }
    },
    data() {
        return {
            paused: true,
            hours: false,
            duration: 0,
            volume: 1,
            current: 0,
            hovSeek: 0,
            hovVol: 0,
            currentSeek: "00:00",
            message: "",
            users: this.$store.state.room.users,
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
        roomUrl() {
            return process.env.hostProtocol + "://" + process.env.hostUrl.replace(/[\/]+$/g, '') + '/room/' + this.room.id
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
                navigator.clipboard.writeText(this.roomUrl)
                alert('Copied to clipboard!')
            }
        },
        playPause() {
            if (!this.$refs.video || (this.user.id && this.room.owner.id != this.user.id) || this.ws.readyState !== 1)
                return
            if (this.$refs.video.paused) {
                this.$refs.video.play()
                this.ws.send(JSON.stringify({type: 'play-pause', value: 'play', current: this.current}))
            } else {
                this.$refs.video.pause()
                this.ws.send(JSON.stringify({type: 'play-pause', value: 'pause', current: this.current}))
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
    
                //let barLength = this.$refs.timerWrapper.clientWidth * (media.currentTime/media.duration);
                this.current = media.currentTime;
                //this.$refs.timerBar.style.width = barLength + 'px';
            }
        },
        setHoverSeek(e) {
            let rect = e.target.getBoundingClientRect()
            this.hovSeek = (e.clientX - rect.x) / rect.width
        },
        setHoverLeave() {
            this.hovSeek = 0
        },
        seekHandler(e) {
            let rect = e.target.getBoundingClientRect()
            let seekPercent = (e.clientX - rect.x) / rect.width
            if (this.ws.readyState !== 1) return
            this.ws.send(JSON.stringify({type: 'seek', value: seekPercent * this.duration}))
            this.seekTo(seekPercent * this.duration)
        },
        hoverVolume(e) {
            let rect = e.target.getBoundingClientRect()
            this.hovVol = (e.clientX - rect.x) / rect.width
        },
        hoverLeaveVolume() {
            this.hovVol = 0
        },
        volHandler(e) {
            this.volume = this.hovVol
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
                this.ws.send(JSON.stringify({type: 'message', message: this.message.trim(), user: this.user}))
                this.message = ""
            }
        },
        seekTo(time) {
            if (!this.$refs.video) return
            this.$refs.video.currentTime = time
        }
    },
    mounted() {
        if (this.$refs.video) {
            this.$refs.video.removeAttribute('controls');
            if (this.$refs.video.duration > 0) {
                this.duration = this.$refs.video.duration
            }
            this.seekTo((this.room.seek / 1000) || 0)
            if (this.$store.state.room.state == 'PAUSED') this.$refs.video.pause()
        }
        let _vm = this;
        let ws = undefined;
        function connectWS() {
            ws = new WebSocket(`${process.env.hostProtocol == 'https' ? 'wss' : 'ws'}://${process.env.hostUrl}?r=${_vm.$route.params.room}`);
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
                switch(data.type) {
                    case 'message':
                        _vm.chat.push(data);
                        break;
                    case 'connect':
                        if (!_vm.users.includes(data.user))
                            _vm.users.push(data.user);
                        break;
                    case 'play-pause':
                        if (data.value == 'play') _vm.$refs.video.play();
                        else _vm.$refs.video.pause()
                        _vm.seekTo(data.current)
                        break;
                    case 'seek':
                        _vm.seekTo(data.value)
                        break;
                }
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
    align-items: flex-start;

    & > .video-container {
        width: 60%;
        cursor: default;
        user-select: none;

        & > .player {
            position: relative;
            transition: opacity .23s ease-out;
        
            & > video {
                position: relative;
                display: block;
                width: 100%;
                background: var(--theme-color);
                box-shadow: 5px 6px 18px 2px rgba(6, 2, 4, 0.33);

                &::-webkit-media-controls-enclosure {
                    display: none !important;
                }
            }

            & > .controls {
                box-sizing: border-box;
                visibility: visible;
                opacity: 0;
                width: 100%;
                position: absolute;
                bottom: 0;
                left: 0;
                background-color: rgba(6, 2, 4, 0.33);
                transition: all .23s;
                display: flex;

                & > .timer {
                    width: calc(100% - 20px);
                    margin: 0 10px;
                    font-size: 10px;
                    color: white;
                    flex: 5;
                    position: absolute;
                    left: 0;
                    bottom: 32px;
                    height: 20px;
                    transform: translateY(20px);
                    opacity: 0;
                    transition: transform .22s ease-out, opacity .18s ease-out;
                }

                & > .buttons-row {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 40px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-wrap: nowrap;
                    padding: 0 10px;

                    & > button {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        height: 28px;
                        width: 28px;
                        padding: 4px;
                        margin: 0;

                        & > img {
                            height: 22px;
                            width: 22px;
                        }

                        &.play {
                            margin-right: 8px;
                        }
                    }

                    & > span {
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 3;
                        display: flex;
                        flex-direction: row;
                        white-space: nowrap;
                        color: white;
                        margin: 0 8px;
                        flex: 1;
                        text-shadow: 1px 1px 1px rgba(32, 25, 27, 0.445);
                    }
                }
            }

            &:hover > .controls,
            &:focus > .controls {
                opacity: 1;

                & > .timer {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        }
    }

    & > .chat-container {
        display: flex;
        flex-direction: column;
        width: 30%;
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
            background: var(--background-color);
            font-size: 14px;
            min-height: 70vh;
            max-height: 70vh;
            overflow-y: auto;

            & > div {
                padding: 12px 8px;

                & > strong {
                    color: #614a4f;
                    padding: 2px;
                    margin-right: 6px;
                    font-size: 10px;

                    &.me {
                        color: #742536;
                    }

                    &.owner {
                        color: #df465f !important;
                    }
                }

                &:nth-child(2n) {
                    background: rgba(75, 5, 25, 0.178);
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

.timer > div,
.volume > div {
    cursor: pointer;
    position: absolute;
    left: 0;
    width: 0;
    height: 12px;
    z-index: 2;

    &.back {
        background-color: rgba(54, 41, 43, 0.452);
        width: 100%;
    }

    &.hov {
        background-color: rgba(32, 25, 27, 0.445);
    }

    &.bar {
        background-color: var(--theme-color);
    }

    &.padding {
        width: 100%;
        padding: 8px 0 6px;
    }
}

.volume {
    position: relative;
    height: 12px;
    width: 100px;
    max-width: 100px;
}

.playing video,
.playing .chat-container {
    box-shadow: 5px 6px 18px 2px rgba(66, 18, 42, 0.33) !important;
}

.playing .chat-items {
    background: rgba(218, 199, 204, 0.705) !important;
}

.copy-link {
    cursor: pointer;
}
</style>

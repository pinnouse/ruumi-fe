<template>
    <div>
        <button type="submit" @click="leaveRoom">Leave</button>
        <div v-if="!room || room.id !== $route.params.room">
            <h2>No room found</h2>
        </div>
        <template v-else>
            <div class="video-container">
                <h1>{{room.title}}</h1>
                <h3>Episode {{room.episode}}</h3>
                <div class="player">
                    <video ref="video" @click="playPause" @timeupdate="setTime" @dblclick="fullscreen" controls>
                        <source :src="room.source" type="video/mp4">
                    </video>
                    <div class="controls" ref="controls">
                        <button class="play" data-icon="P" aria-label="play pause toggle" @click="playPause"></button>
                        <div class="timer" ref="timerWrapper">
                            <div ref="timerBar"></div>
                            <span aira-label="timer" ref="timer">00:00</span>
                        </div>
                    </div>
                </div>
                <h4>{{room.owner.name}}'s room</h4>
                <span>Room link: <u class="copy-link" @click="copyLink">https://ruumi.net/room/{{room.id}}</u></span>
            </div>
        </template>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    async asyncData({store, params}) {
        return await store.dispatch('getRoom', params.room)
    },
    computed: {
        room() {
            return this.$store.state.room
        }
    },
    methods: {
        leaveRoom() {
            window.location.href = '../';
            if (this.room && this.room.owner && this.room.owner.id == this.$store.state.user.id) {
                axios.post('http://localhost:3000/delRoom', {
                    data: {
                        roomId: this.room.id,
                        userId: this.$store.state.user.id
                    }
                })
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
                let minutes = Math.floor(media.currentTime / 60);
                let seconds = Math.floor(media.currentTime - minutes * 60);
                let minuteValue;
                let secondValue;
    
                if (minutes < 10) {
                    minuteValue = '0' + minutes;
                } else {
                    minuteValue = minutes;
                }
    
                if (seconds < 10) {
                    secondValue = '0' + seconds;
                } else {
                    secondValue = seconds;
                }
    
                let mediaTime = minuteValue + ':' + secondValue;
                this.$refs.timer.textContent = mediaTime;
    
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
        }
    },
    mounted() {
        if (this.room && this.room.id == this.$route.params.room) {
            this.$refs.video.removeAttribute('controls');
            this.$refs.controls.style.visibility = 'visible';
            console.log(this.$refs.video)
        }
    }
}
</script>

<style lang="scss">
.video-container {
    width: 60%;
}
.player {
    position: relative;

    & > video {
        display: block;
        width: 100%;
    }
}

.controls {
    visibility: hidden;
    opacity: 0;
    width: 100%;
    position: absolute;
    bottom: 6px;
    left: 0;
    background-color: black;
    transition: .6s all;
    display: flex;
}

.timer {
    line-height: 38px;
    height: 38px;
    font-size: 10px;
    font-family: monospace;
    text-shadow: 1px 1px 0px black;
    color: white;
    flex: 5;
    position: relative;
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
    position: absolute;
    z-index: 3;
    left: 19px;
}

.player:hover .controls, .player:focus .controls {
    opacity: 1;
}

.copy-link {
    cursor: pointer;
}
</style>
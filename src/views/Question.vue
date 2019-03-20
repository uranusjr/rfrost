<template>

<div class="page-content">

	<h1 class="title">{{ helpText }}</h1>

	<hr>

	<div class="content">

		<div class="icon" v-if="!beginTimes.length" v-on:click="play()">
			<span class="fa fa-5x fa-play-circle"></span>
		</div>

		<h2 class="subtitle">{{ playing ? question.text : '' }}</h2>

		<form v-if="beginTimes.length" v-on:submit.prevent="submit">
			<button type="submit" v-on:click="score = 3">完全可能</button>
			<button type="submit" v-on:click="score = 2">有些可能</button>
			<button type="submit" v-on:click="score = 1">有些不可能</button>
			<button type="submit" v-on:click="score = 0">完全不可能</button>
		</form>

	</div>

</div>

</template>


<script>

import {DateTime} from 'luxon'

export default {
	props: ['question'],
	data() {
		this.watchAudio()
		return {
			beginTimes: [],
			playing: false,
			score: -1,
		}
	},
	computed: {
		helpText() {
			if (this.beginTimes.length) {
				return '選擇對題目敘述的感受'
			}
			return '點擊按鈕播放題目'
		},
	},
	watch: {
		question() {
			this.beginTimes = []
			this.playing = false
			if (this.question.audio) {
				this.watchAudio()
			}
		},
	},
	methods: {
		watchAudio() {
			this.question.audio.addEventListener('play', () => {
				this.playing = true
			})
			this.question.audio.addEventListener('pause', () => {
				this.playing = false
			})
		},
		play() {
			if (this.playing) {
				return
			}
			this.beginTimes.push(DateTime.local())
			this.question.audio.currentTime = 0
			this.question.audio.play().catch(() => {})
		},
		submit() {
			if (!this.beginTimes.length) {
				return
			}
			this.$store.dispatch('SESSION_SET_ANSWER', {
				question: this.question,
				score: this.score,
				diff: -this.beginTimes[0].diffNow(),
			})
			this.$router.push({name: 'session-next-page'})
		},
	},
	beforeRouteLeave(to, from, next) {
		this.question.audio.pause()
		next()
	},
}

</script>


<style lang="scss" scoped>

@import '~@/styles/variables';

.title {
	text-align: center;
}
.icon {
	display: block;
	width: 100%;
	font-size: 200%;
	cursor: pointer;
	text-align: center;

	&:hover {
		opacity: 0.75;
	}
}
.content {
	margin-top: 4px;

	.subtitle {
		height: 2rem;
		margin-top: 3rem;
		text-align: center;
		font-size: 240%;
	}

	form {
		display: flex;
		justify-content: center;
		margin-top: 4rem;

		button[type="submit"] {
			flex: 0 12rem;
			font-size: 24px;
			margin: auto 1.5rem;
			padding: 0.5rem;
			border: 1px solid $grey-light;
			border-radius: 0.75rem;

			&:focus {
				outline: none;
			}

			&:hover {
				cursor: pointer;
				background: $grey-lighter;
			}
		}
	}
}

</style>

<template>

<div class="page-content">

	<h1 class="title">{{ helpText }}</h1>

	<hr>

	<div class="content">

		<div class="icon" v-if="!beginTimes.length" v-on:click="play()">
			<span class="fa fa-5x fa-play-circle"></span>
		</div>

		<h2 class="subtitle">{{ playing ? question.text : '' }}</h2>

		<form v-if="!playing && beginTimes.length" v-on:submit.prevent="submit">
			<button type="submit" v-on:click="setScore(0)">👎👎</button>
			<button type="submit" v-on:click="setScore(1)">&nbsp;👎&nbsp;</button>
			<button type="submit" v-on:click="setScore(2)">&nbsp;👍&nbsp;</button>
			<button type="submit" v-on:click="setScore(3)">👍👍</button>
		</form>

	</div>

</div>

</template>


<script>

import {DateTime} from 'luxon'

export default {
	props: ['nextName', 'question'],
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
				setTimeout(() => {
					this.beginTimes.push(DateTime.local())
					this.playing = false
				}, 250)
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
		setScore(index) {
			if (this.question.order < 0) {
				this.score = 3 - index
			} else {
				this.score = index
			}
		},
		submit() {
			const index = this.beginTimes.length - 1
			if (index < 0) {
				return
			}
			this.$store.dispatch('SESSION_SET_ANSWER', {
				question: this.question,
				score: this.score,
				diff: -this.beginTimes[index].diffNow(),
			})
			this.$router.push({name: this.nextName})
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
			margin: auto 1rem;
			padding: 0.5rem;
			border: 1px solid $grey-light;
			border-radius: 0.75rem;
			background: $white;

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

<template>

<div class="page-content">

	<h1 class="title">
		<span>{{ helpText }}</span>
		<span v-bind:class="['icon', playing ? 'is-small' : '']"
				v-bind:disabled="playing" v-on:click="play()">
			<span v-bind:class="playIconClasses"></span>
		</span>
	</h1>

	<hr>

	<div class="content" v-if="beginTimes.length !== 0">
		<h2 class="subtitle">{{ question.text }}</h2>
		<form v-on:submit.prevent="submit">
			<button type="submit" v-on:click="score = 3">
				完全可能
			</button>
			<button type="submit" v-on:click="score = 2">
				有些可能
			</button>
			<button type="submit" v-on:click="score = 1">
				有些不可能
			</button>
			<button type="submit" v-on:click="score = 0">
				完全不可能
			</button>
		</form>
	</div>

</div>

</template>


<script>

import _ from 'lodash'
import {DateTime} from 'luxon'

export default {
	props: ['question'],
	data() {
		this.watchAudio()
		return {
			playing: false,
			beginTimes: [],
			score: -1,
		}
	},
	computed: {
		playIconClasses() {
			const cls = ['fa']
			if (this.playing) {
				cls.push('fa-circle-o-notch', 'fa-spin')
			} else {
				cls.push('fa-play-circle')
			}
			return cls
		},
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
			this.question.audio.play().catch(() => {})
		},
		submit() {
			this.$store.dispatch('SESSION_SET_ANSWER', {
				question: this.question,
				score: this.score,
				msDiffs: _.map(this.beginTimes, t => -t.diffNow().valueOf()),
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
	> *:not(:last-child) {
		margin-right: 1rem;
	}
	.icon {
		font-size: 90%;
		cursor: pointer;

		&:hover {
			opacity: 0.75;
		}
		&.is-small {
			font-size: 70%;
			padding-left: 8px;
			vertical-align: 2px;
		}
		&[disabled], &[disabled]:hover {
			cursor: wait;
			opacity: 0.5;
		}
	}
}
.content {
	margin-top: 4px;

	.subtitle {
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

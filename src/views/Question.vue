<template>

<div class="page-content">

	<h1 class="title">
		<span>
			第 {{ questionIndex + 1 }} 題：{{ helpText }}
		</span>
		<span v-bind:class="['icon', playing ? 'is-small' : '']"
				v-bind:disabled="playing" v-on:click="play()">
			<span v-bind:class="playIconClasses"></span>
		</span>
	</h1>

	<hr>

	<div class="content" v-if="beginTimes.length !== 0">
		<h2 class="subtitle">{{ question.text }}</h2>
		<form>
			<button type="submit" name="value" value="1">

			</button>
		</form>
	</div>

</div>

</template>


<script>

import _ from 'lodash'
import {DateTime} from 'luxon'

export default {
	props: ['groupIndex', 'questionIndex', 'question', 'next'],
	data() {
		return {
			audio: this.createAudio(this.question),
			playing: false,
			beginTimes: [],
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
			this.audio.pause()
			this.audio = this.createAudio(this.question)
		},
		audio() {
			this.beginTimes = []
			this.playing = false
		},
	},
	methods: {
		createAudio(q) {
			const audio = new Audio(q.audio)
			audio.addEventListener('play', () => {
				this.playing = true
			})
			audio.addEventListener('pause', () => {
				this.playing = false
			})
			return audio
		},
		play() {
			if (this.playing) {
				return
			}
			this.beginTimes.push(DateTime.local())
			this.audio.play()
		},
		choose(value) {
			this.$store.dispatch('SESSION_SET_ANSWER', {
				questionIndex: this.questionIndex,
				value: value,
				msDiffs: _.map(this.beginTimes, t => -t.diffNow().valueOf()),
			})
			this.$router.push(this.next)
		},
	},
	beforeRouteLeave(to, from, next) {
		this.audio.pause()
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
		text-align: center;
	}
}

</style>

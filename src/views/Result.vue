<template>

<main class="page-content">

	<h1 class="title">結果</h1>

	<div v-if="erroredAnswers">

		<p class="field">答題結果儲存失敗！請手動紀錄以下結果。</p>

		<table class="table is-fullwidth">
			<thead>
				<tr>
					<th class="is-nowrap">題目</th>
					<th class="is-nowrap">選擇</th>
					<th class="is-nowrap">用時</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="answer in erroredAnswers">
					<th>{{ answer.question.text }}</th>
					<td>{{ answer.score }}</td>
					<td>{{ (answer.diff.valueOf() / 1000.0).toFixed(3) }} 秒</td>
				</tr>
			</tbody>
		</table>

		<div class="field is-grouped">
			<div class="control">
				<router-link class="button is-large is-danger"
						v-bind:to="{name: 'home'}">
					關閉
				</router-link>
			</div>
		</div>

	</div>

	<form v-else v-on:submit.prevent="saveResult">

		<p class="field">感謝作答。請按「儲存」結束答題。</p>

		<div class="field is-grouped">
			<div class="control">
				<button type="submit" v-bind:class="submitClass">儲存</button>
			</div>
		</div>

	</form>

</main>

</template>


<script>

export default {
	data() {
		return {
			erroredAnswers: [],
			saving: false,
		}
	},
	computed: {
		submitClass() {
			return {
				'button': true,
				'is-large': true,
				'is-primary': true,
				'is-loading': this.saving,
			}
		},
	},
	methods: {
		saveResult() {
			this.saving = true
			const result = {
				subject: this.$store.state.session.subjectName,
				answers: this.$store.state.session.answers,
			}
			this.$store.dispatch('PROJECT_SAVE_RESULT', {result}).then(
				() => {
					this.saving = false
					this.$router.push({name: 'home'})
				},
				(err) => {
					this.erroredAnswers = result.answers,
					this.saving = false
				},
			)
		},
	},
	beforeRouteLeave(to, from, next) {
		this.erroredAnswers = []
	},
}

</script>

<style lang="scss" scoped>
.table {
	margin: auto;

	th, td {
		padding: 0.75rem 2rem;
		vertical-align: middle;
		text-align: center;
	}
}
</style>

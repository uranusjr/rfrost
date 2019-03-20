<template>

<main class="page-content">

	<h1 class="title">結果</h1>

	<form v-on:submit.prevent="saveResult">

		<p class="field">
			感謝作答。請按「儲存」結束答題。
		</p>

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
					// TODO: Show results here to manually record :(
					this.saving = false
				},
			)
		},
	},
}

</script>

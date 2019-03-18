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
		console.log(this.$store.state.session.answers)
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
			this.$store.dispatch('PROJECT_SAVE_RESULT', this.result).then(() => {
				this.saving = false
				this.$router.push({name: 'home'})
			}).catch(e => {
				console.error(e)
				this.saving = false
			})
		},
	},
}

</script>

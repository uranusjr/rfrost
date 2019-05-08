<template>

<div class="index-page">

	<form v-on:submit.prevent="beginExamples">
		<div class="field is-grouped">
			<div class="control">
				<button v-if="!hasProject" v-on:click="chooseProjectDirectory"
						type="button" class="button is-large is-primary">
					選擇專案目錄
				</button>
				<button v-if="hasProject" v-bind:class="submitClass"  type="submit">
					開始練習題
				</button>
			</div>
		</div>
	</form>

</div>

</template>


<script>

import {ipcRenderer} from 'electron'
import _ from 'lodash'

export default {
	data() {
		return {
			loading: false,
		}
	},
	computed: {
		submitClass() {
			return {
				'button': true,
				'is-primary': true,
				'is-large': true,
				'is-loading': this.loading,
			}
		},
		hasProject() {
			return this.$store.getters.projectLoaded
		},
	},
	methods: {
		chooseProjectDirectory() {
			const projectData = ipcRenderer.sendSync('select-project')
			if (projectData) {
				this.$store.dispatch('PROJECT_LOAD_FROM_FILESYSTEM', projectData)
			}
		},
		beginExamples() {
			this.loading = true
			const data = {
				subjectName: '',
				questions: _.values(this.$store.state.project.examples),
			}
			this.$store.dispatch('SESSION_POPULATE', data).then(() => {
				this.loading = false
				this.$router.push({'name': 'example-next-page'})
			})
		},
	},
	created() {
		if (!this.hasProject) {
			this.chooseProjectDirectory()
		}
	},
}

</script>


<style lang="scss" scoped>

.index-page {
	width: 100%;
	height: 100vh;

	display: flex;
	align-items: center;
	justify-content: center;

	form {
		padding-bottom: 10vh;	// Add padding for visual compensation.

		> .field {
			margin-top: 2rem;
			margin-bottom: 2rem;
			justify-content: center;
		}
	}
}

</style>

<template>

<div class="index-page">

	<form v-if="!hasProject">
		<div class="field is-grouped">
			<div class="control">
				<button type="button" class="button is-large is-primary"
						v-on:click="chooseProjectDirectory">
					選擇專案目錄
				</button>
			</div>
		</div>
	</form>

	<form v-else v-on:submit.prevent="beginSession">

		<div class="field is-horizontal">
			<div class="field-label">
				<label class="label" for="id_subject_name">受試代號</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control is-expanded">
						<input class="input" type="text" id="id_subject_name"
								v-model="subjectName">
					</div>
				</div>
			</div>
		</div>

		<div class="field is-grouped">
			<div class="control is-expanded">
				<button type="submit"
						v-bind:class="submitClass" v-bind:disabled="!subjectName">
					開始作答
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
			subjectName: '',
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
		beginSession() {
			this.loading = true
			const data = {
				subjectName: this.subjectName,
				questions: _.shuffle(this.$store.state.project.questions),
			}
			this.$store.dispatch('SESSION_POPULATE', data).then(() => {
				this.loading = false
				this.$router.push({name: 'session-next-page'})
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

			.is-expanded > .button {
				width: 100%;
			}
		}

		.field-label {
			flex-grow: 0;
			white-space: nowrap;

			label {
				line-height: 225%;
			}
		}
	}
}

</style>

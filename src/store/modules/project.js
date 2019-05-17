import {ipcRenderer} from 'electron'
import _ from 'lodash'

import {Question} from '@/models'

const state = {
	source: null,
	examples: {},
	questions: {},
	questionIndexes: {},
}

const getters = {
	projectLoaded(state) {
		return !!state.source
	},
}

const mutations = {
	PROJECT_LOAD_FROM_FILESYSTEM(state, {source, examples, questions}) {
		state.source = source
		state.examples = {}
		state.questions = {}
		state.questionIndexes = {}
		for (const d of examples) {
			state.examples[d.text] = new Question(d)
		}
		for (const [i, d] of questions.entries()) {
			state.questions[d.text] = new Question(d)
			state.questionIndexes[d.text] = i
		}
	},
	PROJECT_SAVE_RESULT(state, {data, cb}) {
		const result = {
			subject: data.result.subject,
			answers: _.map(data.result.answers, (a) => {
				return {
					question: a.question.text,
					score: a.score,
					time: a.diff.valueOf() / 1000.0,
				}
			})
		}
		ipcRenderer.once('save-result-done', (evt, err) => { cb(err) })
		ipcRenderer.send('save-result', {result: result, source: state.source})
	},
}

const actions = {
	PROJECT_LOAD_FROM_FILESYSTEM({commit}, data) {
		commit('PROJECT_LOAD_FROM_FILESYSTEM', data)
	},
	PROJECT_SAVE_RESULT({commit}, data) {
		return new Promise((resolve, reject) => {
			const cb = e => {
				if (e) {
					reject(e)
				} else {
					resolve()
				}
			}
			commit('PROJECT_SAVE_RESULT', {data, cb})
		})
	},
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}

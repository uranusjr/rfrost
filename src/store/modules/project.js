import {Question} from '@/models'

const state = {
	root: null,
	source: null,
	questions: {},
	results: {},
}

const getters = {
	projectLoaded(state) {
		return !!state.source
	},
}

const mutations = {
	PROJECT_LOAD_FROM_FILESYSTEM(state, data) {
		state.root = data.root
		state.source = data.source
		state.questions = {}
		for (const d of data.questions) {
			state.questions[d.text] = new Question(d)
		}
		state.results = {}
	},
}

const actions = {
	PROJECT_LOAD_FROM_FILESYSTEM({commit}, data) {
		commit('PROJECT_LOAD_FROM_FILESYSTEM', data)
	},
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}

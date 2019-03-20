import {Answer} from '@/models'

const state = {
	subjectName: '',
	questions: [],
	answers: [],
}

const getters = {}

const mutations = {
	SESSION_POPULATE(state, {subjectName, questions}) {
		state.subjectName = subjectName
		state.questions = questions
		state.answers = []
	},
	SESSION_SET_ANSWER(state, {question, score, diff}) {
		state.answers.push(new Answer({question, score, diff}))
	},
}

const actions = {
	SESSION_POPULATE({commit}, data) {
		return new Promise((resolve, reject) => {
			commit('SESSION_POPULATE', data)
			resolve()
		})
	},
	SESSION_SET_ANSWER({commit}, data) {
		commit('SESSION_SET_ANSWER', data)
	},
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}

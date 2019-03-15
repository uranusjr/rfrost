const state = {
	subjectName: '',
	questions: [],
}

const getters = {}

const mutations = {
	SESSION_POPULATE(state, {subjectName, questions}) {
		state.subjectName = subjectName
		state.questions = questions
	}
}

const actions = {
	SESSION_POPULATE({commit}, data) {
		return new Promise((resolve, reject) => {
			commit('SESSION_POPULATE', data)
			resolve()
		})
	}
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}

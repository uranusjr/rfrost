import {Answer} from '@/models'

const state = {
	subjectName: '',
	questions: [],
	answers: [
		new Answer({
			question: {text: '中國餐廳的菜比日本餐廳的菜好吃'},
			score: 1,
			msDiffs: [],
		}),
		new Answer({
			question: {text: '今天妹妹被動物園的獅子嚇得大哭'},
			score: 1,
			msDiffs: [],
		}),
	],
}

const getters = {}

const mutations = {
	SESSION_POPULATE(state, {subjectName, questions}) {
		state.subjectName = subjectName
		state.questions = questions
		state.answers = []
	},
	SESSION_SET_ANSWER(state, {question, score, msDiffs}) {
		state.answers.push(new Answer({question, score, msDiffs}))
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

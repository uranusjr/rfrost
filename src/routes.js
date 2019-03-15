import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'

import Home from './views/Home.vue'
import Question from './views/Question.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/session/',
			name: 'home',
			component: Home,
		},
		{
			path: '/session/:questionIndex',
			name: 'question',
			component: Question,
			props: route => {
				const questionIndex = parseInt(route.params.questionIndex)
				const questions = store.state.session.questions

				let next = {name: 'session-result'}
				if (questionIndex < questions.length - 1) {
					next = {name: 'question', params: {questionIndex: questionIndex + 1}}
				}
				return {
					questionIndex: questionIndex,
					question: questions[questionIndex],
					next: next,
				}
			},
		},
		{
			path: '*',
			redirect: {name: 'home'},
		},
	],
})

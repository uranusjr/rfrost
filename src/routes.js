import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'

import Home from './views/Home.vue'
import Question from './views/Question.vue'
import Result from './views/Result.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/session/',
			name: 'home',
			component: Home,
		},
		{
			path: '/session/next/',
			name: 'session-next-page',
			beforeEnter: (to, fm, next) => {
				const index = store.state.session.answers.length
				if (index < store.state.session.questions.length) {
					next({name: 'question', params: {index: index}})
				} else {
					next({name: 'session-result'})
				}
			},
		},
		{
			path: '/session/question/:index',
			name: 'question',
			component: Question,
			props: route => {
				const questions = store.state.session.questions
				return {question: questions[parseInt(route.params.index)]}
			},
		},
		{
			path: '/session/result/',
			name: 'session-result',
			component: Result,
		},
		{
			path: '*',
			redirect: {name: 'home'},
			// redirect: {name: 'session-next-page'},
		},
	],
})

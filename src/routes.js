import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'

import Home from './views/Home.vue'
import Question from './views/Question.vue'
import Result from './views/Result.vue'
import Session from './views/Session.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/example/next/',
			name: 'example-next-page',
			beforeEnter: (to, fm, next) => {
				const index = store.state.session.answers.length
				if (index < store.state.session.questions.length) {
					next({name: 'example', params: {index}})
				} else {
					next({name: 'session'})
				}
			},
		},
		{
			path: '/example/question/:index',
			name: 'example',
			component: Question,
			props: route => {
				const questions = store.state.session.questions
				return {
					nextName: 'example-next-page',
					question: questions[parseInt(route.params.index)],
				}
			},
		},
		{
			path: '/session/',
			name: 'session',
			component: Session,
		},
		{
			path: '/session/next/',
			name: 'session-next-page',
			beforeEnter: (to, fm, next) => {
				const index = store.state.session.answers.length
				if (index < store.state.session.questions.length) {
					next({name: 'question', params: {index}})
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
				return {
					nextName: 'session-next-page',
					question: questions[parseInt(route.params.index)],
				}
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
		},
	],
})

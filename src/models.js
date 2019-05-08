export class Question {
	constructor(opts) {
		this.text = opts.text
		this.order = opts.order
		this.audio = new Audio(opts.audio)
	}
}

export class Answer {
	constructor(opts) {
		this.question = opts.question
		this.score = opts.score
		this.diff = opts.diff
	}
}

export default {
	Question,
	Answer,
}

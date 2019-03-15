export class Question {
	constructor(opts) {
		this.text = opts.text
		this.audio = opts.audio
	}
}

export class Answer {
	constructor(opts) {
		this.question = opts.question
		this.score = opts.score
		this.msDiffs = opts.msDiffs
	}
}

export default {
	Question,
	Answer,
}

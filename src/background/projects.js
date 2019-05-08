import fs from 'fs'
import path from 'path'
import process from 'process'

import {dialog} from 'electron'

import {workbook, workbookSync} from './xlsx'


let projectRootServer = null

function getProjectRoot(rootDir) {
	// Simply use the file protocol in production mode.
	if (process.env.NODE_ENV === 'production') {
		return `file://${rootDir}`
	}

	// In dev mode, spin up an HTTP server to serve the project files.
	if (projectRootServer) {
		projectRootServer.close()
	}
	const serve = require('serve-static')(rootDir)
	const finalhandler = require('finalhandler')
	projectRootServer = require('http').createServer((request, response) => {
		serve(request, response, finalhandler(request, response))
	})
	projectRootServer.listen(8888)
	return 'http://localhost:8888'
}

const AUDIO_EXTENSION = '.m4a'

function createProject(source) {
	const rootDir = path.dirname(source)
	const rootUrl = getProjectRoot(rootDir)
	const ws = workbookSync(source).getSheet('問題列表')

	const questions = []
	for (let r = 0; ; r++) {
		const tCell = ws.getCell({r, c: 0})
		const fCell = ws.getCell({r, c: 1})
		if (!tCell && !fCell) {
			break
		} else if (!tCell || !fCell) {
			continue
		}
		let file = fCell.v.toString()

		// If extension does not match, try to derive it from filesystem state.
		if (path.extname(file).toLowerCase() !== AUDIO_EXTENSION) {
			file = `${file}${AUDIO_EXTENSION}`
			if (!fs.existsSync(path.join(rootDir, file))) {
				continue
			}
		}

		const oCell = ws.getCell({r, c: 2})
		const order = oCell ? Number(oCell.v) : 1

		questions.push({
			text: tCell.v,
			audio: `${rootUrl}/${file}`,
			order: order < 0 ? -1 : 1,
		})
	}

	return {source, questions}
}

export function selectProject(browserWindow) {
	const selection = dialog.showOpenDialog(browserWindow, {
		filters: [{name: 'Microsoft Excel XML document', extensions: ['xlsx']}],
		properties: ['openFile'],
	})
	if (!selection || selection.length < 1) {
		return null
	}

	const p = selection[0]
	let project = null
	try {
		project = createProject(p)
		if (project.questions.length < 1) {
			throw new Error('找不到問題')
		}
	} catch (e) {
		e.selectedPath = p
	}
	return project
}

function saveValues(sheet, subject, answers, key) {
	// Build a mapping of existing question text and the row it's on.
	const questionRows = {}
	for (let r = 1; ; r++) {	// Skip the title row.
		const cell = sheet.getCell({r, c: 0})
		if (!cell) {
			break
		}
		questionRows[cell.v] = r
	}

	const addr = sheet.getNextAddress()
	const c = addr.c === 0 ? 1 : addr.c
	let nextRow = addr.r === 0 ? 1 : addr.r

	// Subject name.
	sheet.setCell({c, r: 0}, subject)

	// Insert values.
	for (const answer of answers) {
		const text = answer.question

		// Get the row this question is on, append one if it does not exist.
		let r = questionRows[text]
		if (r === undefined) {
			r = nextRow
			nextRow += 1
			sheet.setCell({c: 0, r}, text)
		}
		sheet.setCell({c, r}, answer[key])
	}
}

export function saveResult(source, {subject, answers}) {
	return workbook(source).then(workbook => {
		saveValues(workbook.getSheet('回答結果'), subject, answers, 'score')
		saveValues(workbook.getSheet('使用時間'), subject, answers, 'time')
		return workbook.save()
	})
}

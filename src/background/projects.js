import fs from 'fs'
import path from 'path'
import process from 'process'

import {dialog} from 'electron'


let projectRootServer = null

function getProjectRoot(p) {
	const rootDir = path.dirname(p)

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

function createProject(p) {
	const project = {
		source: p,
		root: getProjectRoot(p),
		questions: [],
	}
	for (const filename of fs.readdirSync(p)) {
		if (path.extname(filename).toLowerCase() !== '.m4a') {
			continue
		}
		project.questions.push({
			text: path.basename(filename, '.m4a'),
			audio: `${project.root}/${filename}`,
		})
	}
	return project
}

export function selectProject(browserWindow) {
	const selection = dialog.showOpenDialog(browserWindow, {
		properties: ['openDirectory'],
	})
	if (!selection || selection.length < 1) {
		return null
	}

	const p = selection[0]

	let project
	try {
		project = createProject(p)
		if (project.questions.length < 1) {
			throw new Error('找不到問題')
		}
	} catch (e) {
		dialog.showMessageBox(browserWindow, {
			type: 'error',
			title: '專案載入失敗',
			message: e.toString(),
			detail: `專案路徑：${p}`,
		})
	}

	return project
}

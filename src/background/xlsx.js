import fs from 'fs'

import xlsx from 'xlsx'

/** Parse the input into a ref (e.g. 'A1') and an address (e.g. {c: 1, r: 1}).
 *
 * Returns a 2-tuple of [ref, addr].
 */
function toRefAddr(at) {
	if (typeof at === 'string') {
		return [at, xlsx.utils.decode_cell(at)]
	}
	return [xlsx.utils.encode_cell(at), at]
}

function makeData(value) {
	if (typeof value === 'string')
		return {v: value, t: 's'}
	if (typeof value === 'number')
		return {v: value, t: 'n'}
	if (value === true || value === false)
		return {v: value, t: 'b'}
	if (value instanceof Date)
		return {v: value, t: 'd'}
	return value
}

// Does Excel have built-in restrictions?
const MAX_COL = Number.MAX_SAFE_INTEGER
const MAX_ROW = Number.MAX_SAFE_INTEGER

class Worksheet {
	constructor(ws) {
		this._ws = ws
	}

	getNextAddress() {
		const ref = this._ws['!ref']
		const end = ref ? xlsx.utils.decode_range(ref).e : {c: -1, r: -1}
		return {c: end.c + 1, r: end.r + 1}
	}

	_expandTo(addr) {
		const ref = this._ws['!ref']
		const pv = ref ? xlsx.utils.decode_range(ref) : {
			s: {c: MAX_COL, r: MAX_ROW}, e: {c: -1, r: -1},
		}

		const range = {
			s: {
				c: pv.s.c > addr.c ? addr.c : pv.s.c,
				r: pv.s.r > addr.r ? addr.r : pv.s.r,
			},
			e: {
				c: pv.e.c < addr.c ? addr.c : pv.e.c,
				r: pv.e.r < addr.r ? addr.r : pv.e.r,
			},
		}

		this._ws['!ref'] = xlsx.utils.encode_range(range)
	}

	setCell(at, value) {
		const [ref, addr] = toRefAddr(at)
		this._ws[ref] = makeData(value)
		this._expandTo(addr)
	}

	getCell(at) {
		const [ref,] = toRefAddr(at)
		return this._ws[ref]
	}
}

class Workbook {
	constructor(wb, filename) {
		this._wb = wb
		this._fn = filename
	}

	getSheet(name) {
		let ws = this._wb.Sheets[name]
		if (!ws) {
			ws = xlsx.utils.aoa_to_sheet([])
			this._wb.SheetNames.push(name)
			this._wb.Sheets[name] = ws
		}
		return new Worksheet(ws)
	}

	save() {
		return new Promise((resolve, reject) => {
			xlsx.writeFileAsync(this._fn, this._wb, err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}
}

export function workbook(filePath) {
	return new Promise((resolve, reject) => {
		fs.access(filePath, fs.constants.F_OK, err => {
			if (err) {
				resolve(new Workbook(xlsx.utils.book_new(), filePath))
				return
			}
			fs.readFile(filePath, (err, data) => {
				if (err) {
					reject(err)
				} else {
					const wb = xlsx.read(data, {type: 'buffer'})
					resolve(new Workbook(wb, filePath))
				}
			})
		})
	})
}

export function workbookSync(filePath) {
	try {
		fs.accessSync(filePath, fs.constants.F_OK)
	} catch (err) {
		return new Workbook(xlsx.utils.book_new(), filePath)
	}
	return new Workbook(xlsx.readFile(filePath), filePath)
}

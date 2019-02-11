const { removeSync } = require('fs-extra')
//const { open: openLevel } = require('../dist/storage/level')
const { open: openLmdb } = require('../dist/storage/lmdb')
//const { deflateSync, inflateSync } = require('zlib')
const { deflateSync, inflateSync } = require('snappy')
suite('performance', function() {
	removeSync('tests/db')

//	const level = openLevel('tests/db/test-level')
	const lmdb = openLmdb('tests/db/test-lmdb')
	suiteSetup(() => {
		lmdb.clear()
//		return level.clear()
	})

	let testString = 'test'
	for (let i = 0; i < 500; i++) {
		testString += 'some string data' + i
	}

/*	test('level-write', () => {
		for (let i = 0; i < 10000; i++) {
			level.putSync(Buffer.from((i % 1000).toString()), Buffer.from(testString + i))
		}
	})
	test('level-read', () => {
		for (let i = 0; i < 10000; i++) {
			level.getSync(Buffer.from((i % 1000).toString()))
		}
	})
	test('level-read-write', () => {
		for (let i = 0; i < 10000; i++) {
			level.putSync(Buffer.from((i % 1000).toString()), Buffer.from(testString + i))
			level.getSync(Buffer.from((i % 1000).toString()))
		}
	})
	test('level-batch', () => {
		let operations = []
		for (let i = 0; i < 10000; i++) {
			operations.push({
				type: 'put',
				key: Buffer.from((i % 1000).toString()),
				value: Buffer.from(testString + i)
			})
		}
		return level.batch(operations)
	})*/
	test('lmdb-write', () => {
		let last
		for (let i = 0; i < 10000; i++) {
			last= lmdb.put(Buffer.from((i % 1000).toString()), Buffer.from(testString + i))
		}
		return last
	})
	test('lmdb-read', () => {
		for (let i = 0; i < 10000; i++) {
			lmdb.get(Buffer.from((i % 1000).toString()))
		}
	})
	test.skip('lmdb-read-write', () => {
		for (let i = 0; i < 10000; i++) {
			lmdb.put(Buffer.from((i % 1000).toString()), Buffer.from(testString + i))
			lmdb.get(Buffer.from((i % 1000).toString()))
		}
	})
	test('lmdb-batch', function() {
		let start = Date.now()
		this.timeout(10000)
		let operations = []
		for (let i = 0; i < 10000; i++) {
			operations.push({
				type: 'put',
				key: Buffer.from((i % 1000).toString()),
				value: Buffer.from(testString + i)
			})
		}
		console.log('set up operations', Date.now() -start)
		let promise = lmdb.batch(operations)
		console.log('after batch', Date.now() -start)
		return promise.then(() => console.log('after commit', Date.now() -start))
	})
})

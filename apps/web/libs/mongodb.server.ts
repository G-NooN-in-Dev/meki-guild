import { type Db, MongoClient, type MongoClientOptions } from 'mongodb'

/**
 * MongoDB Atlas 연결 헬퍼 (서버 전용).
 * Vercel 연동으로 주입된 `MONGODB_URI`를 사용하며,
 * Next.js Hot Reload / 서버리스 재사용을 위해 전역에 클라이언트를 캐시합니다.
 */

const DEFAULT_DB_NAME = 'meki-guild'

const options = {
	// Vercel 서버리스에서 idle 연결이 길게 남지 않도록 제한
	maxIdleTimeMS: 10_000,
	appName: 'meki-guild-web'
} satisfies MongoClientOptions

declare global {
	// Hot Reload 시에도 연결 Promise를 하나만 유지하기 위한 전역 슬롯

	var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoUri(): string {
	const { MONGODB_URI: uri } = process.env

	if (!uri) {
		throw new Error('MONGODB_URI 환경 변수가 없습니다. apps/web/.env.local 또는 Vercel env를 확인하세요.')
	}

	return uri
}

function getDbName(): string {
	const { MONGODB_DB: dbName } = process.env
	return dbName ?? DEFAULT_DB_NAME
}

function getClientPromise(): Promise<MongoClient> {
	if (!globalThis._mongoClientPromise) {
		const client = new MongoClient(getMongoUri(), options)
		globalThis._mongoClientPromise = client.connect()
	}

	return globalThis._mongoClientPromise
}

/** MongoDB 클라이언트 (연결 Promise). 저수준 API가 필요할 때만 사용합니다. */
async function getMongoClient(): Promise<MongoClient> {
	return getClientPromise()
}

/** 앱에서 쓸 DB 핸들. 컬렉션 접근은 `db.collection('...')`로 이어갑니다. */
async function getDb(): Promise<Db> {
	const client = await getClientPromise()
	return client.db(getDbName())
}

export { getDb, getMongoClient }

import { MongoClient, Db, Collection } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // 开发环境：使用全局变量避免热重载时创建多个连接
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // 生产环境：创建新的客户端
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * 获取数据库实例
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db()
}

/**
 * 获取充电器集合
 */
export async function getChargersCollection(): Promise<Collection> {
  const db = await getDb()
  return db.collection('chargers')
}

/**
 * 关闭数据库连接（用于测试）
 */
export async function closeDb(): Promise<void> {
  const client = await clientPromise
  await client.close()
}

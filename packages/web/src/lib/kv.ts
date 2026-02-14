import { Redis } from '@vercel/kv'

/**
 * 充电器数据键前缀
 */
const CHARGER_KEY_PREFIX = 'charger:'
const CHARGERS_LIST_KEY = 'chargers:all'

/**
 * 获取 Redis 客户端
 * 支持 Vercel KV 和标准 Redis URL
 */
function getRedis() {
  // 优先使用 Vercel KV 的环境变量
  if (process.env.KV_REST_API_URL) {
    const { kv } = require('@vercel/kv')
    return kv
  }

  // 回退到标准 Redis URL
  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    throw new Error('Missing KV_REST_API_URL or REDIS_URL environment variable')
  }

  return new Redis(redisUrl)
}

/**
 * 获取所有充电器 ID 列表
 */
export async function getChargerIds(): Promise<string[]> {
  const redis = getRedis()
  const ids = await redis.get<string[]>(CHARGERS_LIST_KEY)
  return ids || []
}

/**
 * 获取单个充电器数据
 */
export async function getCharger(id: string) {
  const redis = getRedis()
  return await redis.get(`${CHARGER_KEY_PREFIX}${id}`)
}

/**
 * 获取所有充电器数据
 */
export async function getAllChargers(): Promise<any[]> {
  const ids = await getChargerIds()
  if (ids.length === 0) return []

  const chargers = await Promise.all(
    ids.map((id) => getCharger(id))
  )

  return chargers.filter((c) => c !== null)
}

/**
 * 设置单个充电器数据
 */
export async function setCharger(charger: any): Promise<void> {
  const redis = getRedis()
  await redis.set(`${CHARGER_KEY_PREFIX}${charger.id}`, charger)

  // 更新 ID 列表
  const ids = await getChargerIds()
  if (!ids.includes(charger.id)) {
    ids.push(charger.id)
    await redis.set(CHARGERS_LIST_KEY, ids)
  }
}

/**
 * 批量设置充电器数据
 */
export async function setChargers(chargers: any[]): Promise<void> {
  const redis = getRedis()
  const pipeline = redis.pipeline()

  const ids = chargers.map((c) => c.id)

  // 批量设置充电器数据
  for (const charger of chargers) {
    pipeline.set(`${CHARGER_KEY_PREFIX}${charger.id}`, charger)
  }

  // 更新 ID 列表
  pipeline.set(CHARGERS_LIST_KEY, ids)

  await pipeline.exec()
}

/**
 * 删除单个充电器
 */
export async function deleteCharger(id: string): Promise<void> {
  const redis = getRedis()
  await redis.del(`${CHARGER_KEY_PREFIX}${id}`)

  // 更新 ID 列表
  const ids = await getChargerIds()
  const newIds = ids.filter((i) => i !== id)
  await redis.set(CHARGERS_LIST_KEY, newIds)
}

/**
 * 清空所有充电器数据
 */
export async function clearAllChargers(): Promise<void> {
  const ids = await getChargerIds()

  if (ids.length > 0) {
    const redis = getRedis()
    const pipeline = redis.pipeline()
    for (const id of ids) {
      pipeline.del(`${CHARGER_KEY_PREFIX}${id}`)
    }
    pipeline.del(CHARGERS_LIST_KEY)
    await pipeline.exec()
  }
}

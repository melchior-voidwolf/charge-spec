import { kv } from '@vercel/kv'

/**
 * 充电器数据键前缀
 */
const CHARGER_KEY_PREFIX = 'charger:'
const CHARGERS_LIST_KEY = 'chargers:all'

/**
 * 获取所有充电器 ID 列表
 */
export async function getChargerIds(): Promise<string[]> {
  const ids = await kv.get<string[]>(CHARGERS_LIST_KEY)
  return ids || []
}

/**
 * 获取单个充电器数据
 */
export async function getCharger(id: string) {
  return await kv.get(`${CHARGER_KEY_PREFIX}${id}`)
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
  await kv.set(`${CHARGER_KEY_PREFIX}${charger.id}`, charger)

  // 更新 ID 列表
  const ids = await getChargerIds()
  if (!ids.includes(charger.id)) {
    ids.push(charger.id)
    await kv.set(CHARGERS_LIST_KEY, ids)
  }
}

/**
 * 批量设置充电器数据
 */
export async function setChargers(chargers: any[]): Promise<void> {
  const pipeline = kv.pipeline()

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
  await kv.del(`${CHARGER_KEY_PREFIX}${id}`)

  // 更新 ID 列表
  const ids = await getChargerIds()
  const newIds = ids.filter((i) => i !== id)
  await kv.set(CHARGERS_LIST_KEY, newIds)
}

/**
 * 清空所有充电器数据
 */
export async function clearAllChargers(): Promise<void> {
  const ids = await getChargerIds()

  if (ids.length > 0) {
    const pipeline = kv.pipeline()
    for (const id of ids) {
      pipeline.del(`${CHARGER_KEY_PREFIX}${id}`)
    }
    pipeline.del(CHARGERS_LIST_KEY)
    await pipeline.exec()
  }
}

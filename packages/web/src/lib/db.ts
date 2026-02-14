import {
  getChargersCollection,
  Db,
  Collection,
  MongoClient,
} from './mongodb'

/**
 * 获取所有充电器 ID 列表
 */
export async function getChargerIds(): Promise<string[]> {
  const collection = await getChargersCollection()
  const chargers = await collection.find({}, { projection: { _id: 0, id: 1 } }).toArray()
  return chargers.map((c: any) => c.id)
}

/**
 * 获取单个充电器数据
 */
export async function getCharger(id: string) {
  const collection = await getChargersCollection()
  return await collection.findOne({ id })
}

/**
 * 获取所有充电器数据
 */
export async function getAllChargers(): Promise<any[]> {
  const collection = await getChargersCollection()
  return await collection.find({}).toArray()
}

/**
 * 设置单个充电器数据
 */
export async function setCharger(charger: any): Promise<void> {
  const collection = await getChargersCollection()
  await collection.updateOne(
    { id: charger.id },
    { $set: charger },
    { upsert: true }
  )
}

/**
 * 批量设置充电器数据
 */
export async function setChargers(chargers: any[]): Promise<void> {
  const collection = await getChargersCollection()

  // 使用 bulkWrite 提高性能
  const operations = chargers.map((charger) => ({
    updateOne: {
      filter: { id: charger.id },
      update: { $set: charger },
      upsert: true,
    },
  }))

  if (operations.length > 0) {
    await collection.bulkWrite(operations)
  }
}

/**
 * 删除单个充电器
 */
export async function deleteCharger(id: string): Promise<void> {
  const collection = await getChargersCollection()
  await collection.deleteOne({ id })
}

/**
 * 清空所有充电器数据
 */
export async function clearAllChargers(): Promise<void> {
  const collection = await getChargersCollection()
  await collection.deleteMany({})
}

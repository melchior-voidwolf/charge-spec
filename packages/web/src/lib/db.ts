import { getChargersCollection } from './mongodb'

/**
 * 创建索引以优化查询性能
 */
export async function createIndexes(): Promise<void> {
  const collection = await getChargersCollection()

  try {
    // 单字段索引
    await collection.createIndex({ brand: 1 })
    await collection.createIndex({ 'power.maxPower': 1 })
    await collection.createIndex({ protocols: 1 })

    // 复合索引用于常见的品牌+功率筛选
    await collection.createIndex({ brand: 1, 'power.maxPower': 1 })

    console.log('✅ MongoDB 索引创建成功')
  } catch (error) {
    console.warn('⚠️  MongoDB 索引创建警告:', error)
  }
}

/**
 * 获取充电器列表页数据（仅投影必要字段）
 * 优化：不获取详情字段（description、configurations、physicalSpecs 等）
 */
export async function getAllChargersForList(): Promise<any[]> {
  const collection = await getChargersCollection()

  // 只投影列表页需要的字段
  const projection = {
    id: 1,
    brand: 1,
    model: 1,
    displayName: 1,
    'power.maxPower': 1,
    protocols: 1,
    'ports.count': 1,
    'ports.type': 1,
    isGaN: 1,
  }

  return await collection.find({}, { projection }).toArray()
}

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

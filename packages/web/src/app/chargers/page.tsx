/**
 * Charger list page - 充电器列表页面
 * 服务器组件：从 MongoDB 获取数据
 */

import { getAllChargers } from '@/lib/db'
import ChargersClient from './ChargersClient'

// 安全序列化，移除不可序列化的字段（如 Buffer、ObjectId）
function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    // 跳过 MongoDB 特殊字段
    if (key === '_id' || key === '__v') {
      return undefined
    }
    // 跳过 Buffer 类型
    if (value && typeof value === 'object' && (value as any).type === 'Buffer') {
      return undefined
    }
    return value
  }))
}

export default async function ChargersPage() {
  // 从 MongoDB 获取所有充电器数据
  const chargersData = await getAllChargers()

  // 序列化处理
  const serializedChargers = serializeData(chargersData)

  return <ChargersClient chargers={serializedChargers} />
}

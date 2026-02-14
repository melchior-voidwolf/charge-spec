/**
 * Charger list page - 充电器列表页面
 * 服务器组件：从 MongoDB 获取数据
 */

import { getAllChargers } from '@/lib/db'
import ChargersClient from './ChargersClient'

export default async function ChargersPage() {
  // 从 MongoDB 获取所有充电器数据
  const chargersData = await getAllChargers()

  // 序列化处理，移除 Buffer 等不可序列化的字段
  const serializedChargers = JSON.parse(JSON.stringify(chargersData))

  return <ChargersClient chargers={serializedChargers} />
}

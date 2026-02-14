/**
 * Charger list page - 充电器列表页面
 * 服务器组件：从 MongoDB 获取数据
 */

import { getAllChargersForList } from '@/lib/db'
import ChargersClient from './ChargersClient'

export default async function ChargersPage() {
  // 从 MongoDB 获取充电器列表数据（仅投影必要字段）
  const chargersData = await getAllChargersForList()

  // 序列化处理，移除 Buffer 等不可序列化的字段
  const serializedChargers = JSON.parse(JSON.stringify(chargersData))

  return <ChargersClient chargers={serializedChargers} />
}

/**
 * Charger list page - 充电器列表页面
 * 服务器组件：从 MongoDB 获取数据
 */

import { getAllChargers } from '@/lib/db'
import ChargersClient from './ChargersClient'

export default async function ChargersPage() {
  // 从 MongoDB 获取所有充电器数据
  const chargersData = await getAllChargers()

  return <ChargersClient chargers={chargersData} />
}

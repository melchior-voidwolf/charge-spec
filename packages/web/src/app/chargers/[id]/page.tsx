/**
 * Charger detail page - 充电器详情页面
 * 服务器组件：从 MongoDB 获取数据
 */

import { getCharger } from '@/lib/db'
import { notFound } from 'next/navigation'
import ChargerDetailContent from './ChargerDetailContent'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const charger = await getCharger(id)

  if (!charger) {
    return {
      title: '充电器未找到',
    }
  }

  return {
    title: `${charger.displayName} - Charge Spec (充电查询网)`,
    description: charger.description,
  }
}

export default async function ChargerDetailPage({ params }: PageProps) {
  const { id } = await params
  const charger = await getCharger(id)

  if (!charger) {
    notFound()
  }

  // 序列化处理，移除 Buffer 字段
  const serializedCharger = JSON.parse(JSON.stringify(charger))

  return <ChargerDetailContent charger={serializedCharger} />
}

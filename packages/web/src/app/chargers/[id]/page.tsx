/**
 * Charger detail page - 充电器详情页面
 * 服务器组件：从 MongoDB 获取数据
 */

import { getCharger } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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

  // 安全序列化，移除不可序列化的字段
  const serializedCharger = JSON.parse(JSON.stringify(charger, (key, value) => {
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

  return <ChargerDetailContent charger={serializedCharger} />
}

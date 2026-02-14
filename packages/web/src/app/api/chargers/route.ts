import { NextResponse } from 'next/server'
import { getAllChargers } from '@/lib/kv'

/**
 * GET /api/chargers
 * 获取所有充电器数据
 */
export async function GET() {
  try {
    const chargers = await getAllChargers()

    return NextResponse.json({
      chargers,
      total: chargers.length,
    })
  } catch (error) {
    console.error('Error fetching chargers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chargers' },
      { status: 500 }
    )
  }
}

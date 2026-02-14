import { NextRequest, NextResponse } from 'next/server'
import { getCharger } from '@/lib/db'

/**
 * GET /api/chargers/[id]
 * 获取单个充电器数据
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const charger = await getCharger(id)

    if (!charger) {
      return NextResponse.json(
        { error: 'Charger not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(charger)
  } catch (error) {
    console.error('Error fetching charger:', error)
    return NextResponse.json(
      { error: 'Failed to fetch charger' },
      { status: 500 }
    )
  }
}

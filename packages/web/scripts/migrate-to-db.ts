/**
 * 数据迁移脚本：将充电器数据导入到 MongoDB
 *
 * 使用方法：
 *   1. 确保已设置 MONGODB_URI 环境变量
 *   2. 运行: yarn workspace @charge-spec/web migrate:db
 */

import { crawledChargers } from '@charge-spec/shared'
import {
  setChargers,
  clearAllChargers,
  getChargerIds,
  createIndexes,
} from '../src/lib/db'

async function main() {
  console.log('🚀 开始迁移充电器数据到 MongoDB...\n')

  // 1. 清空现有数据
  console.log('🗑️  清空现有数据...')
  await clearAllChargers()
  console.log('✅ 现有数据已清空\n')

  // 2. 导入新数据
  console.log(`📦 导入 ${crawledChargers.length} 条充电器数据...`)
  await setChargers(crawledChargers)
  console.log('✅ 数据导入完成\n')

  // 3. 验证数据
  console.log('🔍 验证数据...')
  const ids = await getChargerIds()
  console.log(`✅ 共导入 ${ids.length} 条记录\n`)

  // 4. 创建索引
  console.log('📇 创建数据库索引...')
  await createIndexes()

  // 4. 显示示例数据
  console.log('📋 示例数据 (前 3 条):')
  const { getCharger } = await import('../src/lib/db')
  for (const id of ids.slice(0, 3)) {
    const charger = await getCharger(id)
    if (charger) {
      console.log(`   - ${charger.displayName} (${charger.brand} ${charger.power.maxPower}W)`)
    }
  }

  console.log('\n✅ 迁移完成！')
}

main().catch((error) => {
  console.error('❌ 迁移失败:', error)
  process.exit(1)
})

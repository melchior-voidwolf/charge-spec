/**
 * 数据迁移脚本：从 test 数据库迁移到 charge-spec 数据库
 *
 * 问题：之前的数据在 test 数据库（因为 client.db() 没有指定数据库名称）
 * 解决：将数据移动到正确的 charge-spec 数据库
 */

import { MongoClient } from 'mongodb'

// 直接使用连接字符串（避免环境变量加载问题）
const uri = 'mongodb+srv://Vercel-Admin-atlas-emerald-house:tzWz8GPR0DBj5ARB@atlas-emerald-house.aq0saix.mongodb.net/?retryWrites=true&w=majority'
const sourceDbName = 'test'
const targetDbName = 'charge-spec'
const collectionName = 'chargers'

async function main() {
  console.log('🚀 开始从 test 数据库迁移到 charge-spec 数据库...\n')

  const client = new MongoClient(uri)
  try {
    await client.connect()

    // 1. 获取源数据库（test）
    const sourceDb = client.db(sourceDbName)
    const sourceCollection = sourceDb.collection(collectionName)

    // 2. 获取目标数据库（charge-spec）
    const targetDb = client.db(targetDbName)
    const targetCollection = targetDb.collection(collectionName)

    // 3. 统计源数据库中的文档数量
    console.log(`📊 统计 ${sourceDbName} 数据库中的数据...`)
    const count = await sourceCollection.countDocuments()
    console.log(`✅ 找到 ${count} 条充电器记录\n`)

    if (count === 0) {
      console.log('⚠️  源数据库为空，无需迁移')
      return
    }

    // 4. 读取所有数据
    console.log('📖 读取所有充电器数据...')
    const chargers = await sourceCollection.find({}).toArray()
    console.log(`✅ 读取了 ${chargers.length} 条记录\n`)

    // 5. 写入到目标数据库
    console.log(`💾 写入到 ${targetDbName} 数据库...`)

    // 先清空目标集合（避免重复）
    await targetCollection.deleteMany({})
    console.log('🗑️  清空目标集合完成')

    // 批量写入
    if (chargers.length > 0) {
      await targetCollection.insertMany(chargers)
    }

    console.log(`✅ 写入 ${chargers.length} 条记录完成\n`)

    // 6. 验证数据
    console.log('🔍 验证迁移结果...')
    const targetCount = await targetCollection.countDocuments()
    const sourceCount = await sourceCollection.countDocuments()

    console.log(`   源数据库 (${sourceDbName}): ${sourceCount} 条`)
    console.log(`   目标数据库 (${targetDbName}): ${targetCount} 条`)

    if (targetCount === sourceCount) {
      console.log('✅ 验证通过！数据迁移成功\n')
    } else {
      console.warn('⚠️  警告：数据数量不匹配\n')
    }

    // 7. 显示示例数据
    console.log('📋 目标数据库示例 (前 3 条):')
    const samples = await targetCollection.find({}).limit(3).toArray()
    for (const charger of samples) {
      console.log(`   - ${charger.displayName} (${charger.brand} ${charger.power.maxPower}W)`)
    }

    console.log('\n✅ 迁移完成！')
    console.log(`\n💡 提示：可以删除 ${sourceDbName} 数据库中的旧数据`)

  } catch (error) {
    console.error('❌ 迁移失败:', error)
    throw error
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('❌ 脚本执行失败:', error)
  process.exit(1)
})

/**
 * Charger list page - 充电器列表页面
 * Displays all available chargers with filtering and search capabilities
 */

import { sampleChargers } from '@charge-spec/shared';
import Link from 'next/link';

export default function ChargersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            充电器列表
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            浏览所有充电器的技术规格
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              共 <span className="font-bold text-gray-900 dark:text-white">{sampleChargers.length}</span> 款充电器
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              数据更新于: 2025-02-13
            </div>
          </div>
        </div>

        {/* Chargers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleChargers.map((charger) => (
            <Link
              key={charger.id}
              href={`/chargers/${charger.id}`}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-shadow duration-200 overflow-hidden h-full flex flex-col">
                {/* Card Header */}
                <div className="p-6 flex-1">
                  {/* Brand Badge */}
                  <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full mb-3">
                    {charger.brand}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {charger.displayName}
                  </h3>

                  {/* Model Number */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    型号: {charger.model}
                  </p>

                  {/* Power Rating */}
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {charger.power.maxPower}
                      </span>
                      <span className="ml-1 text-lg text-gray-600 dark:text-gray-300">W</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      最大输出功率
                    </p>
                  </div>

                  {/* Protocols */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">支持的协议:</p>
                    <div className="flex flex-wrap gap-1">
                      {charger.protocols.slice(0, 3).map((protocol) => (
                        <span
                          key={protocol}
                          className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {protocol}
                        </span>
                      ))}
                      {charger.protocols.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          +{charger.protocols.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ports */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">接口配置:</p>
                    <div className="space-y-1">
                      {charger.ports.map((port, index) => (
                        <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          {port.count} × {port.type}
                          {port.maxPower && ` (${port.maxPower}W)`}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features Tags */}
                  {charger.isGaN && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                        GaN 技术
                      </span>
                    </div>
                  )}
                  {charger.hasFoldingPlug && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                        折叠插脚
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    {charger.price && (
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        ¥{charger.price.current}
                        {charger.price.msrp && charger.price.msrp > charger.price.current && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            ¥{charger.price.msrp}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                      查看详情 →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State (if no chargers) */}
        {sampleChargers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              暂无充电器数据
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

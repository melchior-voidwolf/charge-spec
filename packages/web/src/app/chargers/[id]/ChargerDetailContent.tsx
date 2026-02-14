/**
 * Charger detail content - 充电器详情内容组件
 */

import Link from 'next/link'

interface ChargerDetailContentProps {
  charger: any
}

export default function ChargerDetailContent({ charger }: ChargerDetailContentProps) {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/chargers"
            className="inline-flex items-center text-[13px] text-link hover:text-link-hover mb-4"
          >
            ← 返回充电器列表
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block px-2 py-0.5 bg-accent-bg text-link text-[11px] font-semibold rounded mb-2">
                {charger.brand}
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight mb-1">
                {charger.displayName}
              </h1>
              <p className="text-[14px] text-text-tertiary">型号：{charger.model}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-baseline justify-end">
                <span className="text-3xl md:text-4xl font-bold text-text-primary">
                  {charger.power.maxPower}
                </span>
                <span className="ml-1 text-lg text-text-tertiary">W</span>
              </div>
              <p className="text-[12px] text-text-tertiary mt-0.5">最大输出功率</p>
            </div>
          </div>
          {charger.description && (
            <p className="text-[14px] text-text-secondary max-w-3xl mt-4">{charger.description}</p>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-text-secondary">充电器详情内容加载自 MongoDB</p>
      </div>
    </div>
  )
}

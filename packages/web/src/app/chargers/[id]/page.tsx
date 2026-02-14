/**
 * Charger detail page - 充电器详情页面
 * Shows full specifications and details for a specific charger
 */

import { allChargers } from '@charge-spec/shared'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Generate static params for all chargers
export async function generateStaticParams() {
  return allChargers.map((charger) => ({
    id: charger.id,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const charger = allChargers.find((c) => c.id === id)

  if (!charger) {
    return {
      title: '充电器未找到',
    }
  }

  return {
    title: `${charger.displayName} - Charge Spec (快充查查网)`,
    description: charger.description,
  }
}

export default async function ChargerDetailPage({ params }: PageProps) {
  const { id } = await params
  const charger = allChargers.find((c) => c.id === id)

  if (!charger) {
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <Link
            href="/chargers"
            className="inline-flex items-center text-[13px] text-link hover:text-link-hover mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回充电器列表
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Brand Badge */}
              <span className="inline-block px-2 py-0.5 bg-accent-bg text-link text-[11px] font-semibold rounded mb-2">
                {charger.brand}
              </span>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight mb-1">
                {charger.displayName}
              </h1>

              {/* Model Number */}
              <p className="text-[14px] text-text-tertiary">型号：{charger.model}</p>
            </div>

            {/* Power Rating - Prominent */}
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

          {/* Description */}
          {charger.description && (
            <p className="text-[14px] text-text-secondary max-w-3xl mt-4">{charger.description}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Power Configurations */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-semibold text-text-primary mb-3">功率输出配置</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2.5 px-2 text-[12px] font-semibold text-text-secondary">
                        电压 (V)
                      </th>
                      <th className="text-left py-2.5 px-2 text-[12px] font-semibold text-text-secondary">
                        电流 (A)
                      </th>
                      <th className="text-left py-2.5 px-2 text-[12px] font-semibold text-text-secondary">
                        功率 (W)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {charger.power.configurations.map((config, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-2.5 px-2 text-text-primary font-medium text-[13px]">
                          {config.voltage}
                        </td>
                        <td className="py-2.5 px-2 text-text-primary font-medium text-[13px]">
                          {config.current}
                        </td>
                        <td className="py-2.5 px-2 text-text-primary font-semibold text-[13px]">
                          {config.power}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supported Protocols */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-semibold text-text-primary mb-3">支持的充电协议</h2>
              <div className="flex flex-wrap gap-1.5">
                {charger.protocols.map((protocol) => (
                  <span
                    key={protocol}
                    className="inline-block px-2.5 py-1 bg-sidebar text-text-secondary rounded-lg text-[12px] font-medium"
                  >
                    {protocol}
                  </span>
                ))}
              </div>
            </div>

            {/* Connector Ports */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-semibold text-text-primary mb-3">接口配置</h2>
              <div className="space-y-3">
                {charger.ports.map((port, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <h3 className="text-[14px] font-semibold text-text-primary">
                          {port.count} × {port.type}
                        </h3>
                        {port.maxPower && (
                          <p className="text-[12px] text-text-tertiary mt-0.5">
                            最大功率：{port.maxPower}W
                          </p>
                        )}
                      </div>
                      {port.color && (
                        <span className="inline-block px-1.5 py-0.5 bg-sidebar text-text-secondary text-[10px] rounded">
                          {port.color}
                        </span>
                      )}
                    </div>
                    {port.protocols && port.protocols.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] text-text-tertiary mb-1">支持协议：</p>
                        <div className="flex flex-wrap gap-1">
                          {port.protocols.map((protocol) => (
                            <span
                              key={protocol}
                              className="inline-block px-1.5 py-0.5 bg-sidebar text-text-secondary text-[10px] rounded"
                            >
                              {protocol}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {port.isShared && (
                      <p className="text-[11px] text-amber-600 mt-1.5">
                        * 功率共享（多设备同时充电时总功率分配）
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {charger.features && charger.features.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-semibold text-text-primary mb-3">产品特色</h2>
                <ul className="space-y-1.5">
                  {charger.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-text-secondary text-[13px]">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {charger.certifications && charger.certifications.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-semibold text-text-primary mb-3">认证信息</h2>
                <div className="flex flex-wrap gap-1.5">
                  {charger.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-block px-2.5 py-1 bg-sidebar text-text-secondary rounded-lg text-[12px]"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* Quick Info Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-[14px] font-semibold text-text-primary mb-3">快速信息</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                  <span className="text-[12px] text-text-tertiary">发布年份</span>
                  <span className="font-medium text-text-primary text-[12px]">
                    {charger.releaseYear || '未知'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                  <span className="text-[12px] text-text-tertiary">GaN 技术</span>
                  <span
                    className={`font-medium text-[12px] ${charger.isGaN ? 'text-green-600' : 'text-text-tertiary'}`}
                  >
                    {charger.isGaN ? '是' : '否'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                  <span className="text-[12px] text-text-tertiary">折叠插脚</span>
                  <span
                    className={`font-medium text-[12px] ${charger.hasFoldingPlug ? 'text-green-600' : 'text-text-tertiary'}`}
                  >
                    {charger.hasFoldingPlug ? '是' : '否'}
                  </span>
                </div>
                {charger.manufacturedIn && (
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-[12px] text-text-tertiary">产地</span>
                    <span className="font-medium text-text-primary text-[12px]">
                      {charger.manufacturedIn}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Physical Specifications */}
            {charger.physicalSpecs && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-[14px] font-semibold text-text-primary mb-3">物理规格</h3>
                <div className="space-y-2">
                  {charger.physicalSpecs.width &&
                    charger.physicalSpecs.height &&
                    charger.physicalSpecs.depth && (
                      <div className="py-1.5 border-b border-gray-100">
                        <span className="text-[12px] text-text-tertiary">尺寸</span>
                        <p className="font-medium text-text-primary text-[12px] mt-0.5">
                          {charger.physicalSpecs.width} × {charger.physicalSpecs.height} ×{' '}
                          {charger.physicalSpecs.depth} mm
                        </p>
                      </div>
                    )}
                  {charger.physicalSpecs.weight && (
                    <div className="py-1.5 border-b border-gray-100">
                      <span className="text-[12px] text-text-tertiary">重量</span>
                      <p className="font-medium text-text-primary text-[12px] mt-0.5">
                        {charger.physicalSpecs.weight} g
                      </p>
                    </div>
                  )}
                  {charger.physicalSpecs.colors && charger.physicalSpecs.colors.length > 0 && (
                    <div className="py-1.5">
                      <span className="text-[12px] text-text-tertiary">颜色</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {charger.physicalSpecs.colors.map((color) => (
                          <span
                            key={color}
                            className="inline-block px-1.5 py-0.5 bg-sidebar text-text-secondary text-[10px] rounded"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price & Purchase */}
            {charger.price?.current && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-[14px] font-semibold text-text-primary mb-3">价格信息</h3>
                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-text-primary">
                      ¥{charger.price.current}
                    </span>
                    {charger.price.msrp &&
                      charger.price.current &&
                      charger.price.msrp > charger.price.current && (
                        <>
                          <span className="ml-2 text-[12px] text-text-tertiary line-through">
                            ¥{charger.price.msrp}
                          </span>
                          <span className="ml-2 text-[10px] text-green-600">
                            {Math.round((1 - charger.price.current / charger.price.msrp) * 100)}%
                            OFF
                          </span>
                        </>
                      )}
                  </div>
                  {charger.purchaseUrls?.official && (
                    <a
                      href={charger.purchaseUrls.official}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 px-4 bg-link hover:bg-link-hover text-white text-[13px] font-medium rounded-lg transition-colors"
                    >
                      官方购买链接
                    </a>
                  )}
                  {charger.purchaseUrls?.amazon && (
                    <a
                      href={charger.purchaseUrls.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 px-4 bg-sidebar hover:bg-gray-100 text-text-primary text-[13px] font-medium rounded-lg transition-colors"
                    >
                      Amazon 购买
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {charger.officialUrl && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-[14px] font-semibold text-text-primary mb-2">官方链接</h3>
                <a
                  href={charger.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-link hover:text-link-hover transition-colors break-all"
                >
                  查看官网产品页面 →
                </a>
              </div>
            )}

            {/* Notes */}
            {charger.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="text-[12px] font-semibold text-amber-900 mb-1.5">备注</h4>
                <p className="text-[12px] text-amber-800">{charger.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

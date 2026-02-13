/**
 * Charger detail page - 充电器详情页面
 * Shows full specifications and details for a specific charger
 */

import { sampleChargers } from '@charge-spec/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all chargers
export async function generateStaticParams() {
  return sampleChargers.map((charger) => ({
    id: charger.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const charger = sampleChargers.find((c) => c.id === id);

  if (!charger) {
    return {
      title: '充电器未找到',
    };
  }

  return {
    title: `${charger.displayName} - Charge Spec (快充查查网)`,
    description: charger.description,
  };
}

export default async function ChargerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const charger = sampleChargers.find((c) => c.id === id);

  if (!charger) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Link
            href="/chargers"
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
          >
            ← 返回充电器列表
          </Link>

          {/* Brand Badge */}
          <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full mb-4">
            {charger.brand}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {charger.displayName}
          </h1>

          {/* Model Number */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            型号: {charger.model}
          </p>

          {/* Power Rating - Prominent */}
          <div className="flex items-baseline mb-4">
            <span className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              {charger.power.maxPower}
            </span>
            <span className="ml-2 text-3xl text-gray-600 dark:text-gray-300">W</span>
            <span className="ml-4 text-lg text-gray-500 dark:text-gray-400">最大输出功率</span>
          </div>

          {/* Description */}
          {charger.description && (
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
              {charger.description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Power Configurations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                功率输出配置
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        电压 (V)
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        电流 (A)
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        功率 (W)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {charger.power.configurations.map((config, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                          {config.voltage}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                          {config.current}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-bold">
                          {config.power}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supported Protocols */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                支持的充电协议
              </h2>
              <div className="flex flex-wrap gap-2">
                {charger.protocols.map((protocol) => (
                  <span
                    key={protocol}
                    className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium"
                  >
                    {protocol}
                  </span>
                ))}
              </div>
            </div>

            {/* Connector Ports */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                接口配置
              </h2>
              <div className="space-y-4">
                {charger.ports.map((port, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {port.count} × {port.type}
                        </h3>
                        {port.maxPower && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            最大功率: {port.maxPower}W
                          </p>
                        )}
                      </div>
                      {port.color && (
                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          {port.color}
                        </span>
                      )}
                    </div>
                    {port.protocols && port.protocols.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">支持协议:</p>
                        <div className="flex flex-wrap gap-1">
                          {port.protocols.map((protocol) => (
                            <span
                              key={protocol}
                              className="inline-block px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                            >
                              {protocol}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {port.isShared && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                        * 功率共享（多设备同时充电时总功率分配）
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {charger.features && charger.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  产品特色
                </h2>
                <ul className="space-y-2">
                  {charger.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {charger.certifications && charger.certifications.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  认证信息
                </h2>
                <div className="flex flex-wrap gap-2">
                  {charger.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                快速信息
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">发布年份</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {charger.releaseYear || '未知'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">GaN 技术</span>
                  <span className={`font-medium ${charger.isGaN ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {charger.isGaN ? '是' : '否'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">折叠插脚</span>
                  <span className={`font-medium ${charger.hasFoldingPlug ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {charger.hasFoldingPlug ? '是' : '否'}
                  </span>
                </div>
                {charger.manufacturedIn && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">产地</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {charger.manufacturedIn}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Physical Specifications */}
            {charger.physicalSpecs && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  物理规格
                </h3>
                <div className="space-y-3">
                  {charger.physicalSpecs.width && charger.physicalSpecs.height && charger.physicalSpecs.depth && (
                    <div className="py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">尺寸</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">
                        {charger.physicalSpecs.width} × {charger.physicalSpecs.height} × {charger.physicalSpecs.depth} mm
                      </p>
                    </div>
                  )}
                  {charger.physicalSpecs.weight && (
                    <div className="py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">重量</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">
                        {charger.physicalSpecs.weight} g
                      </p>
                    </div>
                  )}
                  {charger.physicalSpecs.colors && charger.physicalSpecs.colors.length > 0 && (
                    <div className="py-2">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">颜色</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {charger.physicalSpecs.colors.map((color) => (
                          <span
                            key={color}
                            className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
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
            {charger.price && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  价格信息
                </h3>
                <div className="space-y-3">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ¥{charger.price.current}
                    </span>
                    {charger.price.msrp && charger.price.msrp > charger.price.current && (
                      <>
                        <span className="ml-2 text-lg text-gray-500 dark:text-gray-400 line-through">
                          ¥{charger.price.msrp}
                        </span>
                        <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                          {Math.round((1 - charger.price.current / charger.price.msrp) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {charger.purchaseUrls?.official && (
                    <a
                      href={charger.purchaseUrls.official}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      官方购买链接
                    </a>
                  )}
                  {charger.purchaseUrls?.amazon && (
                    <a
                      href={charger.purchaseUrls.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Amazon 购买
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {charger.officialUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  官方链接
                </h3>
                <a
                  href={charger.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                >
                  查看官网产品页面 →
                </a>
              </div>
            )}

            {/* Notes */}
            {charger.notes && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  备注
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  {charger.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

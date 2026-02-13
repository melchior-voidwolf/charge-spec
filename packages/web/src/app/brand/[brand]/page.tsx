import { sampleChargers } from '@charge-spec/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

// Generate static params for all brands
export async function generateStaticParams() {
  const brands = Array.from(new Set(sampleChargers.map((c) => c.brand)));
  return brands.map((brand) => ({
    brand: encodeURIComponent(brand),
  }));
}

export async function generateMetadata({ params }: BrandPageProps) {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand);

  return {
    title: `${decodedBrand} 充电器 - Charge Spec (快充查查网)`,
    description: `查看 ${decodedBrand} 品牌的所有充电器技术规格`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand);

  // Filter chargers by brand
  const brandChargers = sampleChargers.filter(
    (charger) => charger.brand.toLowerCase() === decodedBrand.toLowerCase()
  );

  // Check if brand exists
  const allBrands = Array.from(new Set(sampleChargers.map((c) => c.brand)));
  const brandExists = allBrands.some(
    (b) => b.toLowerCase() === decodedBrand.toLowerCase()
  );

  if (!brandExists) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              ← 返回首页
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {decodedBrand}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {brandChargers.length} 款充电器
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {brandChargers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandChargers.map((charger) => (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              该品牌暂无充电器数据
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

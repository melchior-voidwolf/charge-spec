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
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center text-[13px] text-link hover:text-link-hover mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-block px-2.5 py-1 bg-accent-bg text-link text-[12px] font-semibold rounded-md">
              {decodedBrand}
            </span>
            <span className="text-[13px] text-text-tertiary">
              {brandChargers.length} 款充电器
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {brandChargers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {brandChargers.map((charger) => (
              <Link
                key={charger.id}
                href={`/chargers/${charger.id}`}
                className="group block p-4 bg-white border border-gray-200 rounded-xl hover:border-link/30 hover:shadow-sm transition-all"
              >
                {/* Title */}
                <h3 className="text-[15px] font-semibold text-text-primary mb-0.5 group-hover:text-link transition-colors leading-tight">
                  {charger.displayName}
                </h3>

                {/* Model */}
                <p className="text-[12px] text-text-tertiary mb-3">
                  {charger.model}
                </p>

                {/* Power */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-xl font-bold text-text-primary">
                    {charger.power.maxPower}
                  </span>
                  <span className="text-[13px] text-text-tertiary">W</span>
                </div>

                {/* Protocols */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {charger.protocols.slice(0, 4).map((protocol) => (
                    <span
                      key={protocol}
                      className="inline-block px-1.5 py-0.5 bg-sidebar text-text-secondary text-[10px] rounded"
                    >
                      {protocol}
                    </span>
                  ))}
                  {charger.protocols.length > 4 && (
                    <span className="inline-block px-1.5 py-0.5 bg-sidebar text-text-secondary text-[10px] rounded">
                      +{charger.protocols.length - 4}
                    </span>
                  )}
                </div>

                {/* Ports */}
                <div className="flex items-center gap-2 text-[12px] text-text-secondary pt-3 border-t border-gray-100">
                  {charger.ports.map((port, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {port.count}×{port.type.replace('USB-', '')}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-10 h-10 mx-auto mb-3 bg-sidebar rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[14px] text-text-tertiary">
              该品牌暂无充电器数据
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

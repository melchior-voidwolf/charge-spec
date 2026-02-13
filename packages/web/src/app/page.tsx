import Link from 'next/link'

// basePath from next.config.ts
const BASE_PATH = '/charge-spec'

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={`${BASE_PATH}/logo.svg`} alt="Charge Spec Logo" className="w-14 h-14" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-3">
            快充查查网
          </h1>

          <p className="text-lg text-text-secondary mb-2">Charge Spec</p>

          <p className="text-[15px] text-text-tertiary max-w-xl mx-auto leading-relaxed">
            专业的充电器技术规格数据库，支持多品牌、多协议的充电器查询和对比
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="/chargers"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-link text-white text-[14px] font-medium rounded-lg hover:bg-link-hover transition-colors"
            >
              浏览充电器
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="group">
              <div className="w-9 h-9 mb-3 bg-accent-bg rounded-lg flex items-center justify-center">
                <svg
                  className="w-[18px] h-[18px] text-link"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-1.5">全面查询</h3>
              <p className="text-[13px] text-text-tertiary leading-relaxed">
                支持按品牌、功率、充电协议等多维度查询充电器规格
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="w-9 h-9 mb-3 bg-accent-bg rounded-lg flex items-center justify-center">
                <svg
                  className="w-[18px] h-[18px] text-link"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-1.5">协议支持</h3>
              <p className="text-[13px] text-text-tertiary leading-relaxed">
                覆盖 PD、QC、AFC、SCP 等主流快充协议
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="w-9 h-9 mb-3 bg-accent-bg rounded-lg flex items-center justify-center">
                <svg
                  className="w-[18px] h-[18px] text-link"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-1.5">移动优先</h3>
              <p className="text-[13px] text-text-tertiary leading-relaxed">
                响应式设计，完美适配手机、平板和桌面设备
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Brands */}
      <div className="border-t border-gray-200 bg-sidebar">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-[13px] text-text-tertiary text-center">
            支持品牌：Apple、Anker、小米、华为、OPPO、vivo、三星、CUKTECH、HONOR 等
          </p>
        </div>
      </div>
    </div>
  )
}

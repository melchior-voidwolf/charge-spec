import Link from 'next/link';

// basePath from next.config.ts
const BASE_PATH = '/charge-spec';

export default function HomePage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-8 md:py-12 px-4">
          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-8 animate-fade-in">
            <img
              src={`${BASE_PATH}/logo.svg`}
              alt="Charge Spec Logo"
              className="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-gradient-to-r animate-gradient">
            快充查查网
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-3 md:mb-4 font-medium">
            Charge Spec - 充电器技术规格查询平台
          </p>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            专业的充电器技术规格数据库，支持多品牌、多协议的充电器查询和对比。
            快速找到您需要的充电器规格信息。
          </p>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6 md:gap-8 py-8 md:py-12 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group">
            <div className="w-12 h-12 md:w-14 md:h-14 mb-4 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">全面查询</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              支持按品牌、功率、充电协议等多维度查询充电器规格
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group">
            <div className="w-12 h-12 md:w-14 md:h-14 mb-4 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">协议支持</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              覆盖 PD、QC、AFC、SCP 等主流快充协议
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group">
            <div className="w-12 h-12 md:w-14 md:h-14 mb-4 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">移动端友好</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              响应式设计，完美适配手机、平板和桌面设备
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-8 md:py-12 px-4">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-gradient-to-r rounded-2xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">开始探索充电器世界</h2>
              <p className="text-base md:text-lg mb-6 md:mb-8 opacity-95 leading-relaxed">
                浏览我们丰富的充电器数据库，找到最适合您的充电设备
              </p>
              <Link
                href="/chargers"
                className="inline-block bg-white text-blue-600 font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                查看所有充电器
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <section className="text-center py-6 md:py-8 px-4 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-8">
          <p className="mb-2">正在建设中 - 更多充电器数据和功能即将上线</p>
          <p className="text-sm">支持品牌：Apple、Anker、小米、华为、OPPO 等</p>
        </section>
      </div>
    </div>
  );
}

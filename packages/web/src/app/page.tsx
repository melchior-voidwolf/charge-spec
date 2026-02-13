export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-16 px-4">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            充电头规格
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            Charge Spec - 充电器技术规格查询平台
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            专业的充电头技术规格数据库，支持多品牌、多协议的充电器查询和对比。
            快速找到您需要的充电器规格信息。
          </p>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 py-12 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">全面查询</h3>
            <p className="text-gray-600 dark:text-gray-400">
              支持按品牌、功率、充电协议等多维度查询充电器规格
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">协议支持</h3>
            <p className="text-gray-600 dark:text-gray-400">
              覆盖 PD、QC、AFC、SCP 等主流快充协议
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">移动端友好</h3>
            <p className="text-gray-600 dark:text-gray-400">
              响应式设计，完美适配手机、平板和桌面设备
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">开始探索充电器世界</h2>
            <p className="text-lg mb-8 opacity-90">
              浏览我们丰富的充电器数据库，找到最适合您的充电设备
            </p>
            <div className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              查看所有充电器
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <section className="text-center py-8 px-4 text-gray-600 dark:text-gray-400">
          <p>正在建设中 - 更多充电器数据和功能即将上线</p>
          <p className="mt-2 text-sm">支持品牌：Apple、Anker、小米、华为、OPPO 等</p>
        </section>
      </div>
    </main>
  );
}

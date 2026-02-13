export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              充电头规格
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              专业的充电器技术规格查询平台，帮助您找到最适合的充电设备。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
              快速链接
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  首页
                </a>
              </li>
              <li>
                <a
                  href="/chargers"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  充电器列表
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  关于我们
                </a>
              </li>
            </ul>
          </div>

          {/* Support Info */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
              支持品牌
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Apple、Anker、小米、华为、OPPO、vivo、三星等
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} 充电头规格 (Charge Spec). 保留所有权利.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            本网站数据仅供参考，具体规格请以官方信息为准
          </p>
        </div>
      </div>
    </footer>
  );
}

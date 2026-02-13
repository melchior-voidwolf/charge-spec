import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-text-primary mb-3">404</h1>
        <h2 className="text-lg font-semibold text-text-secondary mb-2">页面未找到</h2>
        <p className="text-[14px] text-text-tertiary mb-6">抱歉，您访问的页面不存在。</p>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-link hover:bg-link-hover text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/chargers"
            className="px-4 py-2 bg-sidebar hover:bg-gray-100 text-text-primary text-[13px] font-medium rounded-lg transition-colors"
          >
            浏览充电器
          </Link>
        </div>
      </div>
    </div>
  )
}

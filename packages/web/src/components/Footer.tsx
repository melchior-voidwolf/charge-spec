export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand */}
          <div>
            <h3 className="text-[15px] font-semibold text-text-primary">快充查查网</h3>
            <p className="text-[13px] text-text-tertiary mt-0.5">专业的充电器技术规格查询平台</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-[14px] text-text-secondary hover:text-link transition-colors py-1"
            >
              首页
            </a>
            <a
              href="/chargers"
              className="text-[14px] text-text-secondary hover:text-link transition-colors py-1"
            >
              充电器列表
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-[12px] text-text-tertiary text-center">
            © {new Date().getFullYear()} Charge Spec. 数据仅供参考，以官方信息为准
          </p>
        </div>
      </div>
    </footer>
  )
}

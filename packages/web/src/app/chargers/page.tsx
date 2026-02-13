/**
 * Charger list page - 充电器列表页面
 * Displays all available chargers with filtering and search capabilities
 */

'use client';

import { sampleChargers } from '@charge-spec/shared';
import Link from 'next/link';
import { useState, useMemo } from 'react';

type FilterState = {
  selectedBrands: string[];
  selectedPowerRanges: string[];
  selectedProtocols: string[];
};

type SortOption = 'power-desc' | 'power-asc' | 'brand-az' | 'brand-za' | 'default';

export default function ChargersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    selectedBrands: [],
    selectedPowerRanges: [],
    selectedProtocols: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Extract unique values for filters
  const uniqueBrands = useMemo(() => {
    const brands = new Set(sampleChargers.map((c) => c.brand));
    return Array.from(brands).sort();
  }, []);

  const uniqueProtocols = useMemo(() => {
    const protocols = new Set<string>();
    sampleChargers.forEach((charger) => {
      charger.protocols.forEach((p) => protocols.add(p));
    });
    return Array.from(protocols).sort();
  }, []);

  const powerRanges = [
    { label: '20W - 30W', min: 20, max: 30 },
    { label: '31W - 65W', min: 31, max: 65 },
    { label: '66W - 100W', min: 66, max: 100 },
    { label: '100W+', min: 100, max: Infinity },
  ];

  // Filter chargers based on search query and filters
  const filteredChargers = useMemo(() => {
    let results = sampleChargers;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((charger) => {
        if (charger.brand.toLowerCase().includes(query)) return true;
        if (charger.power.maxPower.toString().includes(query)) return true;
        if (charger.model.toLowerCase().includes(query)) return true;
        if (charger.displayName.toLowerCase().includes(query)) return true;
        if (charger.protocols.some((p) => p.toLowerCase().includes(query))) return true;
        return false;
      });
    }

    // Apply brand filter
    if (filters.selectedBrands.length > 0) {
      results = results.filter((charger) =>
        filters.selectedBrands.includes(charger.brand as string)
      );
    }

    // Apply power range filter
    if (filters.selectedPowerRanges.length > 0) {
      results = results.filter((charger) => {
        return filters.selectedPowerRanges.some((rangeLabel) => {
          const range = powerRanges.find((r) => r.label === rangeLabel);
          if (!range) return false;
          return charger.power.maxPower >= range.min && charger.power.maxPower <= range.max;
        });
      });
    }

    // Apply protocol filter
    if (filters.selectedProtocols.length > 0) {
      results = results.filter((charger) => {
        return filters.selectedProtocols.some((selectedProtocol) =>
          charger.protocols.some((p) => p === selectedProtocol)
        );
      });
    }

    // Apply sorting
    if (sortBy !== 'default') {
      results = [...results].sort((a, b) => {
        switch (sortBy) {
          case 'power-desc':
            return b.power.maxPower - a.power.maxPower;
          case 'power-asc':
            return a.power.maxPower - b.power.maxPower;
          case 'brand-az':
            return a.brand.localeCompare(b.brand);
          case 'brand-za':
            return b.brand.localeCompare(a.brand);
          default:
            return 0;
        }
      });
    }

    return results;
  }, [searchQuery, filters, sortBy]);

  const handleClearSearch = () => setSearchQuery('');

  const handleClearFilters = () => {
    setFilters({
      selectedBrands: [],
      selectedPowerRanges: [],
      selectedProtocols: [],
    });
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[type];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [type]: newArray };
    });
  };

  const hasActiveFilters =
    filters.selectedBrands.length > 0 ||
    filters.selectedPowerRanges.length > 0 ||
    filters.selectedProtocols.length > 0;

  const activeFilterCount =
    filters.selectedBrands.length +
    filters.selectedPowerRanges.length +
    filters.selectedProtocols.length;

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Header Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-text-primary tracking-tight mb-2">
            充电器列表
          </h1>
          <p className="text-[15px] text-text-tertiary">
            浏览所有充电器的技术规格
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar & Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索品牌、功率或型号..."
                className="w-full px-4 py-3 pl-11 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-link/20 focus:border-link bg-white text-text-primary placeholder:text-text-tertiary/60"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors" aria-label="清除搜索">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Toggle & Results Count */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-sidebar hover:bg-gray-100 rounded-lg transition-colors text-[14px] font-medium text-text-secondary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  筛选器
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-link text-white text-[11px] font-semibold rounded-md min-w-[18px] text-center">{activeFilterCount}</span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[14px] text-text-secondary focus:outline-none focus:ring-2 focus:ring-link/20 focus:border-link"
                  >
                    <option value="default">默认排序</option>
                    <option value="power-desc">功率：高到低</option>
                    <option value="power-asc">功率：低到高</option>
                    <option value="brand-az">品牌：A-Z</option>
                    <option value="brand-za">品牌：Z-A</option>
                  </select>
                </div>
              </div>

              <p className="text-[13px] text-text-tertiary">
                {searchQuery || hasActiveFilters ? (
                  <>找到 <span className="font-medium text-text-primary">{filteredChargers.length}</span> 个结果</>
                ) : (
                  <>共 <span className="font-medium text-text-primary">{sampleChargers.length}</span> 款充电器</>
                )}
              </p>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                {/* Brand Filter */}
                <div className="mb-5">
                  <h3 className="text-[13px] font-semibold text-text-primary mb-3">品牌</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => toggleFilter('selectedBrands', brand)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                          filters.selectedBrands.includes(brand)
                            ? 'bg-link text-white'
                            : 'bg-sidebar text-text-secondary hover:bg-gray-100'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Power Range Filter */}
                <div className="mb-5">
                  <h3 className="text-[13px] font-semibold text-text-primary mb-3">功率范围</h3>
                  <div className="flex flex-wrap gap-2">
                    {powerRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => toggleFilter('selectedPowerRanges', range.label)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                          filters.selectedPowerRanges.includes(range.label)
                            ? 'bg-link text-white'
                            : 'bg-sidebar text-text-secondary hover:bg-gray-100'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Protocol Filter */}
                <div className="mb-5">
                  <h3 className="text-[13px] font-semibold text-text-primary mb-3">充电协议</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueProtocols.map((protocol) => (
                      <button
                        key={protocol}
                        onClick={() => toggleFilter('selectedProtocols', protocol)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                          filters.selectedProtocols.includes(protocol)
                            ? 'bg-link text-white'
                            : 'bg-sidebar text-text-secondary hover:bg-gray-100'
                        }`}
                      >
                        {protocol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[13px] text-link hover:text-link-hover font-medium transition-colors"
                  >
                    清除所有筛选
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chargers Grid */}
        {filteredChargers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChargers.map((charger) => (
              <Link
                key={charger.id}
                href={`/chargers/${charger.id}`}
                className="group block p-5 bg-white border border-gray-200 rounded-xl hover:border-link/30 hover:shadow-sm transition-all"
              >
                {/* Brand Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-2.5 py-1 bg-accent-bg text-link text-[12px] font-semibold rounded-md">
                    {charger.brand}
                  </span>
                  {charger.isGaN && (
                    <span className="text-[11px] text-text-tertiary bg-sidebar px-2 py-0.5 rounded">
                      GaN
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[16px] font-semibold text-text-primary mb-1 group-hover:text-link transition-colors">
                  {charger.displayName}
                </h3>

                {/* Model */}
                <p className="text-[13px] text-text-tertiary mb-4">
                  {charger.model}
                </p>

                {/* Power */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-text-primary">
                    {charger.power.maxPower}
                  </span>
                  <span className="text-[14px] text-text-tertiary">W</span>
                </div>

                {/* Protocols */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {charger.protocols.slice(0, 4).map((protocol) => (
                    <span
                      key={protocol}
                      className="inline-block px-2 py-0.5 bg-sidebar text-text-secondary text-[11px] rounded"
                    >
                      {protocol}
                    </span>
                  ))}
                  {charger.protocols.length > 4 && (
                    <span className="inline-block px-2 py-0.5 bg-sidebar text-text-secondary text-[11px] rounded">
                      +{charger.protocols.length - 4}
                    </span>
                  )}
                </div>

                {/* Ports */}
                <div className="flex items-center gap-3 text-[13px] text-text-secondary pt-4 border-t border-gray-100">
                  {charger.ports.map((port, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          /* No Results */
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 bg-sidebar rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[15px] text-text-tertiary mb-4">
              没有找到匹配的充电器
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleClearFilters();
              }}
              className="px-5 py-2.5 bg-link hover:bg-link-hover text-white text-[14px] font-medium rounded-lg transition-colors"
            >
              清除所有条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

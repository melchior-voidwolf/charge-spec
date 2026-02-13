// 充电器数据提取脚本
const https = require('https');

// 从评测页面提取的充电器数据
const extractedChargers = [
  {
    id: 'cuktech-air-magsafe',
    brand: 'CUKTECH',
    model: '10号Air磁吸电能卡',
    displayName: 'CUKTECH 酷态科 10号Air 磁吸电能卡',
    power: {
      maxPower: 55,
      configurations: [
        { voltage: 5, current: 3, power: 15 },
        { voltage: 9, current: 3, power: 27 },
        { voltage: 12, current: 3, power: 36 },
        { voltage: 15, current: 3, power: 45 },
        { voltage: 20, current: 2.75, power: 55 },
      ],
    },
    protocols: ['PD', 'PD 3.0', 'PPS', 'QC 3.0'],
    ports: [
      {
        type: 'USB-C',
        count: 1,
        maxPower: 55,
        protocols: ['PD', 'PPS'],
      },
    ],
    description: 'CUKTECH酷态科10号磁吸电能卡Air，适配iPhone17系列磁吸充电，兼容小米55W快充。',
    features: [
      '磁吸充电设计',
      '兼容小米55W快充',
      '适配iPhone 17系列',
      '便携卡片设计',
    ],
    releaseYear: 2025,
    isGaN: true,
  },
  {
    id: 'ugreen-160w-nitrogen',
    brand: 'UGREEN',
    model: '速显充160W',
    displayName: 'UGREEN 绿联 速显充 160W 氮化镓充电器',
    power: {
      maxPower: 160,
      configurations: [
        { voltage: 5, current: 3, power: 15 },
        { voltage: 9, current: 3, power: 27 },
        { voltage: 12, current: 3, power: 36 },
        { voltage: 15, current: 3, power: 45 },
        { voltage: 20, current: 5, power: 100 },
        { voltage: 28, current: 5.71, power: 160 },
      ],
    },
    protocols: ['PD', 'PD 3.0', 'PD 3.1', 'PPS', 'QC 4.0', 'QC 3.0'],
    ports: [
      {
        type: 'USB-C',
        count: 4,
        maxPower: 160,
        protocols: ['PD', 'PD 3.1'],
        isShared: true,
      },
    ],
    description: '绿联速显充160W氮化镓充电器，支持数码显示功率，多口输出，满足多设备充电需求。',
    features: [
      '160W大功率',
      '支持PD 3.1',
      '数码功率显示',
      '四口同时充电',
      'GaN技术',
    ],
    releaseYear: 2025,
    isGaN: true,
    hasFoldingPlug: true,
  },
  {
    id: 'anker-45w-smart',
    brand: 'Anker',
    model: '安心充Smart 45W',
    displayName: 'Anker 45W 安心充 Smart 充电器',
    power: {
      maxPower: 45,
      configurations: [
        { voltage: 5, current: 3, power: 15 },
        { voltage: 9, current: 3, power: 27 },
        { voltage: 15, current: 3, power: 45 },
        { voltage: 20, current: 2.25, power: 45 },
      ],
    },
    protocols: ['PD', 'PD 3.0', 'PPS', 'QC 3.0'],
    ports: [
      {
        type: 'USB-C',
        count: 1,
        maxPower: 45,
        protocols: ['PD', 'PPS'],
      },
    ],
    description: '安克45W安心充Smart充电器，可以识别iPhone，智能保护电池健康。',
    features: [
      '智能识别iPhone',
      '减缓电池健康衰减',
      '智能屏显',
      '180°折叠插脚',
      'AI温控保护',
    ],
    releaseYear: 2025,
    isGaN: true,
    hasFoldingPlug: true,
  },
  {
    id: 'xiaomi-45w-quick-charge',
    brand: 'Xiaomi',
    model: 'MDY-14-EQ',
    displayName: 'Xiaomi 小米 45W 快充充电器',
    power: {
      maxPower: 45,
      configurations: [
        { voltage: 5, current: 3, power: 15 },
        { voltage: 9, current: 3, power: 27 },
        { voltage: 11, current: 4.1, power: 45 },
        { voltage: 12, current: 3, power: 36 },
      ],
    },
    protocols: ['PD', 'PD 3.0', 'PPS', 'QC 3.0'],
    ports: [
      {
        type: 'USB-C',
        count: 1,
        maxPower: 45,
        protocols: ['PD', 'PPS'],
      },
    ],
    description: '小米45W快充充电器，支持小米手机快充，同时兼容PD协议。',
    features: [
      '45W快速充电',
      '支持小米私有协议',
      '兼容PD协议',
      '过载保护',
    ],
    releaseYear: 2025,
    isGaN: false,
  },
  {
    id: 'apple-40w-dynamic',
    brand: 'Apple',
    model: 'A2849',
    displayName: 'Apple 40W 动态电源适配器',
    power: {
      maxPower: 40,
      configurations: [
        { voltage: 5, current: 3, power: 15 },
        { voltage: 9, current: 3, power: 27 },
        { voltage: 15, current: 2.67, power: 40 },
        { voltage: 20, current: 2, power: 40 },
      ],
    },
    protocols: ['PD', 'PD 3.0', 'PPS'],
    ports: [
      {
        type: 'USB-C',
        count: 1,
        maxPower: 40,
        protocols: ['PD', 'PPS'],
      },
    ],
    description: '苹果40W动态电源适配器，专为iPhone 17系列设计，支持动态功率调整。',
    features: [
      '40W动态功率',
      'iPhone 17专用',
      '支持PPS',
      '原装正品',
    ],
    releaseYear: 2025,
    isGaN: false,
    hasFoldingPlug: false,
    manufacturedIn: '中国',
    certifications: ['CCC', 'CE', 'FCC'],
  },
  {
    id: 'anker-nano-45w-screen',
    brand: 'Anker',
    model: 'A2679',
    displayName: 'Anker Nano 45W 氮化镓屏显充电器',
    power: {
      maxPower: 45,
      configurations: [
        { voltage: 5, current: 3, power: 15 },
        { voltage: 9, current: 3, power: 27 },
        { voltage: 15, current: 3, power: 45 },
        { voltage: 20, current: 2.25, power: 45 },
      ],
    },
    protocols: ['PD', 'PD 3.0', 'PPS', 'QC 3.0'],
    ports: [
      {
        type: 'USB-C',
        count: 1,
        maxPower: 45,
        protocols: ['PD', 'PPS'],
      },
    ],
    description: '安克Nano 45W氮化镓屏显充电器，专为iPhone 17设计，20分钟充50%。',
    features: [
      '智能屏显',
      '20分钟充50%',
      'Nano小巧设计',
      '180°折叠插脚',
      'AI温控',
    ],
    releaseYear: 2025,
    isGaN: true,
    hasFoldingPlug: true,
    manufacturedIn: '中国',
    certifications: ['CCC', 'CE', 'FCC', 'RoHS'],
  },
  {
    id: 'honor-80w-wireless',
    brand: 'HONOR',
    model: 'CP100W',
    displayName: 'HONOR 荣耀 80W 立式无线充电器',
    power: {
      maxPower: 80,
      configurations: [
        { voltage: 5, current: 2, power: 10 },
        { voltage: 9, current: 2, power: 18 },
        { voltage: 12, current: 2, power: 24 },
      ],
    },
    protocols: ['WPT', 'Huawei SCP'],
    ports: [
      {
        type: 'Proprietary',
        count: 1,
        maxPower: 80,
        protocols: ['WPT'],
      },
    ],
    description: '荣耀80W立式无线充电器，支持荣耀手机无线快充，立式设计方便使用。',
    features: [
      '80W无线快充',
      '立式设计',
      '支持多设备',
      '智能温控',
      '异物检测',
    ],
    releaseYear: 2025,
    isGaN: false,
  },
];

console.log(JSON.stringify(extractedChargers, null, 2));

/**
 * Charging protocol types supported by chargers
 */
export enum Protocol {
  // USB Power Delivery
  PD = "PD",
  PD_2_0 = "PD 2.0",
  PD_3_0 = "PD 3.0",
  PD_3_1 = "PD 3.1",
  PPS = "PPS", // Programmable Power Supply

  // Qualcomm Quick Charge
  QC_2_0 = "QC 2.0",
  QC_3_0 = "QC 3.0",
  QC_4_0 = "QC 4.0",
  QC_5 = "QC 5",

  // Other fast charging protocols
  AFC = "AFC", // Samsung Adaptive Fast Charging
  SCP = "SCP", // Huawei SuperCharge Protocol
  FCP = "FCP", // Huawei Fast Charge Protocol
  VOOC = "VOOC", // OPPO / OnePlus
  SUPER_VOOC = "SuperVOOC",
  WARP = "WARP", // OnePlus Warp Charge
  DASH = "DASH", // OnePlus Dash Charge
  FLASH = "Flash", // vivo Flash Charge

  // Apple protocols
  APPLE_2_4A = "Apple 2.4A",
  APPLE_FAST_CHARGE = "Apple Fast Charge",

  // Standard protocols
  BC_1_2 = "BC 1.2",
  Samsung_AFC = "Samsung AFC",
  Huawei_SCP = "Huawei SCP",
}

/**
 * Connector types for charging ports
 */
export enum ConnectorType {
  USB_C = "USB-C",
  USB_A = "USB-A",
  USB_MICRO = "Micro-USB",
  USB_MINI = "Mini-USB",
  LIGHTNING = "Lightning",
  MAGSAFE = "MagSafe",
  MAGSAFE_2 = "MagSafe 2",
  PROPRIETARY = "Proprietary",
}

/**
 * Brand names for charger manufacturers
 */
export enum Brand {
  APPLE = "Apple",
  ANKER = "Anker",
  XIAOMI = "Xiaomi",
  HUAWEI = "Huawei",
  SAMSUNG = "Samsung",
  OPPO = "OPPO",
  VIVO = "vivo",
  ONEPLUS = "OnePlus",
  BASEUS = "Baseus",
  UGREEN = "UGREEN",
  BELKIN = "Belkin",
  AUKEY = "Aukey",
  RAVPOWER = "RAVPower",
  MOTOROLA = "Motorola",
  SONY = "Sony",
  LG = "LG",
  CUKTECH = "CUKTECH",
  HONOR = "HONOR",
  OTHER = "Other",
}

/**
 * Power rating information
 */
export interface PowerRating {
  /** Maximum power output in Watts */
  maxPower: number;
  /** Supported power configurations */
  configurations: PowerConfiguration[];
}

/**
 * Individual power configuration
 */
export interface PowerConfiguration {
  /** Voltage in Volts */
  voltage: number;
  /** Current in Amps */
  current: number;
  /** Power in Watts (calculated as voltage × current) */
  power: number;
}

/**
 * Physical specifications
 */
export interface PhysicalSpecs {
  /** Width in mm */
  width?: number;
  /** Height in mm */
  height?: number;
  /** Depth/length in mm */
  depth?: number;
  /** Weight in grams */
  weight?: number;
  /** Color options */
  colors?: string[];
}

/**
 * Charger interface defining all properties of a charging adapter
 */
export interface Charger {
  /** Unique identifier */
  id: string;

  /** Brand name */
  brand: Brand | string;

  /** Model name/number */
  model: string;

  /** Display name (combination of brand and model) */
  displayName: string;

  /** Power rating information */
  power: PowerRating;

  /** Supported charging protocols */
  protocols: Protocol[];

  /** Available connector ports */
  ports: ConnectorPort[];

  /** Physical dimensions and weight */
  physicalSpecs?: PhysicalSpecs;

  /** Product images */
  images?: {
    thumbnail?: string;
    main?: string;
    gallery?: string[];
  };

  /** Product description */
  description?: string;

  /** Product features list */
  features?: string[];

  /** Release year */
  releaseYear?: number;

  /** Whether it has GaN (Gallium Nitride) technology */
  isGaN?: boolean;

  /** Whether it supports folding plug */
  hasFoldingPlug?: boolean;

  /** Country/region of manufacture */
  manufacturedIn?: string;

  /** Certification information */
  certifications?: string[];

  /** Price information */
  price?: {
    msrp?: number;
    current?: number;
    currency?: string;
  };

  /** Official product page URL */
  officialUrl?: string;

  /** Purchase URLs */
  purchaseUrls?: {
    official?: string;
    amazon?: string;
    other?: string;
  };

  /** Additional notes */
  notes?: string;

  /** Date added to database */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Connector port with its capabilities
 */
export interface ConnectorPort {
  /** Type of connector */
  type: ConnectorType;
  /** Number of ports of this type */
  count: number;
  /** Maximum power output for this port */
  maxPower?: number;
  /** Supported protocols for this port */
  protocols?: Protocol[];
  /** Color of the port (for identification) */
  color?: string;
  /** Whether ports are shared (power splits between them) */
  isShared?: boolean;
}

/**
 * Filter options for searching chargers
 */
export interface ChargerFilter {
  /** Filter by brand */
  brands?: (Brand | string)[];

  /** Filter by minimum power */
  minPower?: number;

  /** Filter by maximum power */
  maxPower?: number;

  /** Filter by protocols */
  protocols?: Protocol[];

  /** Filter by connector types */
  connectorTypes?: ConnectorType[];

  /** Filter by GaN technology */
  isGaN?: boolean;

  /** Filter by release year */
  year?: number;

  /** Search text for brand or model */
  searchQuery?: string;
}

/**
 * Sort options for charger listings
 */
export enum SortOption {
  POWER_DESC = "power_desc",
  POWER_ASC = "power_asc",
  BRAND_ASC = "brand_asc",
  BRAND_DESC = "brand_desc",
  NEWEST = "newest",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
}

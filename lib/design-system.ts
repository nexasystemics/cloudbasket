/**
 * cloudbasket Design System
 * FILE: lib/design-system.ts
 *
 * Single source of truth for all design tokens.
 * POD + Affiliate Aggregator — Indian & Global market.
 *
 * DO NOT import external resources from this file.
 * DO NOT store credentials or secrets here.
 * All values are pure TypeScript constants — zero runtime side effects.
 */

// ---------------------------------------------------------------------------
// COLOR PALETTE
// ---------------------------------------------------------------------------

export const colors = {
  /**
   * Primary Brand — Sky Blue #039BE5
   * Use for: navigation, links, primary actions, brand identity
   */
  sky: {
    '50':  '#E1F8FF',
    '100': '#B3EEFF',
    '200': '#80E3FF',
    '300': '#4DD8FF',
    '400': '#26CFFF',
    '500': '#03C4F0',
    '600': '#039BE5', // ← base brand primary
    '700': '#0277BD',
    '800': '#015C94',
    '900': '#01426B',
  },

  /**
   * CTA / Action — Deep Orange #E65100
   * Use for: buy buttons, add-to-cart, discount labels, urgent CTAs
   */
  orange: {
    '50':  '#FFF0E6',
    '100': '#FFD6B8',
    '200': '#FFB985',
    '300': '#FF9C52',
    '400': '#FF8328',
    '500': '#E65100', // ← base CTA / action
    '600': '#CC4800',
    '700': '#B33F00',
    '800': '#993600',
    '900': '#802D00',
  },

  /**
   * Accent / Creative — Yellow-Gold #F5C518
   * Use for: star ratings, affiliate badges, featured highlights, trending tags
   */
  gold: {
    '50':  '#FFFDE7',
    '100': '#FFF9C4',
    '200': '#FFF59D',
    '300': '#FFF176',
    '400': '#FFEE58',
    '500': '#F5C518', // ← base accent / creative
    '600': '#DDB015',
    '700': '#C49B12',
    '800': '#AC870F',
    '900': '#93720C',
  },

  /**
   * Success / Confirmation — Emerald Green #1B5E20
   * Use for: order confirmed, in-stock, free shipping, success toasts
   */
  emerald: {
    '50':  '#E8F5E9',
    '100': '#C8E6C9',
    '200': '#A5D6A7',
    '300': '#81C784',
    '400': '#66BB6A',
    '500': '#4CAF50',
    '600': '#43A047',
    '700': '#388E3C',
    '800': '#2E7D32',
    '900': '#1B5E20', // ← base success / confirmation
  },

  /**
   * Text / Footer — Dark Charcoal #36454F
   * Use for: body text, headings, footer background, metadata
   */
  charcoal: {
    '50':  '#ECEFF1',
    '100': '#CFD8DC',
    '200': '#B0BEC5',
    '300': '#90A4AE',
    '400': '#78909C',
    '500': '#607D8B',
    '600': '#546E7A',
    '700': '#455A64',
    '800': '#36454F', // ← base text / footer
    '900': '#263238',
  },

  /**
   * Neutral Greys — for layouts, dividers, placeholders
   */
  neutral: {
    '0':   '#FFFFFF',
    '50':  '#FAFAFA',
    '100': '#F5F5F5',
    '200': '#EEEEEE',
    '300': '#E0E0E0',
    '400': '#BDBDBD',
    '500': '#9E9E9E',
    '600': '#757575',
    '700': '#616161',
    '800': '#424242',
    '900': '#212121',
    '950': '#121212',
  },

  /**
   * Error / Destructive — Red
   */
  red: {
    '50':  '#FFEBEE',
    '100': '#FFCDD2',
    '200': '#EF9A9A',
    '300': '#E57373',
    '400': '#EF5350',
    '500': '#F44336',
    '600': '#E53935',
    '700': '#D32F2F',
    '800': '#C62828',
    '900': '#B71C1C',
  },

  /**
   * Warning — Amber
   */
  amber: {
    '50':  '#FFF8E1',
    '100': '#FFECB3',
    '200': '#FFE082',
    '300': '#FFD54F',
    '400': '#FFCA28',
    '500': '#FFC107',
    '600': '#FFB300',
    '700': '#FFA000',
    '800': '#FF8F00',
    '900': '#FF6F00',
  },

  /** Pure utility tokens */
  white:       '#FFFFFF',
  black:       '#000000',
  transparent: 'transparent',
} as const

// ---------------------------------------------------------------------------
// SEMANTIC ALIASES
// Semantic tokens map intent → base color value.
// Always prefer semantic tokens in components over raw color values.
// ---------------------------------------------------------------------------

export const semantic = {
  /** Core brand identity tokens */
  brand: {
    primary:      colors.sky['600'],      // #039BE5 — Sky Blue
    cta:          colors.orange['500'],   // #E65100 — Deep Orange
    accent:       colors.gold['500'],     // #F5C518 — Yellow-Gold
    success:      colors.emerald['900'],  // #1B5E20 — Emerald Green
    background:   colors.white,          // #FFFFFF
    text:         colors.charcoal['800'],  // #36454F — Dark Charcoal
  },

  /** Surface / background layers */
  surface: {
    base:         colors.white,
    subtle:       colors.neutral['50'],
    muted:        colors.neutral['100'],
    elevated:     colors.white,
    overlay:      colors.neutral['50'],
    inverse:      colors.charcoal['900'],
    brand:        colors.sky['50'],
    ctaLight:     colors.orange['50'],
    accentLight:  colors.gold['50'],
    successLight: colors.emerald['50'],
  },

  /** Text tokens */
  text: {
    primary:    colors.charcoal['800'],
    secondary:  colors.charcoal['600'],
    muted:      colors.charcoal['400'],
    disabled:   colors.neutral['400'],
    inverse:    colors.white,
    link:       colors.sky['600'],
    linkHover:  colors.sky['700'],
    onBrand:    colors.white,
    onCta:      colors.white,
    onAccent:   colors.charcoal['800'],
    onSuccess:  colors.white,
    caption:    colors.charcoal['500'],
    placeholder: colors.neutral['400'],
  },

  /** Border tokens */
  border: {
    subtle:   colors.neutral['200'],
    default:  colors.neutral['300'],
    strong:   colors.neutral['400'],
    focus:    colors.sky['600'],
    brand:    colors.sky['600'],
    cta:      colors.orange['500'],
    error:    colors.red['600'],
    success:  colors.emerald['700'],
  },

  /** Feedback status tokens */
  status: {
    success: {
      background: colors.emerald['50'],
      text:       colors.emerald['900'],
      border:     colors.emerald['300'],
      icon:       colors.emerald['700'],
    },
    warning: {
      background: colors.amber['50'],
      text:       colors.amber['900'],
      border:     colors.amber['300'],
      icon:       colors.amber['700'],
    },
    error: {
      background: colors.red['50'],
      text:       colors.red['800'],
      border:     colors.red['300'],
      icon:       colors.red['600'],
    },
    info: {
      background: colors.sky['50'],
      text:       colors.sky['800'],
      border:     colors.sky['300'],
      icon:       colors.sky['600'],
    },
  },

  /**
   * Commerce-specific tokens — POD + Affiliate platform
   * Use these exclusively for product-related UI elements.
   */
  commerce: {
    // Pricing
    price:            colors.charcoal['800'],
    priceOriginal:    colors.charcoal['400'],    // strikethrough original
    priceSale:        colors.orange['500'],
    discount:         colors.orange['500'],
    discountBg:       colors.orange['50'],

    // Ratings & Reviews
    rating:           colors.gold['500'],
    ratingEmpty:      colors.neutral['300'],
    ratingText:       colors.charcoal['600'],

    // Badges & Tags
    badge:            colors.sky['600'],
    badgeText:        colors.white,
    tag:              colors.sky['50'],
    tagText:          colors.sky['700'],
    tagBorder:        colors.sky['200'],

    // Platform-type indicators
    affiliateBadge:   colors.gold['500'],
    affiliateBadgeText: colors.charcoal['800'],
    podBadge:         colors.sky['600'],
    podBadgeText:     colors.white,

    // Inventory states
    inStock:          colors.emerald['700'],
    outOfStock:       colors.red['600'],
    lowStock:         colors.amber['700'],

    // Shipping & offers
    freeShipping:     colors.emerald['700'],
    freeShippingBg:   colors.emerald['50'],
    flashSale:        colors.orange['500'],
    flashSaleBg:      colors.orange['50'],

    // Discovery labels
    newArrival:       colors.sky['600'],
    newArrivalBg:     colors.sky['50'],
    trending:         colors.gold['600'],
    trendingBg:       colors.gold['50'],
    exclusive:        colors.charcoal['800'],
    exclusiveBg:      colors.charcoal['100'],
    bestSeller:       colors.orange['500'],
    bestSellerBg:     colors.orange['50'],

    // Cart & wishlist
    cartActive:       colors.orange['500'],
    wishlistActive:   colors.red['500'],
    wishlistInactive: colors.neutral['400'],

    // Compare feature
    compareActive:    colors.sky['600'],
    compareInactive:  colors.neutral['300'],
  },
} as const

// ---------------------------------------------------------------------------
// TYPOGRAPHY
// ---------------------------------------------------------------------------

export const typography = {
  /**
   * Font family stacks
   * Note: Fonts must be loaded separately via next/font — this file only
   * defines the stacks. DO NOT add @import or link tags here.
   */
  fontFamily: {
    /** UI body text — Latin + Devanagari fallback */
    sans: [
      'Inter',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
    /** Display headings — marketing, hero, section titles */
    display: [
      'Plus Jakarta Sans',
      'Inter',
      'ui-sans-serif',
      'system-ui',
      'sans-serif',
    ],
    /** Prices, codes, SKUs — fixed-width clarity */
    mono: [
      'JetBrains Mono',
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
    /** Indic / Devanagari script support — Hindi UI copy */
    indic: [
      'Noto Sans Devanagari',
      'Poppins',
      'Inter',
      'sans-serif',
    ],
  },

  /**
   * Font size scale — rem units, base 16px
   */
  fontSize: {
    'xs':   '0.75rem',    // 12px — captions, legal, fine print
    'sm':   '0.875rem',   // 14px — labels, helper text, badges
    'base': '1rem',       // 16px — body, default
    'lg':   '1.125rem',   // 18px — lead text, card titles
    'xl':   '1.25rem',    // 20px — section subheadings
    '2xl':  '1.5rem',     // 24px — page subheadings
    '3xl':  '1.875rem',   // 30px — section headings
    '4xl':  '2.25rem',    // 36px — page headings
    '5xl':  '3rem',       // 48px — hero headings
    '6xl':  '3.75rem',    // 60px — large hero
    '7xl':  '4.5rem',     // 72px — display
    '8xl':  '6rem',       // 96px — display XL
    '9xl':  '8rem',       // 128px — display XXL
  },

  /**
   * Font weight scale
   */
  fontWeight: {
    light:     '300',
    regular:   '400',
    medium:    '500',
    semibold:  '600',
    bold:      '700',
    extrabold: '800',
    black:     '900',
  },

  /**
   * Line height scale
   */
  lineHeight: {
    none:    '1',
    tight:   '1.25',
    snug:    '1.375',
    normal:  '1.5',
    relaxed: '1.625',
    loose:   '2',
  },

  /**
   * Letter spacing scale
   */
  letterSpacing: {
    tighter: '-0.05em',
    tight:   '-0.025em',
    normal:  '0em',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },
} as const

// ---------------------------------------------------------------------------
// SPACING  (4px base grid)
// ---------------------------------------------------------------------------

export const spacing = {
  '0':    '0px',
  '0.5':  '2px',
  '1':    '4px',
  '1.5':  '6px',
  '2':    '8px',
  '2.5':  '10px',
  '3':    '12px',
  '3.5':  '14px',
  '4':    '16px',
  '5':    '20px',
  '6':    '24px',
  '7':    '28px',
  '8':    '32px',
  '9':    '36px',
  '10':   '40px',
  '11':   '44px',
  '12':   '48px',
  '14':   '56px',
  '16':   '64px',
  '20':   '80px',
  '24':   '96px',
  '28':   '112px',
  '32':   '128px',
  '36':   '144px',
  '40':   '160px',
  '44':   '176px',
  '48':   '192px',
  '52':   '208px',
  '56':   '224px',
  '60':   '240px',
  '64':   '256px',
  '72':   '288px',
  '80':   '320px',
  '96':   '384px',
  '128':  '512px',
} as const

// ---------------------------------------------------------------------------
// BORDER RADIUS
// ---------------------------------------------------------------------------

export const radii = {
  none:  '0px',
  xs:    '2px',
  sm:    '4px',
  md:    '6px',
  lg:    '8px',
  xl:    '12px',
  '2xl': '16px',
  '3xl': '24px',
  '4xl': '32px',
  full:  '9999px',
} as const

// ---------------------------------------------------------------------------
// SHADOWS  (charcoal-tinted — #36454F — for brand cohesion)
// ---------------------------------------------------------------------------

export const shadows = {
  none:  'none',
  xs:    '0 1px 2px 0 rgba(54, 69, 79, 0.06)',
  sm:    '0 1px 3px 0 rgba(54, 69, 79, 0.10), 0 1px 2px -1px rgba(54, 69, 79, 0.10)',
  md:    '0 4px 6px -1px rgba(54, 69, 79, 0.10), 0 2px 4px -2px rgba(54, 69, 79, 0.10)',
  lg:    '0 10px 15px -3px rgba(54, 69, 79, 0.10), 0 4px 6px -4px rgba(54, 69, 79, 0.10)',
  xl:    '0 20px 25px -5px rgba(54, 69, 79, 0.10), 0 8px 10px -6px rgba(54, 69, 79, 0.10)',
  '2xl': '0 25px 50px -12px rgba(54, 69, 79, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(54, 69, 79, 0.06)',
  /** Brand-tinted card hover shadow — sky blue glow */
  brand: '0 4px 14px 0 rgba(3, 155, 229, 0.18)',
  /** CTA button glow — orange pulse */
  cta:   '0 4px 14px 0 rgba(230, 81, 0, 0.32)',
  /** Gold shimmer — featured / affiliate highlight */
  gold:  '0 4px 14px 0 rgba(245, 197, 24, 0.30)',
} as const

// ---------------------------------------------------------------------------
// BREAKPOINTS
// ---------------------------------------------------------------------------

export const breakpoints = {
  sm:    '640px',
  md:    '768px',
  lg:    '1024px',
  xl:    '1280px',
  '2xl': '1536px',
} as const

// ---------------------------------------------------------------------------
// Z-INDEX
// ---------------------------------------------------------------------------

export const zIndex = {
  hide:      -1,
  base:       0,
  raised:    10,
  dropdown: 100,
  sticky:   200,
  banner:   250,
  overlay:  300,
  modal:    400,
  popover:  500,
  tooltip:  600,
  toast:    700,
  top:      999,
} as const

// ---------------------------------------------------------------------------
// TRANSITIONS
// ---------------------------------------------------------------------------

export const transitions = {
  duration: {
    instant: '0ms',
    fast:    '100ms',
    normal:  '200ms',
    slow:    '300ms',
    slower:  '500ms',
    lazy:    '700ms',
  },
  easing: {
    linear: 'linear',
    in:     'cubic-bezier(0.4, 0, 1, 1)',
    out:    'cubic-bezier(0, 0, 0.2, 1)',
    inOut:  'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  /** Prebuilt CSS `transition` shorthand values */
  preset: {
    default:   'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast:      'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow:      'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors:    'color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity:   'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow:    'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ---------------------------------------------------------------------------
// COMPONENT TOKENS
// Pre-encoded design decisions for consistent component construction.
// Keeps component files thin — no magic numbers scattered across the codebase.
// ---------------------------------------------------------------------------

export const components = {
  /** Button sizes and visual decisions */
  button: {
    borderRadius: radii.lg,
    fontWeight:   typography.fontWeight.semibold,
    transition:   transitions.preset.default,
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
    height: {
      sm: spacing['8'],    // 32px
      md: spacing['10'],   // 40px
      lg: spacing['12'],   // 48px
      xl: spacing['14'],   // 56px
    },
    padding: {
      sm: `${spacing['1.5']} ${spacing['3']}`,
      md: `${spacing['2']} ${spacing['5']}`,
      lg: `${spacing['3']} ${spacing['6']}`,
      xl: `${spacing['4']} ${spacing['8']}`,
    },
  },

  /** Product / content cards */
  card: {
    borderRadius:  radii['2xl'],
    shadow:        shadows.sm,
    shadowHover:   shadows.brand,
    padding:       spacing['4'],
    paddingLg:     spacing['6'],
    border:        `1px solid ${semantic.border.subtle}`,
    background:    semantic.surface.base,
    transition:    transitions.preset.shadow,
  },

  /** Pill badges — new, trending, affiliate, etc. */
  badge: {
    borderRadius: radii.full,
    fontWeight:   typography.fontWeight.semibold,
    fontSize:     typography.fontSize.xs,
    paddingX:     spacing['2'],
    paddingY:     spacing['0.5'],
    lineHeight:   typography.lineHeight.none,
  },

  /** Form inputs */
  input: {
    borderRadius:  radii.lg,
    height:        spacing['10'],
    fontSize:      typography.fontSize.base,
    paddingX:      spacing['3'],
    paddingY:      spacing['2'],
    border:        `1px solid ${semantic.border.default}`,
    borderFocus:   `1px solid ${semantic.border.focus}`,
    background:    semantic.surface.base,
    transition:    transitions.preset.colors,
  },

  /** Product card — commerce specific */
  productCard: {
    borderRadius:   radii['2xl'],
    shadow:         shadows.sm,
    shadowHover:    shadows.brand,
    imageAspectRatio: '1 / 1',
    padding:        spacing['4'],
    transition:     `${transitions.preset.shadow}, ${transitions.preset.transform}`,
  },

  /** Top navigation bar */
  navbar: {
    height:      spacing['16'],           // 64px
    heightMobile: spacing['14'],          // 56px
    background:  semantic.brand.primary,  // Sky Blue
    text:        semantic.text.inverse,
    shadow:      shadows.md,
    zIndex:      zIndex.sticky,
  },

  /** Site footer */
  footer: {
    background:  semantic.brand.text,     // Dark Charcoal #36454F
    text:        colors.neutral['200'],
    textMuted:   colors.neutral['400'],
    linkColor:   colors.sky['400'],
    linkHover:   colors.sky['300'],
    borderTop:   `1px solid ${colors.charcoal['700']}`,
    padding:     `${spacing['12']} ${spacing['6']}`,
  },

  /** Modals and drawers */
  modal: {
    backdropColor:  'rgba(54, 69, 79, 0.60)',
    borderRadius:   radii['3xl'],
    shadow:         shadows['2xl'],
    padding:        spacing['6'],
    background:     semantic.surface.base,
    zIndex:         zIndex.modal,
  },

  /** Toast notifications */
  toast: {
    borderRadius: radii.xl,
    shadow:       shadows.lg,
    padding:      `${spacing['3']} ${spacing['4']}`,
    fontSize:     typography.fontSize.sm,
    fontWeight:   typography.fontWeight.medium,
    zIndex:       zIndex.toast,
  },

  /** Search bar */
  searchBar: {
    borderRadius:      radii.full,
    height:            spacing['12'],    // 48px
    fontSize:          typography.fontSize.base,
    background:        semantic.surface.base,
    border:            `2px solid ${semantic.border.default}`,
    borderFocus:       `2px solid ${semantic.brand.primary}`,
    shadow:            shadows.sm,
    shadowFocus:       shadows.brand,
    paddingX:          spacing['5'],
    transition:        transitions.preset.default,
  },

  /** Price display — for product listings */
  price: {
    fontFamily:    typography.fontFamily.mono,
    fontWeight:    typography.fontWeight.bold,
    color:         semantic.commerce.price,
    colorOriginal: semantic.commerce.priceOriginal,
    colorSale:     semantic.commerce.priceSale,
    fontSize: {
      sm:  typography.fontSize.sm,
      md:  typography.fontSize.base,
      lg:  typography.fontSize.xl,
      xl:  typography.fontSize['2xl'],
      hero: typography.fontSize['4xl'],
    },
  },
} as const

// ---------------------------------------------------------------------------
// THEME  (unified export — single import point for all tokens)
// ---------------------------------------------------------------------------

export const theme = {
  colors,
  semantic,
  typography,
  spacing,
  radii,
  shadows,
  breakpoints,
  zIndex,
  transitions,
  components,
} as const

// ---------------------------------------------------------------------------
// TYPE EXPORTS  (TypeScript strict — derive from values, not hand-written)
// ---------------------------------------------------------------------------

export type Colors              = typeof colors
export type Semantic            = typeof semantic
export type Typography          = typeof typography
export type Spacing             = typeof spacing
export type Radii               = typeof radii
export type Shadows             = typeof shadows
export type Breakpoints         = typeof breakpoints
export type ZIndex              = typeof zIndex
export type Transitions         = typeof transitions
export type Components          = typeof components
export type Theme               = typeof theme

export type SkyScale            = keyof typeof colors.sky
export type OrangeScale         = keyof typeof colors.orange
export type GoldScale           = typeof colors.gold
export type EmeraldScale        = keyof typeof colors.emerald
export type CharcoalScale       = keyof typeof colors.charcoal
export type NeutralScale        = keyof typeof colors.neutral

export type SpacingKey          = keyof typeof spacing
export type FontSizeKey         = keyof typeof typography.fontSize
export type FontWeightKey       = keyof typeof typography.fontWeight
export type LineHeightKey       = keyof typeof typography.lineHeight
export type LetterSpacingKey    = keyof typeof typography.letterSpacing
export type RadiusKey           = keyof typeof radii
export type ShadowKey           = keyof typeof shadows
export type BreakpointKey       = keyof typeof breakpoints
export type ZIndexKey           = keyof typeof zIndex
export type TransitionDuration  = keyof typeof transitions.duration
export type TransitionEasing    = keyof typeof transitions.easing
export type TransitionPreset    = keyof typeof transitions.preset

export default theme

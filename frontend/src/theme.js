//  primary     #C45D3E   → bg-primary / text-primary
//  primary-dk  #713F32   → bg-primary-dk / text-primary-dk
//  surface     #FAF5F0   → bg-surface
//  canvas      #FFFFFF   → bg-canvas
//  muted       #EAD7C8   → border-muted / bg-muted
//  ink         #713F32   → text-ink

// ── Navbar / Header ──────────────────────────────────────────────
export const navbarBg       = 'bg-primary-dk'                   // header bar bg
export const navbarBorder   = 'border-b border-muted/25'

// ── Sidebar ──────────────────────────────────────────────────────
export const sidebarBg      = 'bg-canvas border-r border-muted'
export const navLinkActive  = 'bg-muted/35 text-primary font-semibold border-l-3 border-primary shadow-2xs'
export const navLinkIdle    = 'text-ink/80 hover:bg-surface hover:text-ink font-medium'

// ── Page / Layout ────────────────────────────────────────────────
export const pageBg         = 'bg-surface text-ink'

// ── Cards / Panels ───────────────────────────────────────────────
export const card           = 'bg-canvas border border-muted rounded-2xl shadow-[0_2px_8px_-2px_rgba(113,63,50,0.05)]'
export const cardSm         = 'bg-canvas border border-muted rounded-2xl shadow-[0_4px_20px_-4px_rgba(113,63,50,0.06)]'

// ── Inputs ───────────────────────────────────────────────────────
export const inputCls       = 'w-full px-3.5 py-2.5 text-sm bg-canvas border border-muted rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150'
export const selectCls      = 'w-full px-3.5 py-2.5 text-sm bg-canvas border border-muted rounded-xl text-ink focus:outline-none focus:border-primary transition-all duration-150 cursor-pointer'
export const labelCls       = 'block text-sm font-semibold text-ink mb-1.5'

// ── Buttons ──────────────────────────────────────────────────────
export const btnPrimary     = 'bg-primary hover:bg-primary-dk text-white font-semibold rounded-xl shadow-xs hover:shadow transition-all duration-150 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/25'
export const btnSecondary   = 'bg-canvas border border-muted text-ink hover:bg-surface hover:border-primary/50 font-semibold rounded-xl transition-all duration-150 cursor-pointer shadow-2xs'
export const btnGhost       = 'text-primary hover:text-primary-dk font-semibold hover:underline transition-colors cursor-pointer'

// ── Badges / Pills ───────────────────────────────────────────────
export const pillNeutral    = 'bg-surface border border-muted text-ink'
export const pillAccent     = 'bg-primary/10 border border-primary/30 text-primary'
export const pillDark       = 'bg-primary-dk/10 border border-primary-dk/30 text-primary-dk'

// ── Table ────────────────────────────────────────────────────────
export const tableHeader    = 'bg-surface border-b border-muted'
export const tableHeaderCell = 'text-left px-5 py-3.5 text-xs font-bold text-ink uppercase tracking-wider'
export const tableRowHover  = 'hover:bg-surface/60 transition-colors'
export const tableDivide    = 'divide-y divide-muted/50'

// ── Links ────────────────────────────────────────────────────────
export const link           = 'font-semibold text-primary hover:text-primary-dk hover:underline transition-colors'

// ── Welcome Banner (gradient) ────────────────────────────────────
export const welcomeBanner  = 'bg-gradient-to-r from-primary-dk via-[#8C4736] to-primary text-white shadow-lg shadow-primary-dk/15'

# NETRIX Design System & Identity
**Product:** NETRIX  
**Brand Identity:** Connect Beyond Limits.  
**Publisher:** PB Tech Zone  

---

## 1. Design Philosophy

NETRIX delivers a distinctive, high-trust visual language tailored for IT leaders, systems administrators, and enterprise operations centers. It rejects generic web app aesthetics, hyper-saturated consumer gradients, and unstyled admin template tropes.

### Core Visual Attributes:
- **High-Density Utility:** Information is organized with clear visual hierarchy, scannable data grids, and purposeful telemetry indicators.
- **Refined Industrial Palette:** Deep midnight slate, disciplined cobalt accents, crisp border delineations, and semantic operational status badges.
- **Restrained Motion:** Smooth micro-interactions (150ms–250ms ease-out) communicating state changes without distracting system operators.
- **Accessible & Scalable:** Fully compliant with WCAG 2.2 Level AA contrast requirements across both Dark and Light operational modes.

---

## 2. Color Tokens

### Primary Brand Palette
| Token Name | Hex Code | Purpose |
|---|---|---|
| `--netrix-brand-950` | `#0B0F19` | Deepest foundation background (Dark mode) |
| `--netrix-brand-900` | `#0F172A` | Elevated surface / Sidebar header |
| `--netrix-brand-800` | `#1E293B` | Card surfaces & modal containers |
| `--netrix-brand-700` | `#334155` | Borders, subtle dividers, inactive tabs |
| `--netrix-brand-500` | `#2563EB` | Active interactive elements, buttons |
| `--netrix-brand-400` | `#3B82F6` | Primary brand accent, focus rings |
| `--netrix-brand-300` | `#60A5FA` | Secondary accents, chart series 1 |

### Operational Telemetry Status Colors
| Status Token | Hex Code | Representation |
|---|---|---|
| `--netrix-status-online` | `#10B981` | Device Online / Active Session / Healthy |
| `--netrix-status-offline` | `#64748B` | Device Offline / Inactive / Deactivated |
| `--netrix-status-busy` | `#F59E0B` | In Active Remote Session / High CPU / Pending |
| `--netrix-status-danger` | `#EF4444` | Terminated Session / Auth Failed / Error |
| `--netrix-status-info` | `#06B6D4` | Diagnostic Notice / Update Ready |

---

## 3. Typography

- **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Code/ID Family:** `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` (Used for NETRIX 9-digit Device IDs, IP addresses, session tickets, and MAC addresses).

### Scale & Hierarchy:
- **Display 1:** `2.0rem (32px)` / Bold 700 / Tight `-0.025em`
- **Page Heading:** `1.5rem (24px)` / SemiBold 600
- **Section Heading:** `1.125rem (18px)` / SemiBold 600
- **Card Title / Subheading:** `1.0rem (16px)` / Medium 500
- **Body Regular:** `0.875rem (14px)` / Regular 400 / Line height 1.5
- **Data Table / Compact:** `0.8125rem (13px)` / Regular 400
- **Badge / Metadata / Label:** `0.75rem (12px)` / SemiBold 600 / Tracking `0.025em`

---

## 4. Spacing, Elevation & Corner Radii

- **Border Radius:**
  - Card & Container: `8px` (`0.5rem`)
  - Button & Form Input: `6px` (`0.375rem`)
  - Badge & Tag: `4px` (`0.25rem`)
  - Circular Avatar & Indicator: `9999px`
- **Box Shadows (Elevation):**
  - Level 1 (Card/Container): `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`
  - Level 2 (Dropdown/Popover): `0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
  - Level 3 (Modal/Drawer): `0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)`

---

## 5. Theme Modes (Dark, Light, System)

The design system supports dynamic switching via the `data-bs-theme` or `data-netrix-theme` attribute on the root `<html>` document.
- In **Dark Mode (Default)**, surfaces are deep graphite/slate with crisp luminous contrast for prolonged operations room viewing.
- In **Light Mode**, surfaces convert to clean architectural whites (`#FFFFFF`), whisper greys (`#F8FAFC`), and charcoal typography (`#0F172A`) while retaining brand identity and contrast.


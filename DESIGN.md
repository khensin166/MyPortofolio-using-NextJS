# Kenan Portfolio — Style Reference
> Interactive developer portfolio with gamified aesthetics. A dark canvas where neon yellow accents signal action, accompanied by subtle matrix-like forest themes and dynamic glitch effects.

**Themes:** dark (default), light, forest

This portfolio uses a modern, developer-centric design language: a primary dark canvas, high-contrast primary yellow accents, and strict geometric structural elements. The interface feels like a premium developer tool infused with personal branding. Typography relies entirely on the versatile **Inter** family to maintain maximum readability and a clean, unopinionated foundation. Surfaces are elevated through subtle background color shifts (`background` → `card` → `popover`) and 1px hairline borders, completely avoiding heavy drop shadows.

Color appears systematically: a vibrant yellow (`#fbe400`) exclusively for primary actions/toploaders, while contribution heatmaps use a graded system to indicate activity intensity. The whole system reads as 'professional developer who cares deeply about detail and aesthetics'.

## 1. Tokens — Colors

### Primary Palette (Tailwind Variables)
| Name | Value | Token | Role |
|------|-------|-------|------|
| Primary Yellow | `hsl(45 92% 47%)` / `#fbe400` | `--primary` | The single primary accent. Used for CTA buttons, the NextTopLoader, and critical highlighted information. |
| Primary Foreground | `hsl(222.2 47.4% 11.2%)` | `--primary-foreground` | Very dark text used on top of the Primary Yellow for maximum readability. |
| Destructive Red | `hsl(0 62.8% 30.6%)` (Dark) | `--destructive` | Used strictly for error states or destructive actions. |

### Contribution Heatmap (GitHub Style)
Used for the custom activity/contribution graphs:
| Level | Role | Token |
|-------|------|-------|
| Level 1 | Base activity (Lightest) | `--contribution-1` |
| Level 2 | Low-medium activity | `--contribution-2` |
| Level 3 | Medium-high activity | `--contribution-3` |
| Level 4 | Peak activity (Solid) | `--contribution-4` |

### Surfaces (Dark Theme - Default)
| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas | `hsl(222.2 84% 4.9%)` | `--background` | The absolute background of the page. |
| Card | `hsl(222.2 84% 4.9%)` | `--card` | Elevated surface for feature cards and panels. Matches background but delineated by borders. |
| Popover | `hsl(222.2 84% 4.9%)` | `--popover` | Highest elevation surface (dropdowns, tooltips). |
| Border | `hsl(217.2 32.6% 17.5%)` | `--border` | The 1px hairline color used to separate all surfaces. |
| Muted | `hsl(217.2 32.6% 17.5%)` | `--muted` | Secondary surface for inactive tabs or subtle backgrounds. |

### Surfaces (Forest Theme)
A special theme triggered by the `.forest` variant.
| Name | Value | Role |
|------|-------|------|
| Forest Canvas | `hsl(120 100% 6%)` | A very deep, near-black green (`#001f00` equivalent). |
| Forest Foreground | `hsl(49 77% 65%)` | A muted yellow-gold for text, creating a retro terminal/matrix feel. |
| Forest Border | `hsl(120 50% 15%)` | Subtle dark green borders for component separation. |

---

## 2. Tokens — Typography

### Primary Font: Inter
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (ExtraBold)
- **Role:** The singular workhorse font for the entire portfolio. Used for headlines, body copy, navigation, and badges.

*(Note: No external monospace fonts are forced globally. If terminal/code aesthetics are needed, rely strictly on standard Tailwind `font-mono` utilities so the core styling remains lightweight).*

---

## 3. Tokens — Spacing & Shapes

**Base unit:** 0.5rem (8px)

### Border Radius
| Element | Token | Value | Note |
|---------|-------|-------|------|
| Global Radius | `--radius` | `0.5rem` / 8px | The universal standard for cards, inputs, and buttons. |

### Layout & Animations
- **No Drop Shadows:** Elevation is communicated via 1px solid borders (`border-border`) and background color changes. Do not use generic Tailwind shadows (e.g., `shadow-md`, `shadow-lg`).
- **Hexagon Clip-path:** A specialized `.hexagon` class is available for distinct geometric image framing or badges.
- **Micro-Animations:** Use the pre-configured keyframes (`shine`, `gradient`, `glitch`, `star-movement-bottom`, `star-movement-top`) for hover effects or hero section backgrounds. Do not overuse them on readable text.

---

## 4. Components

### Badges / Tags
**Role:** Tech stack pills, categories.
Muted background (`bg-muted`) with muted foreground text (`text-muted-foreground`). 1px border (`border-border`). Radius 8px (`rounded-md`).

### Feature Cards / Projects
**Role:** Displaying projects or blog posts.
Background relies on `--card`. Must have a 1px border (`border border-border`). Hover states can utilize a slight background shift (e.g., `hover:bg-muted/50`) or the `shine` animation overlay. **No hover drop-shadows.**

### Primary Buttons
**Role:** Main call-to-actions (e.g., "Contact Me", "View Project").
Background `--primary`, text `--primary-foreground`. Radius 8px (`rounded-md`). Keep the text bold (weight 600 or 700) using Inter.

---

## 5. AI Assistant Do's and Don'ts

### Do
- **Do use CSS Variables:** Always use Tailwind variables like `bg-primary`, `bg-card`, `text-muted-foreground`.
- **Do respect the 8px radius:** Stick to `rounded-md` (which maps to the 0.5rem `--radius` variable) for UI elements.
- **Do use hairline borders:** Separate sections and cards using `border-t border-border` or `border border-border`.

### Don't
- **Don't hardcode colors:** Never use colors outside the system (e.g., `bg-blue-500`, `text-green-400`), unless it is a specific brand logo color (like GitHub black or React blue).
- **Don't use generic shadows:** Never add `shadow-lg` or `shadow-xl`. The aesthetic relies on flat design separated by subtle lines.
- **Don't introduce new fonts:** Do not import new Google fonts. Use `Inter` for everything, or `font-mono` if absolutely necessary for a code block.
- **Don't use extreme border radii:** Avoid `rounded-full` or `rounded-[32px]` for structural elements (cards, containers). `rounded-full` is strictly reserved for user avatars/profile pictures.

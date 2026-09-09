# Kenan Portfolio — Style Reference
> Interactive developer portfolio with gamified aesthetics. A dark forest canvas where Lime Pulse accents signal action, Forest Depths provides depth, and Snow White surfaces breathe clarity.

**Themes:** light (default) | dark | orest

---

## 1. Color Palette

### New Forest Color System

| Token | Value | CSS Variable | Role |
|-------|-------|-------------|------|
| Forest Depths | #1c3a13 | --color-forest-depths | Primary brand — Forest theme background, near-black ink |
| Lime Pulse | #d3fa99 | --color-lime-pulse | Glowing primary accent — filled CTAs, active indicators, ring |
| Sage Moss | #757c5d | --color-sage-moss | Muted accent — subdued labels, variant elements |
| Olive Gold | #9f995b | --color-olive-gold | Yellow-green wash — decorative bands, soft emphasis |
| Eucalyptus | #698e79 | --color-eucalyptus | Cooler green-blue accent — --accent in Forest theme |
| Snow White | #fcfcf7 | --color-snow-white | Page canvas / foreground text in Forest — warm off-white |
| Warm Stone | #eeeee9 | --color-warm-stone | Secondary surface — alternating panels, subtle separators |
| Frosted Glass | #c4c7c4 | --color-frosted-glass | Translucent overlay — ackdrop-filter: blur surfaces |
| Ash | #b3b3b3 | --color-ash | Disabled states, muted borders |
| Pewter | #666666 | --color-pewter | Secondary body text, captions |
| Ink | #000000 | --color-ink | Max contrast text on light sections (use sparingly) |

> **In Light/Dark mode**: primary accent remains **yellow** (#fbe400 / --primary: 45 92% 47%).  
> **In Forest mode**: primary switches to **Lime Pulse** (#d3fa99), background to **Forest Depths** (#1c3a13).

### Theme CSS Variable Mapping

| Token | Light | Dark | Forest |
|-------|-------|------|--------|
| --background | white | near-black blue | Forest Depths |
| --foreground | dark text | light text | Snow White |
| --primary | Yellow (#fbe400) | Yellow (#fbe400) | Lime Pulse (#d3fa99) |
| --primary-foreground | dark | dark | Forest Depths |
| --card | white | near-black | deeper Forest Depths |
| --muted | light gray | dark gray | dark forest green |
| --accent | light gray | dark gray | Eucalyptus |
| --border | soft gray | dark gray | forest hairline |
| --ring | dark | light | Lime Pulse |

---

## 2. Typography

- **Font Family**: Inter — the ONLY permitted font, loaded from Google Fonts
- **No extra fonts** — do NOT add additional font families

### Scale
| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Hero | 	ext-4xl – 	ext-5xl | 700 | Page title, H1 |
| Section Heading | 	ext-xl – 	ext-2xl | 600 | H2 |
| Card Title | 	ext-base – 	ext-lg | 500–600 | |
| Body | 	ext-sm – 	ext-base | 400 | Default |
| Caption / Label | 	ext-xs | 400–500 | Tags, metadata |

---

## 3. Spacing & Layout

- **Border Radius**: ounded-lg (cards) · ounded-xl (panels) · ounded-full (avatars & pills only)
- **Card Padding**: p-4 minimum
- **Section Gap**: gap-6 – gap-8
- **Layout**: sidebar (left, 1/5 width) + main content (right, 4/5 width)

---

## 4. Elevation & Depth

> **NO drop shadows**. Elevation is communicated through border contrast only.

- ✅ Use order border-border to separate surfaces
- ✅ Use subtle g-secondary or g-card stacking for card-on-background contrast
- ❌ **Never** use shadow-md, shadow-lg, shadow-xl, shadow-2xl

---

## 5. Component Patterns

### Theme Toggle (Pill Segmented Control)
- **Container**: pill ounded-full, g-secondary, order border-border, p-1
- **Items**: 3 options — Sun (Light), Moon (Dark), Leaf (Forest)
- **Active indicator**: motion.div with g-primary, spring animation
- **Tooltip**: z-[10000], absolute, ottom-full, arrow indicator
- **Mobile**: pill hidden in Header — shown inside mobile menu (isOpen)

### Locale Toggle (IntlToggle)
- **Desktop**: pill with flag emoji, spring slide animation
- **Mobile**: single icon button (cycles to next locale on tap)

### Tooltip
- Always z-[10000] — must sit above all UI layers
- pointer-events-none — never blocks clicks
- Centered with left-1/2 -translate-x-1/2

### Cards
- g-card border border-border rounded-lg — no shadows
- Hover: hover:border-primary/50 transition-colors duration-300

### Buttons
- Primary: g-primary text-primary-foreground
- Ghost: order border-border hover:bg-secondary
- Tag/Badge: g-secondary text-secondary-foreground rounded-full text-xs

---

## 6. Animation Principles

- **Micro-animations**: ramer-motion spring for interactive elements
- whileHover={{ scale: 1.05 }} / whileTap={{ scale: 0.95 }}
- Glitch animation on hero elements (see 	ailwind.config.ts keyframes)
- **No** looping background animations on body

---

## 7. Rules & Anti-Patterns

| ❌ Avoid | ✅ Use instead |
|---------|--------------|
| shadow-lg, shadow-xl | order border-border |
| Hardcoded hex colors in components | CSS Variables via Tailwind tokens |
| Non-Inter fonts | Inter only |
| ounded-full on non-avatar/non-pill elements | ounded-lg or ounded-xl |
| Inline style={{ color: '#...' }} for UI | 	ext-primary, 	ext-muted-foreground etc. |
| Brand icon colors (Docker blue, etc.) | Allowed exception — tech icon colors |

# Kinetic Library Design Specification

> Merging the **Kinetic Orange Brutalist** aesthetic with the **Library/Book** theme to create a unified, premium experience for the OrangeCat Portfolio Blog.

---

## 1. Design Philosophy

### Concept: "The Living Archive"

A modern digital library where knowledge is **alive, kinetic, and bold**. The design maintains the scholarly, curated feel of a personal library while injecting energy and movement through brutalist typography and vibrant orange accents.

| Principle | Library Theme | Kinetic Orange | Kinetic Library |
|-----------|---------------|----------------|-----------------|
| **Color** | Stone, cream, dark | Orange #FF4D00, black | Stone base + orange accents |
| **Typography** | Serif italic, scholarly | Massive bold, industrial | Serif for content, bold for impact |
| **Layout** | Book spines, shelves | Raw, edge-to-edge | Structured chaos |
| **Animation** | Subtle, page-like | Aggressive marquee, scroll | Strategic kinetic moments |
| **Tone** | "Welcome to my library" | "Look at this!" | "Explore my curated archive" |

---

## 2. Color System

### Primary Palette

```css
/* Base Colors (from Library theme) */
--kinetic-paper: #f4f1ea;       /* Warm cream paper */
--kinetic-paper-dark: #121212;  /* Night mode paper */
--kinetic-ink: #1c1917;         /* Stone 900 - primary text */
--kinetic-ink-muted: #78716c;   /* Stone 500 - secondary text */

/* Accent Colors (from Kinetic Orange) */
--kinetic-orange: #FF4D00;      /* Primary accent - BOLD */
--kinetic-orange-dark: #CC3D00; /* Hover state */
--kinetic-orange-light: #FF6A2C;/* Highlight */

/* Dark Mode Accent */
--kinetic-red: #991b1b;         /* Red-800 for dark mode accent */
--kinetic-red-glow: #450a0a;    /* Red-950 for backgrounds */

/* Neutral Support */
--kinetic-stone-800: #292524;
--kinetic-stone-700: #44403c;
--kinetic-stone-400: #a8a29e;
--kinetic-stone-200: #e7e5e4;
```

### Usage Guidelines

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `--kinetic-paper` | `--kinetic-paper-dark` |
| Text Primary | `--kinetic-ink` | `stone-200` |
| Text Secondary | `--kinetic-ink-muted` | `stone-400` |
| Accent | `--kinetic-orange` | `--kinetic-red` |
| Accent Background | `orange-50` | `red-950/20` |
| Borders | `stone-300` | `stone-800` |
| Hover States | `--kinetic-orange` | `--kinetic-red` |

---

## 3. Typography System

### Font Stack

```css
--font-display: 'Playfair Display', Georgia, serif;  /* Hero, section titles */
--font-body: 'Pretendard', -apple-system, sans-serif; /* Body text */
--font-mono: 'JetBrains Mono', monospace;            /* Code, labels */
```

### Type Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `kinetic-hero` | `clamp(4rem, 15vw, 12rem)` | 900 | Main hero text |
| `kinetic-section` | `clamp(2rem, 5vw, 4rem)` | 700 | Section headers |
| `kinetic-title` | `1.5rem - 2rem` | 600 | Card titles |
| `kinetic-body` | `1rem` | 400 | Body text |
| `kinetic-caption` | `0.75rem` | 500 | Labels, meta |
| `kinetic-micro` | `0.625rem` | 700 | Tags, tracking-widest |

### Typography Rules

1. **Hero sections**: Use `font-display` with italic for "archival" feel
2. **Section labels**: Use `font-mono` with `tracking-[0.4em] uppercase`
3. **Body content**: Use `font-body` with generous line-height (1.7)
4. **Kinetic moments**: Allow text to be MASSIVE (`15vw+`) for impact

---

## 4. Component Specifications

### 4.1 Unified Navigation

Replace both `AppNavigation` and `ArchivesNavigation` with a single component.

```tsx
// Design: Floating pill navigation with library branding
<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
  {/* Logo Section */}
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-sm bg-kinetic-orange text-white 
                    flex items-center justify-center font-display italic">
      A
    </div>
    <span className="font-display italic text-xl font-bold">
      Archives.
    </span>
  </div>
  
  {/* Nav Items - Pill style from AppNavigation */}
  <div className="flex gap-2 bg-background/80 backdrop-blur-md 
                  rounded-full px-3 py-2 border">
    {navItems.map(item => (
      <Link className="px-4 py-2 rounded-full hover:bg-accent 
                       text-sm font-medium transition-colors">
        {item.label}
      </Link>
    ))}
  </div>
</nav>
```

**Key Features:**
- Floating centered position (from AppNavigation)
- "Archives." branding with orange accent box (from Library theme)
- Pill-shaped nav items with backdrop blur
- Scroll-triggered size reduction
- Orange accent on active state

### 4.2 Kinetic Hero Section

Merge the library hero with kinetic typography.

```tsx
<section className="min-h-screen relative overflow-hidden">
  {/* Animated particles (keep from current) */}
  
  <div className="container mx-auto px-4 pt-32">
    {/* Section Label */}
    <motion.span className="text-kinetic-micro tracking-[0.4em] uppercase 
                            text-kinetic-orange font-mono">
      Volume I: The Beginning
    </motion.span>
    
    {/* KINETIC HERO TEXT */}
    <h1 className="font-display font-black text-[15vw] leading-[0.85] 
                   uppercase tracking-tighter">
      The
      <br />
      <motion.span 
        className="italic text-kinetic-orange"
        animate={{ opacity: [1, 0.7, 1] }}
      >
        Archivist's
      </motion.span>
      <br />
      Logs.
    </h1>
    
    {/* Subtitle */}
    <p className="max-w-md text-kinetic-ink-muted mt-8">
      지식은 쌓이는 것이 아니라 정리되는 것입니다.
    </p>
    
    {/* CTA Button */}
    <button className="mt-8 px-8 py-4 bg-kinetic-orange text-white 
                       uppercase tracking-widest text-xs font-bold
                       hover:bg-kinetic-orange-dark transition-colors">
      Explore Stacks
    </button>
  </div>
  
  {/* Scroll indicator with rotation (from Kinetic reference) */}
  <motion.div 
    style={{ rotate }}
    className="absolute bottom-8 right-8 w-24 h-24"
  >
    <CircularText text="SCROLL DOWN • SCROLL DOWN •" />
  </motion.div>
</section>
```

### 4.3 Marquee Section (NEW)

Add kinetic energy between sections.

```tsx
<section className="py-8 bg-kinetic-ink overflow-hidden -skew-y-1">
  <Marquee direction={1} className="text-kinetic-orange">
    KNOWLEDGE • CODE • DESIGN • ARCHITECTURE •
  </Marquee>
  <Marquee direction={-1} className="text-white opacity-80">
    REACT • TYPESCRIPT • NEXT.JS • RUST •
  </Marquee>
</section>
```

**Implementation:**
```tsx
const Marquee = ({ text, direction = 1 }) => (
  <div className="flex overflow-hidden whitespace-nowrap py-4">
    <motion.div
      className="flex gap-8"
      animate={{ x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
    >
      {[...Array(8)].map((_, i) => (
        <span key={i} className="text-[8vw] font-black uppercase 
                                 leading-none tracking-tighter font-display">
          {text}
        </span>
      ))}
    </motion.div>
  </div>
);
```

### 4.4 Featured Posts (Book Shelf with Kinetic Hover)

Keep the book-spine metaphor but add kinetic hover effects.

```tsx
<motion.article
  whileHover={{ y: -30, transition: { type: "spring" } }}
  className="relative h-[450px] bg-stone-800 p-6 cursor-pointer group"
>
  {/* Volume label */}
  <span className="text-kinetic-micro text-kinetic-orange">
    Vol. {post.id}
  </span>
  
  {/* Arrow reveal on hover (from Kinetic reference) */}
  <motion.div 
    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100
               group-hover:rotate-45 transition-all"
  >
    <ArrowUpRight className="w-8 h-8 text-kinetic-orange" />
  </motion.div>
  
  {/* Content */}
  <div className="absolute bottom-6 left-6 right-6">
    <span className="text-kinetic-micro text-stone-500 uppercase">
      {post.category}
    </span>
    <h3 className="text-2xl font-display text-white mt-2 
                   group-hover:underline decoration-kinetic-orange 
                   underline-offset-8">
      {post.title}
    </h3>
  </div>
</motion.article>
```

### 4.5 Skills/Services Section (Kinetic Style)

Replace current grid with interactive list from Kinetic reference.

```tsx
<section className="bg-kinetic-ink py-32">
  <h2 className="font-display text-[10vw] text-white uppercase font-black">
    Services
  </h2>
  
  {services.map((service, i) => (
    <div className="group border-t border-stone-800 py-12 
                    hover:bg-white/5 transition-colors cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-8">
          <span className="text-kinetic-orange font-mono">
            ({`0${i + 1}`})
          </span>
          <div>
            <h3 className="font-display text-6xl font-bold text-white 
                           group-hover:translate-x-4 transition-transform">
              {service.title}
            </h3>
            <div className="flex gap-2 mt-4">
              {service.tags.map(tag => (
                <span className="px-3 py-1 border border-stone-700 
                                 rounded-full text-stone-400 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Arrow reveal */}
        <ArrowUpRight className="w-16 h-16 text-kinetic-orange 
                                  opacity-0 group-hover:opacity-100 
                                  group-hover:rotate-45 transition-all" />
      </div>
    </div>
  ))}
</section>
```

### 4.6 Footer (Kinetic CTA)

Bold call-to-action footer.

```tsx
<footer className="bg-kinetic-orange py-20">
  <div className="container mx-auto text-center">
    <h2 className="font-display text-[10vw] font-black uppercase text-black">
      Let's Talk
    </h2>
    <button className="mt-8 px-12 py-4 bg-black text-white rounded-full 
                       font-mono text-xl uppercase hover:scale-105 
                       transition-transform">
      hello@orangec-at.com
    </button>
  </div>
  
  <div className="flex justify-between mt-20 border-t-2 border-black pt-8">
    <span className="font-mono uppercase text-sm">
      2024 OrangeCat Inc.
    </span>
    <div className="flex gap-8">
      {socialLinks.map(link => (
        <a className="font-mono uppercase text-sm hover:underline">
          {link}
        </a>
      ))}
    </div>
  </div>
</footer>
```

---

## 5. Animation Guidelines

### Allowed Animations

| Animation | Usage | Duration | Easing |
|-----------|-------|----------|--------|
| `fadeIn` | Page load, section reveal | 0.5-0.8s | `easeOut` |
| `slideUp` | Cards entering viewport | 0.6s | `circOut` |
| `hover:y` | Card lift on hover | 0.3s | `spring` |
| `marquee` | Text scroll | 20s | `linear` |
| `rotate` | Scroll indicator | 20s+ | `linear` |
| `color pulse` | Hero accent text | 4s | `easeInOut` |

### Animation Rules

1. **Entry animations**: Use `whileInView` with `viewport={{ once: true }}`
2. **Hover animations**: Keep under 0.3s for responsiveness
3. **Marquee**: Always `linear` easing, 20s minimum duration
4. **Avoid**: Excessive bounce, blur animations, complex keyframes

---

## 6. Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Hero Text Scaling

```css
.kinetic-hero {
  font-size: clamp(3rem, 15vw, 12rem);
}

@media (max-width: 640px) {
  .kinetic-hero {
    font-size: clamp(2.5rem, 12vw, 4rem);
  }
}
```

---

## 7. Implementation Phases

### Phase 1: Unify Navigation (Priority: HIGH)
1. Create `UnifiedNavigation` component
2. Remove `conditional-app-shell.tsx` logic
3. Apply consistent header across all pages

### Phase 2: Add Kinetic Elements (Priority: MEDIUM)
1. Create `Marquee` component
2. Add to home page between Hero and Featured
3. Update Hero with larger typography

### Phase 3: Update Existing Components (Priority: MEDIUM)
1. Add orange accents to `FeaturedPosts`
2. Convert `SkillsSection` to interactive list
3. Update `Footer` with kinetic CTA

### Phase 4: Polish & Dark Mode (Priority: LOW)
1. Ensure all components support dark mode
2. Fine-tune animations
3. Add scroll-triggered effects

---

## 8. Files to Modify

| File | Change |
|------|--------|
| `conditional-app-shell.tsx` | Remove - replace with single layout |
| `app/[locale]/layout.tsx` | Use unified navigation |
| `globals.css` | Add kinetic color variables |
| `design-tokens.ts` | Add kinetic tokens |
| `knowledge-shelf/components/Hero.tsx` | Update typography scale |
| `knowledge-shelf/components/Navbar.tsx` | Merge with ResponsiveHeader |
| NEW: `components/ui/marquee.tsx` | Create marquee component |
| NEW: `components/layout/unified-navigation.tsx` | Create unified nav |

---

## 9. Success Criteria

- [ ] Single navigation system across all pages
- [ ] No jarring visual transitions between routes
- [ ] Orange accent color visible on every page
- [ ] At least one kinetic element (marquee) on home page
- [ ] Dark mode fully supported
- [ ] Mobile responsive with touch-friendly targets
- [ ] Lighthouse Performance > 90

---

*Design Spec Version: 1.0*
*Created: January 2026*
*Author: OrangeCat Portfolio Team*

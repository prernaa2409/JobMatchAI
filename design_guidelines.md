# JobMatchAI Design Guidelines

## Design Approach

**System Foundation: Material Design principles** adapted for a professional career tools platform. Drawing inspiration from **Linear** (clean data presentation) and **Notion** (content-rich layouts) to create a trustworthy, modern interface for job seekers.

**Core Principle:** Balance professional credibility with approachability - users are making career decisions and need clear, confident visual communication.

---

## Color System

### Dark Theme (Primary)
- **Background Deep:** `#222831` (primary background)
- **Background Elevated:** `#393E46` (cards, elevated surfaces)
- **Primary/Accent:** `#00ADB5` (CTAs, highlights, interactive elements)
- **Text/Surface:** `#EEEEEE` (primary text, light backgrounds)

### Semantic Colors
- **Success:** `142 71% 45%` (green for good ATS scores 80-100)
- **Warning:** `38 92% 50%` (amber for medium scores 60-79)
- **Error:** `0 72% 51%` (red for low scores <60)
- **Info:** Derived from `#00ADB5` for neutral highlights

### Application
- Dark mode throughout with `#222831` base
- Cards/panels use `#393E46` with subtle borders in `#00ADB5` at 10% opacity
- Interactive elements use `#00ADB5` with hover state at 90% brightness
- Text hierarchy: `#EEEEEE` for primary, `#EEEEEE` at 70% opacity for secondary

---

## Typography

**Font Stack:**
- **Primary:** 'Inter' (Google Fonts) - UI text, body content
- **Display:** 'Space Grotesk' (Google Fonts) - headlines, hero sections
- **Mono:** 'JetBrains Mono' (Google Fonts) - code snippets, technical data

**Scale:**
- Hero: text-5xl/6xl (Space Grotesk, font-bold)
- H1: text-4xl (Space Grotesk, font-semibold)
- H2: text-3xl (Space Grotesk, font-semibold)
- H3: text-2xl (Inter, font-semibold)
- Body: text-base (Inter, font-normal)
- Small/Meta: text-sm (Inter, font-medium)

---

## Layout System

**Spacing Primitives:** Tailwind units of **4, 6, 8, 12, 16** for consistent rhythm
- Component padding: `p-6` or `p-8`
- Section spacing: `py-12` mobile, `py-16` desktop
- Card gaps: `gap-6` or `gap-8`
- Container max-width: `max-w-7xl`

**Grid Patterns:**
- Dashboard: 3-column grid on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Analysis cards: 2-column responsive (`grid-cols-1 lg:grid-cols-2`)
- Admin tables: Full-width with horizontal scroll

---

## Component Library

### Navigation
- **Top Nav:** Sticky dark header (`#222831`) with logo left, auth buttons right
- **Dashboard Nav:** Sidebar on desktop (240px), collapsible on mobile with hamburger
- **Breadcrumbs:** For analysis detail pages using `#00ADB5` for active links

### Cards & Surfaces
- **Analysis Cards:** `bg-[#393E46]` with rounded-xl borders, hover lift effect (shadow-lg)
- **Score Cards:** Large circular progress indicators with gradient fills based on score (success/warning/error colors)
- **Info Panels:** Left border accent in `#00ADB5` (border-l-4) with dark background

### Data Visualization
- **ATS Score Display:** Large circular/donut chart (200px) center-aligned with score percentage
- **Section Scores:** Horizontal progress bars with labels, color-coded by performance
- **Keyword Match Grid:** Tag-style badges (`bg-[#00ADB5]` at 20% opacity, text `#EEEEEE`)
- **Usage Quota:** Stacked bar showing 3/3 improvements used with `#00ADB5` fill

### Forms & Inputs
- **Text Areas:** Dark input fields (`bg-[#222831]`) with `#00ADB5` focus ring
- **File Upload:** Drag-drop zone with dashed border, icon, and supporting text
- **Buttons:** Primary (`bg-[#00ADB5]`), Secondary (`border-2 border-[#00ADB5]` outline), Ghost (text-only)
- **OAuth Buttons:** Brand colors with dark background, icon left-aligned

### Tables (Admin)
- **Header Row:** `bg-[#393E46]` with `#EEEEEE` text
- **Data Rows:** Alternating subtle opacity on `#222831`, hover state with `#393E46`
- **Action Buttons:** Icon-only buttons in `#00ADB5` aligned right

---

## Page-Specific Designs

### Landing Page
- **Hero:** Full-width section with abstract geometric pattern background (dark gradient), centered headline, subheading, dual CTA buttons (primary + outline)
- **Features Grid:** 3-column cards with icons (Heroicons), titles, descriptions
- **How It Works:** 3-step process with numbered badges and connecting lines
- **Testimonials:** 2-column cards with avatars, quotes, names
- **CTA Section:** Full-width dark panel with centered headline and primary button

### Dashboard
- **Stats Overview:** 3 metric cards (total analyses, improvements left, avg score) with large numbers
- **Recent Analyses:** List/grid of analysis cards with thumbnail, title, score badge, date
- **Quick Actions:** Prominent "New Analysis" button, secondary "View All" link

### Analysis Detail
- **Score Hero:** Large ATS score circle top-center with grade label
- **Tabbed Sections:** Content Quality, Keywords, Format, Experience breakdown
- **Improvement Suggestions:** Numbered list with expand/collapse accordions
- **Action Footer:** Sticky bottom bar with "Improve Resume" CTA

### Improve Page
- **Split View:** Left side shows original text, right shows AI improvements
- **Download Section:** Preview card with "Download PDF" button (icon + text)
- **Quota Warning:** Banner if user has 0 improvements left, with upgrade CTA

### Admin Panel
- **Metrics Dashboard:** 4-stat cards (total users, analyses today, improvements used, active sessions)
- **Users Table:** Sortable columns, search bar, action dropdowns
- **Audit Logs:** Timestamped list with user, action, status badges

---

## Images

**Hero Image:** Abstract illustration of resume/document with AI elements (neural network lines, checkmarks, data points) in `#00ADB5` accent color on `#222831` background - positioned right side of hero section on desktop, full-width on mobile.

**Feature Icons:** Use Heroicons library (outline style) in `#00ADB5` for all feature cards and step indicators.

**Empty States:** Friendly illustrations for "No analyses yet" and "Upload your first resume" states using line art in accent colors.

---

## Interaction Patterns

- **Hover States:** Subtle lift (translate-y-[-2px]) with shadow increase on cards
- **Loading:** Skeleton screens using `#393E46` background with shimmer effect
- **Toasts:** Top-right notifications with icons, auto-dismiss
- **Modals:** Center overlay with `#393E46` background, blur backdrop
- **Animations:** Minimal - fade-in for page loads, slide-up for modals (duration-300)
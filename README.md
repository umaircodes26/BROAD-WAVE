# CYBERPULSE // 3D Product Visualization & CGI Studio

A modern, interactive, high-end 3D company profile website inspired by an Awwwards-style CGI & 3D visualization studio.

Built with **React 19**, **Three.js**, **Tailwind CSS v4**, **GSAP**, and **Vite**.

---

## 🌟 Key Features & Architecture

### 1. Visual Design & Theme
- **Fluid WebGL Liquid Wave Background**: Custom Three.js shader plane executing multi-octave 3D simplex noise with deep vibrant cyan / turquoise gradient caustics and reactive mouse ripples.
- **Glassmorphism & Cyber Aesthetics**: Frosted acrylic HUD panels, neon cyan glows, scanning line effects, and cyber grid overlays.
- **Typography**: Clean, bold modern sans-serif typography paired with JetBrains Mono for technical HUD telemetry.
- **Header & Navigation**: Fixed glassmorphism navbar with company logo, links (`Services`, `Industries`, `Why CGI`, `Work`, `Process`), interactive Web Audio SFX mute/unmute toggle, and glowing `"Start a project"` CTA.

### 2. Interactive 3D Product Asset Experience
- **Hyper-Realistic PBR Asset ("Aura Zero")**:
  - Procedural 3D model featuring Grade 5 Titanium Exoskeleton, Aerogel Crystalline Glass Shell with physical transmission & IOR, Internal Kinetic Acoustic Turbine, and Octa-Core Neural DSP Co-Processor with emissive core crystals.
  - Procedural Studio Environment Reflection Map for hyper-realistic metallic and glass reflections.
- **Anti-Gravity Physics**: Floating levitation motion with smooth sinusoidal bobbing and rotation damping.
- **Mouse Interaction**: Smooth lerp tracking tilt and rotation following cursor coordinates, plus 360° drag-to-orbit controls.
- **Exploded View (Disassemble) Mechanism**:
  - One-click `"EXPLODE 3D VIEW (DISASSEMBLE)"` toggle that separates every component along its local trajectory.
  - Interactive 3D HUD Callout Pins projected from 3D world space to 2D screen coordinates (`[01] OPTICAL ARCHITECTURE`, `[02] TITANIUM EXOSKELETON`, `[03] ACOUSTIC KINEMATICS`, etc.).
- **Real-Time LookDev Switcher**:
  - `Cyan Aurora` (Signature Look)
  - `Obsidian Stealth` (Matte Black Titanium & Crimson Light)
  - `Arctic Chrome` (Liquid Platinum & Arctic Ice Light)
  - `Solar Amber` (Champagne Gold & Warm Amber Core)
- **Wireframe Mode**: Instant toggle between shaded PBR mesh and glowing cyber wireframe.

### 3. Studio Profile Sections
- **Hero Section**:
  - Subhead: `'3D PRODUCT VISUALIZATION STUDIO'`
  - Headline: `'Bringing products to life'`
  - Paragraph describing CGI, photoreal animation, and renders for launch-ready brands.
  - Dual CTAs: `'Start a project'` (solid dark / cyan accents) and `'See the work'` (transparent pill outline).
  - Bottom Bar: Technical HUD-style metadata labels (`'SCENE 01 - THE WAVE'`, `'FRAME 0008 / 24 FPS'`, `'SCROLL TO EXPLORE'`).
- **Services & Capabilities**: 3D tilt cards showcasing 4 core studio offerings with technical deliverable bullets.
- **Industries**: 6 high-caliber sectors (Consumer Tech, Footwear, Fragrance, Horology, EVs, Robotics).
- **Why CGI vs Traditional Photography**: Interactive before/after split slider and comparison table.
- **Curated Works Archive**: Filterable case studies with award badges (Awwwards SOTD, FWA, Cannes Lions Bronze) and interactive case study modal.
- **4-Phase Production Pipeline**: Interactive phase selector from raw CAD ingestion to 8K master delivery.
- **"Start a Project" Modal**: Multi-step interactive brief builder with services checklist, budget estimator, and transmission feedback.
- **Technical HUD Footer**: Real-time studio clocks (GMT), server cluster diagnostics, coordinates, and newsletter.

---

## 🚀 Running the Project

### Development Server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```


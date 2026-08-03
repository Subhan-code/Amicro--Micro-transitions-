# @subhanhq/amicro

A curated collection of premium React micro-interactions, transition components, and card layouts powered by **Motion**.

[![npm version](https://img.shields.io/npm/v/@subhanhq/amicro?style=for-the-badge&color=000000&logo=npm&logoColor=white)](https://www.npmjs.com/package/@subhanhq/amicro)
[![License](https://img.shields.io/github/license/Subhan-code/Amicro--Micro-transitions-?style=for-the-badge&color=000000&logo=opensourceinitiative&logoColor=white)](https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Subhan-code/Amicro--Micro-transitions-?style=for-the-badge&color=000000&logo=github&logoColor=white)](https://github.com/Subhan-code/Amicro--Micro-transitions-/stargazers)
[![Sponsor](https://img.shields.io/badge/Sponsor%20%E2%9D%A4%EF%B8%8F-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/Subhan-code)

---

```text
╭──────────────────────── Amicro CLI ────────────────────────╮
│ npx @subhanhq/amicro@latest init     initialize project    │
│ npx @subhanhq/amicro@latest add      add UI components     │
╰────────────────────────────────────────────────────────────╯
```

---

## ⚡️ Quick Start

### Installation

```bash
npm install @subhanhq/amicro
# or
yarn add @subhanhq/amicro
# or
pnpm add @subhanhq/amicro
```

### CLI Command Usage

```bash
# 1. Initialize configuration in your React / Next.js / Vite project
npx @subhanhq/amicro@latest init

# 2. Add individual components directly to your codebase
npx @subhanhq/amicro@latest add download-button

# 3. Add card interaction components
npx @subhanhq/amicro@latest add card-arc-5
```

---


## 🎨 shadcn/ui Registry Integration

You can add **Amicro** motion primitives, custom hooks, and spring presets directly to your project using the shadcn CLI!

### 1. Direct URL Installation
You can install any component directly by referencing its public raw URL:
```bash
npx shadcn add https://raw.githubusercontent.com/Subhan-code/Amicro--Micro-transitions-/main/registry/ui/fade-in.json
```

### 2. Namespaced Registry Mapping (Recommended)
Add the `@amicro` namespace to the `registries` field in your project's `components.json`:
```json
{
  "registries": {
    "@amicro": "https://raw.githubusercontent.com/Subhan-code/Amicro--Micro-transitions-/main/registry/{name}.json"
  }
}
```
Now, you can install any component, hook, or utility directly by name:
```bash
# Install entrance transition components (placed under components/amicro/)
npx shadcn add @amicro/fade-in
npx shadcn add @amicro/fade-up
npx shadcn add @amicro/zoom-in

# Install hover & text components
npx shadcn add @amicro/tilt-card
npx shadcn add @amicro/magnetic-button
npx shadcn add @amicro/text-reveal

# Install hooks & utilities
npx shadcn add @amicro/use-scroll-progress
npx shadcn add @amicro/presets
```

---

## 💻 Card Components & CLI Commands

| Component | Description | CLI Command |
| :--- | :--- | :--- |
| **ARC (5 Cards)** | Fanned card layout forming a neat curved arc with 5 items | `npx @subhanhq/amicro@latest add card-arc-5` |
| **ARC (7 Cards)** | Expanded card arc layout accommodating 7 items cleanly | `npx @subhanhq/amicro@latest add card-arc-7` |
| **Long ARC (5 Cards)** | Wide, sweeping card arc extending translations laterally | `npx @subhanhq/amicro@latest add card-long-arc-5` |
| **Linear Spread** | Slides cards horizontally in a linear row without rotations | `npx @subhanhq/amicro@latest add card-linear-spread` |
| **Corner Fan** | Fans elements radially from a fixed bottom-left origin anchor | `npx @subhanhq/amicro@latest add card-corner-fan` |
| **Stamp Arc** | Perforated stamp cards with dynamic arc, gap, and offset controls | `npx @subhanhq/amicro@latest add card-stamp-arc` |
| **Cascade Stagger** | Deploys cards vertically and staggered in a diagonal cascade | `npx @subhanhq/amicro@latest add card-cascade-stagger` |
| **Scatter Desk Deal** | Scatters cards into an overlapping dealt hand layout on hover | `npx @subhanhq/amicro@latest add card-scatter-spread` |
| **Wheel Radial Fan** | Fans cards outward in a radial semi-circle around center anchor | `npx @subhanhq/amicro@latest add card-wheel-fan` |
| **Interactive Carousel** | 3D motion carousel with dot indicators and prev/next controls | `npx @subhanhq/amicro@latest add card-carousel` |
| **CoverFlow Carousel** | Premium 3D CoverFlow carousel displaying cards along perspective path | `npx @subhanhq/amicro@latest add card-cover-flow` |
| **Time Machine Stack** | Apple-style perspective depth card stack with timeline scrubber | `npx @subhanhq/amicro@latest add card-time-machine` |

---

## ✨ Key Features

- ⚡️ **Clean Micro-transitions**: Hardware-accelerated animations powered by `motion/react`.
- 📦 **Zero Runtime Overhead**: Copy-to-code components copy TSX source directly into your codebase.
- 🌓 **Dark & Light Mode**: Tailored for both dark and light UI palettes.
- 🎨 **Harmonious Aesthetics**: Designed to feel fluid, responsive, and state of the art.

---

## 🛠️ Prerequisites & Requirements

- **Node.js**: `v18.0.0` or higher
- **React**: `^18.0.0` or `^19.0.0`
- **Tailwind CSS**: `v3` or `v4`
- **Motion**: `motion` or `framer-motion`

---

## 👤 Author & Support

Created with ❤️ by **Syed Subhan**

- **Twitter**: [@SubhanHQ](https://x.com/SubhanHQ)
- **Email**: [su2491251@gmail.com](mailto:su2491251@gmail.com)
- **GitHub**: [@Subhan-code](https://github.com/Subhan-code)
- **Support**: [Sponsor on GitHub](https://github.com/sponsors/Subhan-code) | [Support on Ko-fi](https://ko-fi.com/subhanuddin)

---
[![RepoStars](https://repostars.dev/api/embed?repo=Subhan-code%2FAmicro--Micro-transitions-&theme=light)](https://repostars.dev/?repos=Subhan-code%2FAmicro--Micro-transitions-&theme=light)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

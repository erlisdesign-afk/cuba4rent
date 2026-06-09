---
name: motion-framer
description: Modern animation library for React and JavaScript. Create smooth, production-ready animations with motion components, variants, gestures (hover/tap/drag), layout animations, AnimatePresence exit animations, spring physics, and scroll-based effects. Use when building interactive UI components, micro-interactions, page transitions, or complex animation sequences.
---
# Motion & Framer Motion
## Overview
Motion (formerly Framer Motion) is a production-ready animation library for React and JavaScript that enables declarative, performant animations with minimal code. It provides `motion` components that wrap HTML elements with animation superpowers, supports gesture recognition (hover, tap, drag, focus), and includes advanced features like layout animations, exit animations, and spring physics.

**When to use this skill:**
- Building interactive UI components (buttons, cards, menus)
- Creating micro-interactions and hover effects
- Implementing page transitions and route animations
- Adding scroll-based animations and parallax effects
- Animating layout changes (resizing, reordering, shared element transitions)
- Drag-and-drop interfaces
- Complex animation sequences and state-based animations
- Replacing CSS transitions with more powerful, controllable animations

**Technology:**
- **Motion** (v11+) - The modern, smaller library from Framer Motion creators
- **Framer Motion** - The full-featured predecessor (still widely used)
- React 18+ compatible, also supports Vue
- Supports TypeScript
- Works with Next.js, Vite, Remix, and all modern React frameworks

## Core Concepts

### 1. Motion Components
Convert any HTML/SVG element into an animatable component by prefixing with `motion.`:
```jsx
import { motion } from "framer-motion"
```
Every motion component accepts animation props like `animate`, `initial`, `transition`, and gesture props like `whileHover`, `whileTap`, etc.

### 2. Animate Prop
The `animate` prop defines the target animation state. When values change, Motion automatically animates to them.

### 3. Initial State
Set the initial state before animation using the `initial` prop. Set `initial={false}` to disable initial animations on mount.

### 4. Transitions
Control how animations move between states using the `transition` prop.

**Transition types:**
- `"tween"` (default) - Duration-based with easing
- `"spring"` - Physics-based spring animation
- `"inertia"` - Decelerating animation (used in drag)

### 5. Variants
Organize animation states using named variants for cleaner code and propagation to children:
```jsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9 }
}
```

**Variant propagation** - Children automatically inherit parent variant states with `staggerChildren`.

## Common Patterns

### 1. Hover Animations — `whileHover` prop
### 2. Tap/Press Animations — `whileTap` prop
### 3. Drag Interactions — `drag` prop
### 4. Exit Animations — `AnimatePresence` wrapper (requires `key` on children)
### 5. Layout Animations — `layout` prop
### 6. Scroll-Based Animations — `whileInView` prop
### 7. Spring Animations — `transition={{ type: "spring", stiffness, damping }}`

## Performance Rules
- Use transform properties (x, y, scale, rotate) — hardware accelerated
- Avoid animating width/height/top/left directly
- Use `useReducedMotion()` for accessibility
- Use `layoutId` sparingly

## Common Pitfalls
- Exit animations require `AnimatePresence` wrapper
- List items inside `AnimatePresence` need unique `key` props
- Gesture-specific transitions must be inside the gesture prop, not general `transition`

## Resources
- [Motion Docs](https://motion.dev/)
- [Framer Motion Docs](https://www.framer.com/motion/)

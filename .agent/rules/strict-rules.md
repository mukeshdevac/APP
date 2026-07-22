---
trigger: always_on
---

# 🚀 Antigravity AI – React Application Engineering Guidelines

## 📌 Overview

This document defines the official engineering standards for building the Antigravity AI React application.

Goals:

- High performance
- Memory efficiency
- Clean and scalable architecture
- Reusable components
- Bug-free and maintainable code
- Proper exception handling
- Fully responsive for all devices
- User-friendly animations
- Enterprise readiness

---

# 1. Core Engineering Principles

## 1.1 Mandatory Standards

- Use Functional Components only
- Use React Hooks
- Use TypeScript (strict mode enabled)
- Follow SOLID principles
- Follow Single Responsibility Principle
- Avoid unnecessary re-renders
- Use ESLint + Prettier
- No unused variables or imports

---

# 2. Recommended Tech Stack

- React (latest stable)
- TypeScript (strict mode)
- Vite or Next.js
- React Router (if not using Next.js)
- Zustand or Redux Toolkit (if global state required)
- Axios or Fetch API
- React Query / TanStack Query for async state
- Framer Motion for animations
- Jest + React Testing Library

---

# 3. Scalable Folder Structure (Feature-Based Architecture)

```
src/
│
├── app/
│   ├── providers/
│   ├── router/
│   └── App.tsx
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── common/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types.ts
│   │
│   ├── dashboard/
│   ├── ai-engine/
│   └── analytics/
│
├── hooks/
├── services/
├── store/
├── utils/
├── types/
├── constants/
└── styles/
```

Rules:

- Each feature must be self-contained.
- Business logic must not exist inside UI components.
- Avoid circular dependencies.
- No deep nesting beyond 3–4 levels.

---

# 4. Naming Conventions

## Files

- Components → PascalCase.tsx
- Hooks → useSomething.ts
- Utilities → camelCase.ts
- Constants → UPPER_SNAKE_CASE
- Types → PascalCase

## Variables

- Boolean → isLoading, hasError
- Functions → handleSubmit, fetchUser
- Event handlers → handleClick

---

# 5. Component Reusability Rules

- Use composition over inheritance
- Keep components small
- Do not couple UI with API logic
- Accept props instead of hardcoding values
- Make UI components completely reusable

Example:

```tsx
<Button
  variant="primary"
  size="lg"
  isLoading={isGenerating}
  onClick={handleGenerate}
>
  Generate AI Response
</Button>
```

---

# 6. Performance & Memory Efficiency

## Prevent Re-Renders

- Use React.memo for pure components
- Use useCallback for handlers
- Use useMemo for expensive calculations
- Avoid inline object/array creation inside JSX

## Code Splitting

- Use lazy loading for routes
- Use dynamic imports for heavy components

## List Optimization

- Use virtualization for large datasets
- Avoid rendering unnecessary DOM nodes

## State Rules

- Keep state local whenever possible
- Avoid unnecessary global state
- Normalize large datasets
- Do not duplicate state

---

# 7. Error Handling & Exception Management

## Global Error Boundary

- Wrap application in Error Boundary
- Show fallback UI
- Log errors to monitoring service

## API Layer

- All API calls must use try/catch
- Centralize API logic in services/
- Return structured error responses

## Validation

- Validate all user inputs
- Never rely only on frontend validation
- Display clear error messages

---

# 8. Responsive Design – Mandatory for All Devices

## 8.1 Mobile-First Approach

- Design for mobile first, then scale up
- Use min-width media queries
- Avoid desktop-only layouts

---

## 8.2 Breakpoint Standard

```
Mobile:      0px – 639px
Tablet:      640px – 1023px
Laptop:      1024px – 1279px
Desktop:     1280px – 1535px
Large Screen: 1536px+
```

---

## 8.3 Layout Rules

- Use Flexbox and CSS Grid
- Avoid fixed widths
- Use max-width containers
- Use percentage and rem units instead of px where possible
- Avoid horizontal scroll

---

## 8.4 Responsive Typography

- Use rem units
- Use fluid typography when possible
- Ensure readability on small screens
- Maintain proper line-height (1.4 – 1.8)

---

## 8.5 Responsive Images

- Use responsive image sizes
- Use modern formats (WebP, AVIF)
- Set max-width: 100%
- Lazy load non-critical images

---

## 8.6 Touch & Accessibility

- Minimum touch target: 44x44px
- Avoid hover-only interactions
- Ensure clickable areas are large enough
- Support gesture-friendly UI

---

## 8.7 Navigation Rules

- Use collapsible mobile menu
- Avoid overcrowded navigation
- Use bottom navigation for mobile if necessary

---

## 8.8 Performance on Low-End Devices

- Avoid heavy animations on mobile
- Reduce bundle size
- Avoid blocking main thread
- Test on real mobile devices

---

# 9. High-Performance Animations

## Animation Rules

- Animate transform and opacity only
- Avoid animating layout properties
- Keep animations under 300ms
- Maintain 60fps
- Respect prefers-reduced-motion

## UX Rules

- Animations must improve usability
- Avoid excessive motion
- Ensure accessibility compliance

---

# 10. AI-Specific Performance Rules

- Debounce AI input queries
- Cancel stale API requests
- Show streaming responses smoothly
- Cache responses when reasonable
- Handle timeouts gracefully

---

# 11. Security Guidelines

- Never expose secrets in frontend
- Use HTTPS only
- Sanitize user inputs
- Avoid storing sensitive data in localStorage
- Implement proper authentication flow

---

# 12. Code Quality Standards

- Maximum function length: 40 lines
- Maximum file length: 300 lines
- Avoid nested ternary operators
- Use early returns
- Write self-documenting code
- Comment only complex logic

---

# 13. Testing Strategy

## Unit Testing

- Test utilities
- Test hooks
- Test services

## Integration Testing

- Test AI generation flow
- Test authentication flow
- Test dashboard functionality

## E2E Testing

- Login
- AI request lifecycle
- Responsive layout validation

---

# 14. Production Optimization Checklist

- Remove console logs
- Enable minification
- Enable tree-shaking
- Optimize images
- Use CDN
- Enable gzip/brotli compression

---

# 15. Accessibility (A11y)

- Use semantic HTML
- Ensure keyboard navigation
- Add ARIA labels
- Maintain proper color contrast
- Support screen readers

---

# Final Engineering Rule

If a solution:

- Improves performance
- Improves readability
- Improves maintainability
- Reduces memory usage
- Improves responsiveness
- Improves user experience

It is preferred.

---

# Antigravity AI Engineering Philosophy

Write code as if the next engineer maintaining it is a genius who hates messy code.

# Vibe-Coded Portfolio Landing Page Concept

## Core Idea

An interactive, cinematic landing page that presents me not just as a developer, but as a **builder who creates with code**.

The experience is designed to communicate:

* Product-building skill
* Creative technical depth
* The ability to turn ideas into real digital experiences

This is not just a webpage. It is a **curated entry into my work**.

---

## Narrative & Symbolism

* **Myself (center figure)** -> The creator / builder
* **Hovering Globe** -> Ideas, systems, and experiments being built
* **User Cursor Interaction** -> The user engaging with the build process
* **Cursor Flick** -> A brief tension moment before the full reveal

Underlying message:

> “My Father Creates. And So I Create”

---

## Visual Direction

### Background

* Dark, nebulous environment (space-like / abstract)
* Subtle animated movement (slow, ambient)
* Should feel deep and infinite, not noisy

### Foreground (Hero Composition)

* My image fades into view (center or slightly offset)
* One hand extended forward
* A globe hovers above (or beside) the hand

### The Globe

* Not a solid object
* Composed of:

  * Rotating rings (torus-like)
  * Lines of code forming the structure
* Motion:

  * Smooth, slow rotation
  * Feels alive and intentional (not chaotic)

---

## Interaction Design

### Cursor System

* Native cursor is hidden
* Replaced with a custom cursor element
* Cursor position is tracked and animated manually

---

### Primary Interaction: Flick Mechanism

When the user clicks or approaches the globe:

* A repelling force is applied to the cursor
* Cursor appears to be flicked away
* A secondary hand briefly appears to reinforce the motion

#### Key Principles

* No abrupt teleportation
* Use velocity + damping for realism
* Motion should feel physical, not scripted

#### Behavior Flow

1. Cursor approaches globe
2. Repulsion force triggers
3. Velocity pushes cursor away
4. Cursor overshoots slightly and settles back
5. Brief visual of second hand reinforces the action

---

### Progressive Reveal Mechanic

The intro begins with a short interaction challenge.

After a short time or a number of interactions:

* The experience opens up

Possible implementations:

* Globe becomes fully responsive
* Cursor is no longer repelled
* UI elements fade in (navigation, CTA)

This creates a transition from:

> **Tension -> Invitation**

---

## User Experience Flow

1. **Initial Load**

   * Black screen -> fade into nebula background
   * Ambient motion begins

2. **Reveal**

   * My image fades in
   * Globe materializes near the hand

3. **Engagement**

   * User moves cursor
   * Attempts interaction -> gets flicked away

4. **Curiosity**

   * User recognizes the intro has a deliberate interaction pattern

5. **Unlock**

   * After a delay or condition:

     * Interaction opens up
     * UI elements appear (e.g. Enter, Explore)

6. **Transition**

   * User proceeds into the main portfolio

---

## Design Language

### Colors

* Deep blacks / dark blues
* Neon accents (blue, purple, subtle green)
* High contrast but restrained

### Typography

* Clean, modern sans-serif
* Minimal usage during hero phase
* Text appears more fully after reveal

### Motion Philosophy

* Slow -> fast -> settle
* Avoid constant motion speed
* Everything feels intentional and weighted

---

## Technical Approach (Next.js)

### Stack

* **Next.js** (App Router)
* **react-three-fiber** -> 3D globe + environment
* **Three.js shaders** -> nebula / code effects
* **framer-motion** -> fades, transitions, hand animation
* Optional: **zustand** -> cursor & interaction state

---

### Key Systems

#### 1. Scene Layering

* WebGL canvas (background + globe)
* DOM layer (image, cursor, UI)

#### 2. Custom Cursor Engine

* requestAnimationFrame loop
* Tracks position, velocity, damping
* Handles interaction states (normal, repelled, released)

#### 3. Interaction State Machine

States:

* `idle`
* `resisting`
* `repelling`
* `allowed`

Controls:

* When flick happens
* When reveal unlocks
* When UI appears

#### 4. Globe Rendering

* Ring geometries (torus)
* Animated textures (code lines)
* Subtle glow / emissive material

---

## Constraints & Considerations

### Avoid

* Overly fast or chaotic motion
* Blocking the user for too long
* Gimmicky or exaggerated animations

### Ensure

* Smooth performance (optimize Three.js scene)
* Accessibility fallback (optional reduced-motion mode)
* Clear exit from the intro experience

---

## Outcome

A portfolio landing page that:

* Feels like an **interactive digital artifact**
* Demonstrates **frontend mastery + systems thinking**
* Leaves users with a strong first impression of:

  * Craft
  * Precision
  * Creativity

---

## Guiding Principle

> “With the ability to build and imagine, there's no limit to what's possible”

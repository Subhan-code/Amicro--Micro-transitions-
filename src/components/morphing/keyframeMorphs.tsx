import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface KeyframeMorphProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  size?: number;
  color?: string;
  duration?: number;
  className?: string;
}

// 1. Squircle to Circle Loader
export function LoaderMorphing({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 2,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: ['20%', '50%', '20%', '50%', '20%'],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.2, 1, 1.2, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 2. Diamond to Squircle
export function MorphDiamondSquircle({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 2.2,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: ['0%', '38%', '0%', '38%', '0%'],
        rotate: [45, 135, 225, 315, 405],
        scale: [1, 1.15, 0.95, 1.15, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 3. Capsule Stretch
export function MorphCapsuleStretch({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 2.4,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: ['9999px', '14%', '9999px', '14%', '9999px'],
        scaleX: [1.32, 0.85, 1.32, 0.85, 1.32],
        scaleY: [0.85, 1.32, 0.85, 1.32, 0.85],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 4. Kinetic Jelly Skew
export function MorphJellySkew({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 1.8,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: ['24%', '48%', '28%', '48%', '24%'],
        skewX: [0, 16, -16, 8, 0],
        skewY: [0, -8, 8, -4, 0],
        scale: [1, 1.12, 0.94, 1.06, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 5. Organic Blob
export function MorphOrganicBlob({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 3.2,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: [
          '30% 70% 70% 30% / 30% 30% 70% 70%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '40% 60% 60% 40% / 40% 60% 40% 60%',
          '70% 30% 50% 50% / 30% 60% 40% 70%',
          '30% 70% 70% 30% / 30% 30% 70% 70%',
        ],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.08, 0.96, 1.05, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 6. Corner Pinch
export function MorphCornerPinch({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 2.2,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: [
          '50% 0% 50% 0%',
          '0% 50% 0% 50%',
          '50% 0% 50% 0%',
          '0% 50% 0% 50%',
          '50% 0% 50% 0%',
        ],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.18, 1, 1.18, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 7. Teardrop Orbit
export function MorphTeardropOrbit({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 2.5,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: [
          '50% 50% 50% 0%',
          '50% 50% 0% 50%',
          '50% 0% 50% 50%',
          '0% 50% 50% 50%',
          '50% 50% 50% 0%',
        ],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.12, 1, 1.12, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 8. Accordion Squish
export function MorphAccordionSquish({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 1.6,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: ['18%', '42%', '14%', '42%', '18%'],
        scaleX: [1, 1.45, 0.75, 1.2, 1],
        scaleY: [1, 0.72, 1.38, 0.88, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 9. Dual Crescent
export function MorphDualCrescent({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 2.4,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: [
          '65% 12% 65% 12%',
          '12% 65% 12% 65%',
          '65% 12% 65% 12%',
          '12% 65% 12% 65%',
        ],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.2, 0.92, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 10. Super-Ellipse Pulse
export function MorphSuperEllipse({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 2.6,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: ['8%', '32%', '50%', '32%', '8%'],
        scale: [0.94, 1.1, 1.2, 1.1, 0.94],
        rotate: [0, 45, 90, 135, 180],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 11. Kinetic Star Cross
export function MorphStarKinetic({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 2.2,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: [
          '50%',
          '10% 50% 10% 50%',
          '50%',
          '50% 10% 50% 10%',
          '50%',
        ],
        rotate: [0, 45, 90, 135, 180],
        scale: [1, 1.25, 1, 1.25, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

// 12. Wave Ripple Drop
export function MorphWaveRipple({
  className = '',
  size = 48,
  color = 'currentColor',
  duration = 3,
  ...props
}: KeyframeMorphProps) {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        borderRadius: [
          '35% 65% 60% 40% / 50% 40% 60% 50%',
          '50% 50% 40% 60% / 60% 40% 50% 50%',
          '65% 35% 55% 45% / 45% 55% 45% 55%',
          '35% 65% 60% 40% / 50% 40% 60% 50%',
        ],
        rotate: [0, 120, 240, 360],
        scale: [1, 1.14, 0.96, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    />
  );
}

export interface KeyframeMorphItem {
  id: string;
  name: string;
  description: string;
  registry: string;
  component: React.ComponentType<KeyframeMorphProps>;
}

export const KEYFRAME_MORPH_ITEMS: KeyframeMorphItem[] = [
  {
    id: 'loader-morphing',
    name: 'Squircle ➔ Circle Morph',
    description: 'Smooth oscillation between squircle and circle with synchronized 360° rotation and scale pulse.',
    registry: 'loader-morphing',
    component: LoaderMorphing,
  },
  {
    id: 'morph-diamond-squircle',
    name: 'Diamond ➔ Squircle Morph',
    description: 'Sharp diamond corner expansion morphing into soft rounded squircle with angular momentum.',
    registry: 'morph-diamond-squircle',
    component: MorphDiamondSquircle,
  },
  {
    id: 'morph-capsule-stretch',
    name: 'Capsule ➔ Square Stretch',
    description: 'Biaxial stretching between elongated pill capsule and compact rounded square.',
    registry: 'morph-capsule-stretch',
    component: MorphCapsuleStretch,
  },
  {
    id: 'morph-jelly-skew',
    name: 'Kinetic Jelly Skew',
    description: 'Elastic rubber-banding skew transition with dynamic border-radius wobble.',
    registry: 'morph-jelly-skew',
    component: MorphJellySkew,
  },
  {
    id: 'morph-organic-blob',
    name: 'Organic Fluid Blob',
    description: 'Continuous 8-point border-radius deformation simulating liquid surface tension.',
    registry: 'morph-organic-blob',
    component: MorphOrganicBlob,
  },
  {
    id: 'morph-corner-pinch',
    name: 'Diagonal Corner Pinch',
    description: 'Alternating diagonal corner pinching creating an organic leaf and teardrop cycle.',
    registry: 'morph-corner-pinch',
    component: MorphCornerPinch,
  },
  {
    id: 'morph-teardrop-orbit',
    name: 'Teardrop Orbit Morph',
    description: 'Single directional vertex rotating through all 4 quadrants like a rolling water drop.',
    registry: 'morph-teardrop-orbit',
    component: MorphTeardropOrbit,
  },
  {
    id: 'morph-accordion-squish',
    name: 'Accordion Squish & Bounce',
    description: 'Vertical impact compression with horizontal spring expansion and corner softening.',
    registry: 'morph-accordion-squish',
    component: MorphAccordionSquish,
  },
  {
    id: 'morph-dual-crescent',
    name: 'Dual Crescent Spin',
    description: 'Opposing concave curvature cycle alternating between sharp crescent and smooth pebble.',
    registry: 'morph-dual-crescent',
    component: MorphDualCrescent,
  },
  {
    id: 'morph-super-ellipse',
    name: 'Super-Ellipse Curvature',
    description: 'Gradual curvature transition expanding from rounded rectangle to perfect circle.',
    registry: 'morph-super-ellipse',
    component: MorphSuperEllipse,
  },
  {
    id: 'morph-star-kinetic',
    name: 'Kinetic Star Cross',
    description: 'Quad-point corner pinching creating an alternating 4-point star and circle pulse.',
    registry: 'morph-star-kinetic',
    component: MorphStarKinetic,
  },
  {
    id: 'morph-wave-ripple',
    name: 'Wave Ripple Drop',
    description: 'Asymmetric fluid ripple deformation with rotating rotational equilibrium.',
    registry: 'morph-wave-ripple',
    component: MorphWaveRipple,
  },
];

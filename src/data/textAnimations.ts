import React from 'react';

export type TextInteractionType = 
  // Featured
  | 'dia-text-reveal'
  // Reveals
  | 'blur-text'
  | 'shimmer-text'
  | 'typewriter-text'
  | 'reveal-text'
  | 'fade-in-char'
  | 'fade-in-word'
  | 'fade-in-text'
  | 'blur-up-word'
  | 'blur-up-char'
  // Slide & Drop
  | 'stagger-text'
  | 'slide-up-char'
  | 'slide-up-word'
  | 'slide-up-text'
  | 'slide-down-char'
  | 'slide-down-word'
  | 'slide-left-char'
  | 'slide-right-char'
  | 'drop-in-char'
  | 'rise-up-word'
  | 'bounce-in-char'
  // Scale & Zoom
  | 'scale-in-char'
  | 'scale-in-word'
  | 'scale-in-text'
  | 'zoom-in-text'
  | 'zoom-out-text'
  // 3D & Rotate
  | 'flip-y-char'
  | 'flip-x-char'
  | 'rotate-in-char'
  | 'swing-word'
  // Distortion & Spacing
  | 'stretch-x-char'
  | 'stretch-y-char'
  | 'skew-x-char'
  | 'tracking-in-text'
  | 'tracking-out-text'
  // Hover & Interactive
  | 'spring-text'
  | 'hover-lift-char'
  | 'hover-lift-word'
  | 'hover-scale-char'
  | 'hover-scale-word'
  // Continuous
  | 'float-char'
  | 'float-word'
  | 'pulse-char'
  | 'pulse-word'
  | 'glow-text';

export interface TextAnimationConfig {
  id: string;
  label: string;
  interactionType: TextInteractionType;
  description: string;
  cliCommand: string;
  category?: string;
}

export const textAnimationsData: TextAnimationConfig[] = [
  // Featured
  { id: 'txt-dia', label: 'Dia Text Reveal', interactionType: 'dia-text-reveal', description: 'Striking diagonal text reveal with mask & blur.', cliCommand: 'npx shadcn@latest add @amicro/dia-text-reveal', category: 'Featured' },
  
  // Reveals
  { id: 'txt-blur', label: 'Blur Text', interactionType: 'blur-text', description: 'Smooth reveal animation using blur and scale.', cliCommand: 'npx shadcn@latest add @amicro/blur-text', category: 'Reveals' },
  { id: 'txt-shimmer', label: 'Shimmer Text', interactionType: 'shimmer-text', description: 'Elegant shimmering gradient highlight effect.', cliCommand: 'npx shadcn@latest add @amicro/shimmer-text', category: 'Reveals' },
  { id: 'txt-typewriter', label: 'Typewriter Text', interactionType: 'typewriter-text', description: 'Classic typewriter effect with blinking cursor.', cliCommand: 'npx shadcn@latest add @amicro/typewriter-text', category: 'Reveals' },
  { id: 'txt-reveal', label: 'Reveal Text', interactionType: 'reveal-text', description: 'Cinematic reveal using clip-path inset.', cliCommand: 'npx shadcn@latest add @amicro/reveal-text', category: 'Reveals' },
  { id: 'txt-fade-char', label: 'Fade In Char', interactionType: 'fade-in-char', description: 'Characters fade in sequentially.', cliCommand: 'npx shadcn@latest add @amicro/fade-in-char', category: 'Reveals' },
  { id: 'txt-fade-word', label: 'Fade In Word', interactionType: 'fade-in-word', description: 'Words fade in sequentially.', cliCommand: 'npx shadcn@latest add @amicro/fade-in-word', category: 'Reveals' },
  { id: 'txt-fade-text', label: 'Fade In Text', interactionType: 'fade-in-text', description: 'Smooth whole text opacity fade.', cliCommand: 'npx shadcn@latest add @amicro/fade-in-text', category: 'Reveals' },
  { id: 'txt-blurup-word', label: 'Blur Up Word', interactionType: 'blur-up-word', description: 'Words blur and rise into focus.', cliCommand: 'npx shadcn@latest add @amicro/blur-up-word', category: 'Reveals' },
  { id: 'txt-blurup-char', label: 'Blur Up Char', interactionType: 'blur-up-char', description: 'Characters blur and rise into focus.', cliCommand: 'npx shadcn@latest add @amicro/blur-up-char', category: 'Reveals' },

  // Slide & Drop
  { id: 'txt-stagger', label: 'Stagger Text', interactionType: 'stagger-text', description: 'Words animate up in a staggered sequence.', cliCommand: 'npx shadcn@latest add @amicro/stagger-text', category: 'Slide & Drop' },
  { id: 'txt-slideup-char', label: 'Slide Up Char', interactionType: 'slide-up-char', description: 'Characters slide up from clipping bottom.', cliCommand: 'npx shadcn@latest add @amicro/slide-up-char', category: 'Slide & Drop' },
  { id: 'txt-slideup-word', label: 'Slide Up Word', interactionType: 'slide-up-word', description: 'Words slide up into view.', cliCommand: 'npx shadcn@latest add @amicro/slide-up-word', category: 'Slide & Drop' },
  { id: 'txt-slideup-text', label: 'Slide Up Text', interactionType: 'slide-up-text', description: 'Text block slides up elegantly.', cliCommand: 'npx shadcn@latest add @amicro/slide-up-text', category: 'Slide & Drop' },
  { id: 'txt-slidedown-char', label: 'Slide Down Char', interactionType: 'slide-down-char', description: 'Characters cascade downwards.', cliCommand: 'npx shadcn@latest add @amicro/slide-down-char', category: 'Slide & Drop' },
  { id: 'txt-slidedown-word', label: 'Slide Down Word', interactionType: 'slide-down-word', description: 'Words cascade downwards.', cliCommand: 'npx shadcn@latest add @amicro/slide-down-word', category: 'Slide & Drop' },
  { id: 'txt-slideleft-char', label: 'Slide Left Char', interactionType: 'slide-left-char', description: 'Characters slide from the right.', cliCommand: 'npx shadcn@latest add @amicro/slide-left-char', category: 'Slide & Drop' },
  { id: 'txt-slideright-char', label: 'Slide Right Char', interactionType: 'slide-right-char', description: 'Characters slide from the left.', cliCommand: 'npx shadcn@latest add @amicro/slide-right-char', category: 'Slide & Drop' },
  { id: 'txt-dropin-char', label: 'Drop In Char', interactionType: 'drop-in-char', description: 'Characters drop in from above.', cliCommand: 'npx shadcn@latest add @amicro/drop-in-char', category: 'Slide & Drop' },
  { id: 'txt-riseup-word', label: 'Rise Up Word', interactionType: 'rise-up-word', description: 'Words rise up gracefully with spring.', cliCommand: 'npx shadcn@latest add @amicro/rise-up-word', category: 'Slide & Drop' },
  { id: 'txt-bouncein-char', label: 'Bounce In Char', interactionType: 'bounce-in-char', description: 'Characters bounce into position.', cliCommand: 'npx shadcn@latest add @amicro/bounce-in-char', category: 'Slide & Drop' },

  // Scale & Zoom
  { id: 'txt-scalein-char', label: 'Scale In Char', interactionType: 'scale-in-char', description: 'Characters scale up into place.', cliCommand: 'npx shadcn@latest add @amicro/scale-in-char', category: 'Scale & Zoom' },
  { id: 'txt-scalein-word', label: 'Scale In Word', interactionType: 'scale-in-word', description: 'Words scale up into place.', cliCommand: 'npx shadcn@latest add @amicro/scale-in-word', category: 'Scale & Zoom' },
  { id: 'txt-scalein-text', label: 'Scale In Text', interactionType: 'scale-in-text', description: 'Whole text block scales up.', cliCommand: 'npx shadcn@latest add @amicro/scale-in-text', category: 'Scale & Zoom' },
  { id: 'txt-zoomin-text', label: 'Zoom In Text', interactionType: 'zoom-in-text', description: 'Text zooms in subtly from background.', cliCommand: 'npx shadcn@latest add @amicro/zoom-in-text', category: 'Scale & Zoom' },
  { id: 'txt-zoomout-text', label: 'Zoom Out Text', interactionType: 'zoom-out-text', description: 'Text zooms out subtly into focus.', cliCommand: 'npx shadcn@latest add @amicro/zoom-out-text', category: 'Scale & Zoom' },

  // 3D & Rotate
  { id: 'txt-flipy-char', label: 'Flip Y Char', interactionType: 'flip-y-char', description: 'Characters flip on Y axis.', cliCommand: 'npx shadcn@latest add @amicro/flip-y-char', category: '3D & Rotate' },
  { id: 'txt-flipx-char', label: 'Flip X Char', interactionType: 'flip-x-char', description: 'Characters flip on X axis.', cliCommand: 'npx shadcn@latest add @amicro/flip-x-char', category: '3D & Rotate' },
  { id: 'txt-rotatein-char', label: 'Rotate In Char', interactionType: 'rotate-in-char', description: 'Characters rotate slightly as they enter.', cliCommand: 'npx shadcn@latest add @amicro/rotate-in-char', category: '3D & Rotate' },
  { id: 'txt-swing-word', label: 'Swing Word', interactionType: 'swing-word', description: 'Words swing into place like a pendulum.', cliCommand: 'npx shadcn@latest add @amicro/swing-word', category: '3D & Rotate' },

  // Distortion & Spacing
  { id: 'txt-stretchx-char', label: 'Stretch X Char', interactionType: 'stretch-x-char', description: 'Characters stretch horizontally.', cliCommand: 'npx shadcn@latest add @amicro/stretch-x-char', category: 'Distortion & Spacing' },
  { id: 'txt-stretchy-char', label: 'Stretch Y Char', interactionType: 'stretch-y-char', description: 'Characters stretch vertically.', cliCommand: 'npx shadcn@latest add @amicro/stretch-y-char', category: 'Distortion & Spacing' },
  { id: 'txt-skewx-char', label: 'Skew X Char', interactionType: 'skew-x-char', description: 'Characters un-skew into position.', cliCommand: 'npx shadcn@latest add @amicro/skew-x-char', category: 'Distortion & Spacing' },
  { id: 'txt-trackingin-text', label: 'Tracking In Text', interactionType: 'tracking-in-text', description: 'Letter spacing tightens smoothly.', cliCommand: 'npx shadcn@latest add @amicro/tracking-in-text', category: 'Distortion & Spacing' },
  { id: 'txt-trackingout-text', label: 'Tracking Out Text', interactionType: 'tracking-out-text', description: 'Letter spacing loosens smoothly.', cliCommand: 'npx shadcn@latest add @amicro/tracking-out-text', category: 'Distortion & Spacing' },

  // Hover & Interactive
  { id: 'txt-spring-text', label: 'Spring Text', interactionType: 'spring-text', description: 'Interactive text that springs on hover.', cliCommand: 'npx shadcn@latest add @amicro/spring-text', category: 'Hover & Interactive' },
  { id: 'txt-hoverlift-char', label: 'Hover Lift Char', interactionType: 'hover-lift-char', description: 'Characters lift vertically on hover.', cliCommand: 'npx shadcn@latest add @amicro/hover-lift-char', category: 'Hover & Interactive' },
  { id: 'txt-hoverlift-word', label: 'Hover Lift Word', interactionType: 'hover-lift-word', description: 'Words lift vertically on hover.', cliCommand: 'npx shadcn@latest add @amicro/hover-lift-word', category: 'Hover & Interactive' },
  { id: 'txt-hoverscale-char', label: 'Hover Scale Char', interactionType: 'hover-scale-char', description: 'Characters scale up on hover.', cliCommand: 'npx shadcn@latest add @amicro/hover-scale-char', category: 'Hover & Interactive' },
  { id: 'txt-hoverscale-word', label: 'Hover Scale Word', interactionType: 'hover-scale-word', description: 'Words scale up on hover.', cliCommand: 'npx shadcn@latest add @amicro/hover-scale-word', category: 'Hover & Interactive' },

  // Continuous
  { id: 'txt-float-char', label: 'Float Char', interactionType: 'float-char', description: 'Characters float gently up and down.', cliCommand: 'npx shadcn@latest add @amicro/float-char', category: 'Continuous' },
  { id: 'txt-float-word', label: 'Float Word', interactionType: 'float-word', description: 'Words float gently up and down.', cliCommand: 'npx shadcn@latest add @amicro/float-word', category: 'Continuous' },
  { id: 'txt-pulse-char', label: 'Pulse Char', interactionType: 'pulse-char', description: 'Characters pulse in opacity continuously.', cliCommand: 'npx shadcn@latest add @amicro/pulse-char', category: 'Continuous' },
  { id: 'txt-pulse-word', label: 'Pulse Word', interactionType: 'pulse-word', description: 'Words pulse in opacity continuously.', cliCommand: 'npx shadcn@latest add @amicro/pulse-word', category: 'Continuous' },
  { id: 'txt-glow-text', label: 'Glow Text', interactionType: 'glow-text', description: 'Text glows with soft aura ambient light.', cliCommand: 'npx shadcn@latest add @amicro/glow-text', category: 'Continuous' },
];

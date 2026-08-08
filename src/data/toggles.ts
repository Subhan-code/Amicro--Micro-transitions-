import React from 'react';

export type ToggleInteractionType = 
  | 'double-bounce-toggle'
  | 'solid-switch'
  | 'rectangle-toggle'
  | 'circle-toggle'
  | 'bookmark-toggle'
  | 'like-toggle'
  | 'dislike-toggle'
  | 'repost-toggle'
  | 'pill-tabs'
  | 'morph-toggle'
  | 'checkmark-draw'
  | 'theme-toggle';

export interface ToggleConfig {
  id: string;
  label: string;
  interactionType: ToggleInteractionType;
  description: string;
  cliCommand: string;
}

export const togglesData: ToggleConfig[] = [
  {
    id: 't-bounce',
    label: 'Double Bounce Switch',
    interactionType: 'double-bounce-toggle',
    description: 'Transitions.dev double bounce overshoot physics with custom track clock.',
    cliCommand: 'npx @subhanhq/amicro@latest add double-bounce-toggle',
  },
  {
    id: 't-solid',
    label: 'Solid Switch',
    interactionType: 'solid-switch',
    description: 'Crisp, high-contrast toggle with instant response.',
    cliCommand: 'npx @subhanhq/amicro@latest add solid-switch',
  },
  {
    id: 't-rect',
    label: 'Rectangle Toggle',
    interactionType: 'rectangle-toggle',
    description: 'Minimal squarish toggle with sharp border radiuses.',
    cliCommand: 'npx @subhanhq/amicro@latest add rectangle-toggle',
  },
  {
    id: 't-circle',
    label: 'Circle Curve Toggle',
    interactionType: 'circle-toggle',
    description: 'Ultra smooth circular pill switch with spring momentum.',
    cliCommand: 'npx @subhanhq/amicro@latest add circle-toggle',
  },
  {
    id: 't-bookmark',
    label: 'Bookmark Action',
    interactionType: 'bookmark-toggle',
    description: 'Interactive save bookmark button with color fill & pop.',
    cliCommand: 'npx @subhanhq/amicro@latest add bookmark-toggle',
  },
  {
    id: 't-like',
    label: 'Like Action',
    interactionType: 'like-toggle',
    description: 'Heart like button with spring burst & particle ring.',
    cliCommand: 'npx @subhanhq/amicro@latest add like-toggle',
  },
  {
    id: 't-dislike',
    label: 'Dislike Action',
    interactionType: 'dislike-toggle',
    description: 'Thumbs down action button with active state highlight.',
    cliCommand: 'npx @subhanhq/amicro@latest add dislike-toggle',
  },
  {
    id: 't-repost',
    label: 'Repost Action',
    interactionType: 'repost-toggle',
    description: 'Retweet / Repost button with 180° rotation & count update.',
    cliCommand: 'npx @subhanhq/amicro@latest add repost-toggle',
  },
  {
    id: 't-pill',
    label: 'Pill Tabs Switcher',
    interactionType: 'pill-tabs',
    description: 'Minimalist sliding indicator tab switcher (Daily / Weekly / Monthly).',
    cliCommand: 'npx @subhanhq/amicro@latest add pill-tabs',
  },
  {
    id: 't-morph',
    label: 'Morph Toggle',
    interactionType: 'morph-toggle',
    description: 'Icon morphs cleanly between locked and unlocked states.',
    cliCommand: 'npx @subhanhq/amicro@latest add morph-toggle',
  },
  {
    id: 't-check',
    label: 'Checkmark Draw',
    interactionType: 'checkmark-draw',
    description: 'Sharp vector SVG checkmark path animation on activation.',
    cliCommand: 'npx @subhanhq/amicro@latest add checkmark-draw',
  },
  {
    id: 't-theme',
    label: 'Theme Toggle',
    interactionType: 'theme-toggle',
    description: 'Minimal sun/moon swap with background transition.',
    cliCommand: 'npx @subhanhq/amicro@latest add theme-toggle',
  },
];

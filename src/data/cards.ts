export type CardInteractionType = 
  | 'card-arc-5' 
  | 'card-arc-7' 
  | 'card-long-arc-5' 
  | 'card-linear-spread' 
  | 'card-corner-fan' 
  | 'card-stamp-arc' 
  | 'card-cascade-stagger'
  | 'card-scatter-spread'
  | 'card-wheel-fan'
  | 'card-carousel'
  | 'card-cover-flow'
  | 'card-time-machine'
  | 'card-carousel-mono'
  | 'card-cover-flow-mono'
  | 'card-time-machine-mono';

export interface CardConfig {
  id: string;
  label: string;
  interactionType: CardInteractionType;
  description: string;
  cliCommand: string;
  category?: 'spreads' | 'carousels';
}

export const cardsData: CardConfig[] = [
  { 
    id: 'c1', 
    label: 'ARC (5 Cards)', 
    interactionType: 'card-arc-5', 
    description: 'Fanned card layout forming a neat curved arc with 5 items.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-arc-5' 
  },
  { 
    id: 'c2', 
    label: 'ARC (7 Cards)', 
    interactionType: 'card-arc-7', 
    description: 'Expanded card arc layout accommodating 7 items cleanly.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-arc-7' 
  },
  { 
    id: 'c3', 
    label: 'Long ARC (5 Cards)', 
    interactionType: 'card-long-arc-5', 
    description: 'Wide, sweeping card arc extending translations laterally.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-long-arc-5' 
  },
  { 
    id: 'c4', 
    label: 'Linear Spread', 
    interactionType: 'card-linear-spread', 
    description: 'Slides cards horizontally in a linear row without rotations.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-linear-spread' 
  },
  { 
    id: 'c5', 
    label: 'Corner Fan', 
    interactionType: 'card-corner-fan', 
    description: 'Fans elements radially from a fixed bottom-left origin anchor.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-corner-fan' 
  },
  { 
    id: 'c6', 
    label: 'Stamp Arc (Adjustable)', 
    interactionType: 'card-stamp-arc', 
    description: 'Perforated stamp cards with dynamic arc, gap, and offset slider controls.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-stamp-arc' 
  },
  { 
    id: 'c8', 
    label: 'Cascade Stagger Fan', 
    interactionType: 'card-cascade-stagger', 
    description: 'Deploys 5 cards vertically and staggered in a diagonal cascade stack.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-cascade-stagger' 
  },
  { 
    id: 'c9', 
    label: 'Scatter Desk Deal', 
    interactionType: 'card-scatter-spread', 
    description: 'Scatters cards into an overlapping dealt hand layout on hover.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-scatter-spread' 
  },
  { 
    id: 'c10', 
    label: 'Wheel Radial Fan', 
    interactionType: 'card-wheel-fan', 
    description: 'Fans cards outward in a radial semi-circle around a bottom-center anchor.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-wheel-fan' 
  },
  { 
    id: 'c11', 
    label: 'Interactive Carousel', 
    interactionType: 'card-carousel', 
    description: 'An interactive arc-based 3D motion carousel with dot indicators and prev/next controls.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-carousel',
    category: 'carousels'
  },
  { 
    id: 'c12', 
    label: 'CoverFlow Carousel', 
    interactionType: 'card-cover-flow', 
    description: 'A premium 3D CoverFlow carousel displaying cards along a perspective path.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-cover-flow',
    category: 'carousels'
  },
  { 
    id: 'c13', 
    label: 'Time Machine Stack', 
    interactionType: 'card-time-machine', 
    description: 'Apple-style perspective depth card stack with a scrubber timeline controls.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-time-machine',
    category: 'carousels'
  },
  { 
    id: 'c11-mono', 
    label: 'Interactive Carousel (Monochrome)', 
    interactionType: 'card-carousel-mono', 
    description: 'An interactive arc-based 3D motion carousel rendering clean monochrome cards.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-carousel-mono',
    category: 'spreads'
  },
  { 
    id: 'c12-mono', 
    label: 'CoverFlow Carousel (Monochrome)', 
    interactionType: 'card-cover-flow-mono', 
    description: 'A premium 3D CoverFlow carousel rendering clean monochrome cards.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-cover-flow-mono',
    category: 'spreads'
  },
  { 
    id: 'c13-mono', 
    label: 'Time Machine Stack (Monochrome)', 
    interactionType: 'card-time-machine-mono', 
    description: 'Apple-style perspective depth card stack rendering clean monochrome cards.',
    cliCommand: 'npx @subhanhq/amicro@latest add card-time-machine-mono',
    category: 'spreads'
  }
];

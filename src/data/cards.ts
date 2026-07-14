export type CardInteractionType = 
  | 'card-arc-5' 
  | 'card-arc-7' 
  | 'card-long-arc-5' 
  | 'card-linear-spread' 
  | 'card-corner-fan' 
  | 'card-stamp-arc' 
  | 'focus-blur'
  | 'card-3d-tilt'
  | 'card-stack-deck'
  | 'card-border-glow';

export interface CardConfig {
  id: string;
  label: string;
  interactionType: CardInteractionType;
  description: string;
  cliCommand: string;
}

export const cardsData: CardConfig[] = [
  { 
    id: 'c1', 
    label: 'ARC (5 Cards)', 
    interactionType: 'card-arc-5', 
    description: 'Fanned card layout forming a neat curved arc with 5 items.',
    cliCommand: 'npx amicro@latest add card-arc-5' 
  },
  { 
    id: 'c2', 
    label: 'ARC (7 Cards)', 
    interactionType: 'card-arc-7', 
    description: 'Expanded card arc layout accommodating 7 items cleanly.',
    cliCommand: 'npx amicro@latest add card-arc-7' 
  },
  { 
    id: 'c3', 
    label: 'Long ARC (5 Cards)', 
    interactionType: 'card-long-arc-5', 
    description: 'Wide, sweeping card arc extending translations laterally.',
    cliCommand: 'npx amicro@latest add card-long-arc-5' 
  },
  { 
    id: 'c4', 
    label: 'Linear Spread', 
    interactionType: 'card-linear-spread', 
    description: 'Slides cards horizontally in a linear row without rotations.',
    cliCommand: 'npx amicro@latest add card-linear-spread' 
  },
  { 
    id: 'c5', 
    label: 'Corner Fan', 
    interactionType: 'card-corner-fan', 
    description: 'Fans elements radially from a fixed bottom-left origin anchor.',
    cliCommand: 'npx amicro@latest add card-corner-fan' 
  },
  { 
    id: 'c6', 
    label: 'Stamp Arc (Adjustable)', 
    interactionType: 'card-stamp-arc', 
    description: 'Perforated stamp cards with dynamic arc, gap, and offset slider controls.',
    cliCommand: 'npx amicro@latest add card-stamp-arc' 
  },
  { 
    id: 'c7', 
    label: 'Focus Blur', 
    interactionType: 'focus-blur', 
    description: 'Focuses active element while blurring out inactive sibling links.',
    cliCommand: 'npx amicro@latest add focus-blur' 
  },
  { 
    id: 'c8', 
    label: '3D Tilt Card', 
    interactionType: 'card-3d-tilt', 
    description: 'Interactive card that tilts in 3D perspective to follow the cursor.',
    cliCommand: 'npx amicro@latest add card-3d-tilt' 
  },
  { 
    id: 'c9', 
    label: 'Stack Deck Stagger', 
    interactionType: 'card-stack-deck', 
    description: 'Cascading vertical stack deck that spreads and fans on hover.',
    cliCommand: 'npx amicro@latest add card-stack-deck' 
  },
  { 
    id: 'c10', 
    label: 'Interactive Border Glow', 
    interactionType: 'card-border-glow', 
    description: 'Glowing border gradient effect tracking the cursor coordinate.',
    cliCommand: 'npx amicro@latest add card-border-glow' 
  }
];

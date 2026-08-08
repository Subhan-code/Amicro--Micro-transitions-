import React from 'react';

export type FormInteractionType = 
  | 'floating-label-input'
  | 'input-focus-glow'
  | 'password-toggle'
  | 'search-expand'
  | 'checkbox-draw'
  | 'radio-scale'
  | 'error-shake'
  | 'success-check'
  | 'select-dropdown'
  | 'multi-select-chips'
  | 'textarea-auto-grow'
  | 'otp-input'
  | 'file-upload-dropzone'
  | 'range-slider'
  | 'form-submit-button';

export interface FormElementConfig {
  id: string;
  label: string;
  interactionType: FormInteractionType;
  description: string;
  cliCommand: string;
}

export const formElementsData: FormElementConfig[] = [
  {
    id: 'frm1',
    label: 'Floating Label Input',
    interactionType: 'floating-label-input',
    description: 'Label floats up cleanly on focus with spring displacement.',
    cliCommand: 'npx @subhanhq/amicro@latest add floating-label-input',
  },
  {
    id: 'frm2',
    label: 'Input Focus Glow',
    interactionType: 'input-focus-glow',
    description: 'Soft animated halo glow expands on input field focus.',
    cliCommand: 'npx @subhanhq/amicro@latest add input-focus-glow',
  },
  {
    id: 'frm3',
    label: 'Password Toggle',
    interactionType: 'password-toggle',
    description: 'Eye icon morphs smoothly to reveal or hide password characters.',
    cliCommand: 'npx @subhanhq/amicro@latest add password-toggle',
  },
  {
    id: 'frm4',
    label: 'Search Expand',
    interactionType: 'search-expand',
    description: 'Minimal search pill expands laterally on focus with icon shift.',
    cliCommand: 'npx @subhanhq/amicro@latest add search-expand',
  },
  {
    id: 'frm5',
    label: 'Checkbox Path Draw',
    interactionType: 'checkbox-draw',
    description: 'Custom checkbox with animated SVG checkmark stroke on select.',
    cliCommand: 'npx @subhanhq/amicro@latest add checkbox-draw',
  },
  {
    id: 'frm6',
    label: 'Radio Scale',
    interactionType: 'radio-scale',
    description: 'Radio button scales with spring physics and fills inner core.',
    cliCommand: 'npx @subhanhq/amicro@latest add radio-scale',
  },
  {
    id: 'frm7',
    label: 'Error Shake',
    interactionType: 'error-shake',
    description: 'Horizontal elastic shake vibration on input validation failure.',
    cliCommand: 'npx @subhanhq/amicro@latest add error-shake',
  },
  {
    id: 'frm8',
    label: 'Success Check Draw',
    interactionType: 'success-check',
    description: 'Green checkmark path draws upon successful field validation.',
    cliCommand: 'npx @subhanhq/amicro@latest add success-check',
  },
  {
    id: 'frm9',
    label: 'Select Dropdown',
    interactionType: 'select-dropdown',
    description: 'Custom select menu expands with origin-aware scale & blur fade.',
    cliCommand: 'npx @subhanhq/amicro@latest add select-dropdown',
  },
  {
    id: 'frm10',
    label: 'Multi-Select Chips',
    interactionType: 'multi-select-chips',
    description: 'Selected tag items pop into view as dismissible animated chips.',
    cliCommand: 'npx @subhanhq/amicro@latest add multi-select-chips',
  },
  {
    id: 'frm11',
    label: 'Textarea Auto-Grow',
    interactionType: 'textarea-auto-grow',
    description: 'Textarea container height expands smoothly with input content length.',
    cliCommand: 'npx @subhanhq/amicro@latest add textarea-auto-grow',
  },
  {
    id: 'frm12',
    label: 'OTP 4-Digit Input',
    interactionType: 'otp-input',
    description: 'Character boxes with automatic focus advance & spring highlight.',
    cliCommand: 'npx @subhanhq/amicro@latest add otp-input',
  },
  {
    id: 'frm13',
    label: 'File Upload Dropzone',
    interactionType: 'file-upload-dropzone',
    description: 'Drag-over pulsing border ring with upload arrow icon animation.',
    cliCommand: 'npx @subhanhq/amicro@latest add file-upload-dropzone',
  },
  {
    id: 'frm14',
    label: 'Spring Range Slider',
    interactionType: 'range-slider',
    description: 'Slider thumb with spring bounce and floating value tooltip pop.',
    cliCommand: 'npx @subhanhq/amicro@latest add range-slider',
  },
  {
    id: 'frm15',
    label: 'Form Submit Morph',
    interactionType: 'form-submit-button',
    description: 'Submit button morphs into loading spinner then checkmark state.',
    cliCommand: 'npx @subhanhq/amicro@latest add form-submit-button',
  },
];

import { togglesData, ToggleConfig } from './toggles';
import { textAnimationsData, TextAnimationConfig } from './textAnimations';
import { formElementsData, FormElementConfig } from './formElements';

export interface ClubbedComponentGroup {
  category: string;
  items: (ToggleConfig | TextAnimationConfig | FormElementConfig)[];
}

export const clubbedComponentsData: ClubbedComponentGroup[] = [
  {
    category: 'Toggles',
    items: togglesData,
  },
  {
    category: 'Text Motion',
    items: textAnimationsData,
  },
  {
    category: 'Form Elements',
    items: formElementsData,
  },
];

export { togglesData, textAnimationsData, formElementsData };

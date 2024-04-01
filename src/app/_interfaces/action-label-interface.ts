import { Color } from '@angular-material-components/color-picker';

export interface IActionLabel {
  text: string;
  id: string;
  color?: Color;
  backgroundColor?: Color;
  mode?: 'color' | 'chart';
  elementID?: string,
  elementColor?: Color,
}

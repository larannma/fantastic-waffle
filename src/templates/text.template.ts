import { buttonTemplate } from "./button.template";
import {type IButton} from './button.template';

export const textTemplate = buttonTemplate + ` Text {{textName}}`

export interface IText extends IButton {
  textName: string;
}
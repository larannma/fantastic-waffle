import './button.scss';
import Handlebars from 'handlebars';
import { buttonTemplate, type IButton } from './button.template'; 

export const Button = ({ label }: IButton) => {
  const compiledTemplate = Handlebars.compile(buttonTemplate);

  const result = compiledTemplate({ label });

  const container = document.createElement('div');
  container.innerHTML = result;
  
  return container.querySelector('button') as HTMLElement;
}

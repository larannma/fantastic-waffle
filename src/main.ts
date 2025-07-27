import Handlebars from 'handlebars';
import { textTemplate, type IText } from './templates/text.template';

const TextProps: IText = {
  textName: 'lol',
  label: 'kek'
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#app');

  const buttonTemplateCompiled = Handlebars.compile(textTemplate)

  const result = buttonTemplateCompiled(TextProps)

  root.innerHTML = result
})

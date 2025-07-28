import { Button } from './templates/button/button';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#app');
  const buttonElement = Button({ label: 'Click Me' });
  root!.appendChild(buttonElement);
})

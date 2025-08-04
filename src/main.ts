import App from "./App"
import './styles/main.scss'
import './styles/normalize.scss'
import './styles/variables.scss'
import './styles/fonts.scss'

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.render();
});

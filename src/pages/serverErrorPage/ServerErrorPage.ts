import { Component } from "../../services/Component";
import template from "./serverErrorPage.hbs";
import "./serverErrorPage.scss";

export class ServerErrorPage extends Component {
  constructor() {
    super("main", {
      class: "main",
      ".serverError__back-to-chats": {
        click: (e: Event) => this.onBackToChats(e),
      },
    });
  }

  render() {
    return template(this.props);
  }

  private onBackToChats(e: Event) {
    e.preventDefault();
    // Emit custom event for navigation
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'chats' },
      bubbles: true
    }));
  }
}

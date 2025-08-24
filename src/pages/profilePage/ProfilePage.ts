import { Component } from "../../services/Component";
import template from "./profilePage.hbs";
import "./profilePage.scss";
import { ValidationForm } from "../../services/ValidationForm";

export class ProfilePage extends Component {
  constructor() {
    super("main", {
      class: "main",
      ".profile__back-to-chats": {
        click: (e: Event) => this.onBackToChats(e),
      },
      ".profile__save-btn": {
        click: (e: Event) => this.onSaveChanges(e),
      },
    });
  }

  render() {
    return template(this.props);
  }

  componentDidMount() {
    const form = this.getContent().querySelector<HTMLFormElement>(".profile__form");
    if (!form) return;

    // Initialize validation for the form
    new ValidationForm(form);
  }

  private onBackToChats(e: Event) {
    e.preventDefault();
    // Emit custom event for navigation
    this.getContent().dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'chats' },
      bubbles: true
    }));
  }

  private onSaveChanges(e: Event) {
    e.preventDefault();
    // Handle save changes logic with validation
    const form = this.getContent().querySelector<HTMLFormElement>(".profile__form");
    if (form) {
      const validator = new ValidationForm(form);
      
      if (validator.validateForm()) {
        const values = validator.getValues();
        console.log("✅ Profile form valid, collected values:", values);
      } else {
        console.log("❌ Profile form invalid");
      }
    }
  }
}

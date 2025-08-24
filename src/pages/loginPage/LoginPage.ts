import { Component } from "../../services/Component";
import template from "./loginPage.hbs";
import "./loginPage.scss";
import { ValidationForm } from "../../services/ValidationForm";

export class LoginPage extends Component {
  private validator: ValidationForm | null = null;

  constructor() {
    super("main", {
      class: "main",
      ".login__form": {
        submit: (e: Event) => this.onSubmit(e),
      },
    });
  }

  render() {
    return template(this.props);
  }

  componentDidMount() {
    const form = this.getContent().querySelector<HTMLFormElement>(".login__form");
    if (!form) return;

    // чтобы работало сразу на блюре
    this.validator = new ValidationForm(form);
  }

  private onSubmit(e: Event) {
    e.preventDefault();

    const form = this.getContent().querySelector<HTMLFormElement>(".login__form");
    if (!form) return;

    const validator = new ValidationForm(form);

    if (validator.validateForm()) {
      const values = validator.getValues();
      // console.log("✅ Form valid, collected values:", values);
    } else {
      // console.log("❌ Form invalid");
    }
  }
}

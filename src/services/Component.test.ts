import { expect } from 'chai';

import { Component, type ComponentProps } from './Component';

interface TestComponentProps extends ComponentProps {
  label: string;
  class?: string;
}

class TestComponent extends Component<TestComponentProps> {
  constructor(props: TestComponentProps) {
    super('section', props);
  }

  render() {
    return `<button class="action">${this.props.label as string}</button>`;
  }
}

describe('Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates element with provided tag and class and renders content', () => {
    const component = new TestComponent({
      label: 'Click me',
      class: 'test-wrapper',
    });

    const content = component.getContent();
    expect(content.tagName).to.equal('SECTION');
    expect(content.className).to.equal('test-wrapper');
    expect(content.querySelector('.action')?.textContent).to.equal('Click me');
  });

  it('re-renders when props are updated via setProps', () => {
    const component = new TestComponent({ label: 'Before' });

    component.setProps({ label: 'After' });

    expect(component.getContent().querySelector('.action')?.textContent).to.equal('After');
  });

  it('binds DOM events declared in props selectors', () => {
    let clicked = 0;

    const component = new TestComponent({
      label: 'Action',
      '.action': {
        click: () => {
          clicked += 1;
        },
      },
    });

    document.body.appendChild(component.getContent());

    const actionButton = component.getContent().querySelector('.action') as HTMLElement;
    actionButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(clicked).to.equal(1);
  });
});

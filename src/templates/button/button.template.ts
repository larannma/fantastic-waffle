const className = 'button'

export const buttonTemplate = `
  <button class=${className}>Button {{label}}</button>
`
export interface IButton {
  label: string;
}
export enum ControlType {
  RADIO,
  BUTTON,
  NUMBER
}

export type RadioControls = {
  type: ControlType.RADIO;
  selected: string;
  options: string[];
  select: (selection: string) => void;
}

export type CheckboxControls = {
  type: ControlType.RADIO;
  selected: string[];
  options: string[];
  select: (selection: string) => void;
}

export type ButtonControl = {
  type: ControlType.BUTTON;
  label: string;
  disabled: boolean;
  action: () => void;
}

export type NumberControl = {
  type: ControlType.NUMBER;
  label: string;
  value: number;
  increaseAction: () => void;
  decreaseAction: () => void;
}

type Control = RadioControls | ButtonControl | NumberControl;

type ControlSection = {
  title: string;
  controls: Control[];
}

export type VisualControls = ControlSection[];

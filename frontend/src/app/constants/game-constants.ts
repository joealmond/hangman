export enum MessageType {
  INFO,
  ERROR,
  WON,
  LOST,
  PLACEHOLDER,
}

export const messageTypeClasses: Record<MessageType | string, string> = {
  [MessageType.INFO]: 'info',
  [MessageType.ERROR]: 'error',
  [MessageType.WON]: 'victory',
  [MessageType.LOST]: 'gameOver',
  [MessageType.PLACEHOLDER]: 'placeholder',
  INFO: 'info',
  ERROR: 'error',
  WON: 'victory',
  LOST: 'gameOver',
  PLACEHOLDER: 'placeholder',
};

export const alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

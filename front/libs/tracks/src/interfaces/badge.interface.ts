import { IconType } from 'react-icons';

export interface Badge {
  backgroundColor: string;
  Icon: IconType;
  label: string;
}

export interface Badges {
  [key: string]: Badge;
}

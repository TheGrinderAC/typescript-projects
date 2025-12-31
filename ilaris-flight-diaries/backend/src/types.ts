import { z } from 'zod';
import { newEntrySchema } from './utils';

export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}

export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

// also can be like below
// export interface DiaryEntry extends  z.infer<typeof newEntrySchema> {
//   id: number;
// }

export type NewDiaryEntry = z.infer<typeof newEntrySchema>;
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;

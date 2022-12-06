import {OCRFrame} from 'vision-camera-ocr';

export type TextBlock = OCRFrame['result']['blocks'][0];

export type IdTextBlock = TextBlock & {
  id: string;
};

export type ScanData = {
  frame: {width: number; height: number};
  text: IdTextBlock[];
};

import {NativeModules} from 'react-native';

const {TextRecognitionManager} = NativeModules;

interface CornerPoint {
  y: number;
  x: number;
}

interface Bounding {
  height: number;
  width: number;
  left: number;
  top: number;
}

interface Element {
  elements?: Element[];
  bounding: Bounding;
  cornerPoints: CornerPoint[];
  text: string;
}

export interface TextData {
  cornerPoints: CornerPoint[];
  lines: Element[];
  text: string;
  bounding: Bounding;
}

interface TextRecognitionInterface {
  parseTextInImage(path: string): Promise<TextData[]>;
}

export default TextRecognitionManager as TextRecognitionInterface;

import {useState} from 'react';
import {OCRFrame} from 'vision-camera-ocr';
import {ScanData} from '../../types';

export type TextBlock = OCRFrame['result']['blocks'][0];
type SelectedBlock = {block: TextBlock; selected: boolean};

export const useBlocks = () => {
  const [blockStash, setBlockStash] = useState<TextBlock[]>([]);
  const [blocks, setBlocks] = useState<SelectedBlock[]>();
  const loadBlocks = (data?: ScanData) => {
    const loadingBlocks = data?.text;
    if (!loadingBlocks) {
      setBlocks(loadingBlocks);
      return;
    }
    const loadedBlocks = [
      ...blockStash.map(block => ({block, selected: true})),
    ];
    const autoSelect = loadingBlocks.length < 10;
    loadedBlocks.push(
      ...loadingBlocks.map(block => ({block, selected: autoSelect})),
    );
    setBlocks(loadedBlocks);
    setBlockStash([]);
  };
  const toggleBlock = (selectedBlock: SelectedBlock) => {
    setBlocks(pBlocks => {
      const toggleIndex = pBlocks?.indexOf(selectedBlock);
      return pBlocks?.map(({block: previousBlock, selected}, i) =>
        i === toggleIndex
          ? {block: previousBlock, selected: !selected}
          : {block: previousBlock, selected},
      );
    });
  };

  const selectAllBlocks = () => {
    setBlocks(pBlocks => pBlocks?.map(block => ({...block, selected: true})));
  };
  const unselectBlocks = () => {
    setBlocks(pBlocks => pBlocks?.map(block => ({...block, selected: false})));
  };
  const stashBlocks = () => {
    setBlockStash(
      blocks?.filter(({selected}) => selected).map(({block}) => block) || [],
    );
    setBlocks(undefined);
  };

  return {
    loadBlocks,
    blocks,
    toggleBlock,
    selectAllBlocks,
    unselectBlocks,
    stashBlocks,
  };
};

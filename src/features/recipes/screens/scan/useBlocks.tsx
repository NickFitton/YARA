import {useState} from 'react';
import {OCRFrame} from 'vision-camera-ocr';

export type TextBlock = OCRFrame['result']['blocks'][0];
type SelectedBlock = {block: TextBlock; selected: boolean};

export const useBlocks = () => {
  const [blockStash, setBlockStash] = useState<TextBlock[]>([]);
  const [blocks, setBlocks] = useState<SelectedBlock[]>();
  const loadBlocks = (blocks?: TextBlock[]) => {
    if (!blocks) {
      setBlocks(blocks);
      return;
    }
    let loadedBlocks = [...blockStash.map(block => ({block, selected: true}))];
    const autoSelect = blocks.length < 10;
    loadedBlocks.push(...blocks.map(block => ({block, selected: autoSelect})));
    setBlocks(loadedBlocks);
    setBlockStash([]);
  };
  const toggleBlock = (block: SelectedBlock) => {
    setBlocks(pBlocks => {
      const toggleIndex = pBlocks?.indexOf(block);
      return pBlocks?.map(({block, selected}, i) =>
        i === toggleIndex ? {block, selected: !selected} : {block, selected},
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

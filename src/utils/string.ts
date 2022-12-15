export const toTitleCase = (word: string): string => {
  if (word.length === 0) {
    return '';
  }
  const [firstLetter, ...rest] = word;
  return firstLetter.toLocaleUpperCase() + rest.join('');
};

/**
 * Takes a string of words split with spaces and formats them in a sentence cased format.
 */
export const itemToSentenceCase = (item: string): string => {
  const [firstWord, ...restWords] = item
    .split(' ')
    .map(word => word.toLowerCase());
  return [toTitleCase(firstWord), ...restWords].join(' ');
};

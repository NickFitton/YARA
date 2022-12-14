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
export const itemToSentenceCase = (item: string): string =>
  item
    .split('.')
    .map(sentence => sentence.trim())
    .map(sentence => {
      const [firstWord, ...restWords] = sentence
        .split(' ')
        .map(word => word.toLowerCase());
      return [toTitleCase(firstWord), ...restWords].join(' ');
    })
    .join('. ')
    .trim();

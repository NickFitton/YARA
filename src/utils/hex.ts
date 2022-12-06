function generateHex(length: number): string {
  const decimalMax = parseInt(''.padEnd(length, 'f'), 16);
  return Math.floor(Math.random() * decimalMax)
    .toString(16)
    .padStart(length, '0');
}

export function randomHex(length: number): string {
  let copyLength = parseInt(`${length}`, 10);
  let hex = '';
  while (copyLength > 0) {
    hex += generateHex(Math.min(12, copyLength));
    copyLength -= 12;
  }
  return hex;
}

import {randomHex} from '../hex';

describe('hex', () => {
  it('should return a hex string of the given length', () => {
    expect(randomHex(5)).toHaveLength(5);
  });
});

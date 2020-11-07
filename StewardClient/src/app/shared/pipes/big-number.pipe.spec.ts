import { BigNumberPipe } from './big-number.pipe';

describe('BigNumbersPipe', () => {
  it('create an instance', () => {
    const pipe = new BigNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it('formats BigInts', () => {
    const pipe = new BigNumberPipe();
    const acceptableNumber = BigInt(Number.MAX_SAFE_INTEGER);
    const formatted = pipe.transform(acceptableNumber);
    expect(formatted).toBe("9,007,199,254,740,991");
  });

  it('formats numbers', () => {
    const pipe = new BigNumberPipe();
    const acceptableNumber = Number.MAX_SAFE_INTEGER;
    const formatted = pipe.transform(acceptableNumber);
    expect(formatted).toBe("9,007,199,254,740,991");
  });

  it('handles numbers above MAX_SAFE_INTEGER', () => {
    const pipe = new BigNumberPipe();
    const tooLargeNumber = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(Number.MAX_SAFE_INTEGER);
    const formatted = pipe.transform(tooLargeNumber);
    expect(formatted).toBe("81,129,638,414,606,663,681,390,495,662,081");
  });

  it('handles decimals', () => {
    const pipe = new BigNumberPipe();
    const acceptableNumber = 8675.309;
    const formatted = pipe.transform(acceptableNumber);
    expect(formatted).toBe("8,675.309");
  });
});

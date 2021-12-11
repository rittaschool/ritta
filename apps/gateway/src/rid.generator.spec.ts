import { generateRID } from './rid.generator';

describe('RID Generator', () => {
  it('should generate a random id', () => {
    const rid = generateRID();

    expect(rid).toBeDefined();
  });

  it('should be unique', () => {
    const rid1 = generateRID();
    const rid2 = generateRID();

    expect(rid1).toBeDefined();
    expect(rid2).toBeDefined();

    expect(rid1).not.toEqual(rid2);
  });

  it('should not be over 7 characters and less than 5', () => {
    const rid = generateRID();

    expect(rid.length).toBeLessThanOrEqual(7);
    expect(rid.length).toBeGreaterThanOrEqual(5);
  });
});

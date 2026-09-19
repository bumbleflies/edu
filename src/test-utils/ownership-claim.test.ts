import { describe, it, expect } from 'vitest';
import { handedOver, ownershipClaim } from './ownership-claim';

describe('ownership-claim matchers (the guard needs teeth)', () => {
  it.each([
    "Every kid gets a robot, a coach's attention",
    'Every kid gets their own robot',
    'Jedes Kind bekommt einen eigenen Roboter, echte Betreuung',
    'Jedes Kind bekommt einen Roboter',
    'Kids keep their mbot2 robot',
    'the mbot2 robot to keep',
    'Roboter zum Behalten',
    'ein Roboter zum Mitnehmen',
    'they take home the robot',
    'Jedes Kind geht mit dem Roboter nach Hause',
  ])('flags: %s', (phrase) => {
    expect(ownershipClaim.test(phrase)).toBe(true);
  });

  it.each([
    "Every kid has their own robot in class, a coach's attention",
    'Every kid works with their own robot',
    'Jedes Kind hat im Kurs seinen eigenen Roboter, echte Betreuung',
    'an mbot2 robot to use during the course (not to keep)',
    'Keep unfolding: courses, prices & team →',
    'Weiter aufklappen: Kurse, Preise & Team →',
    'Kids keep coding',
  ])('accepts: %s', (phrase) => {
    expect(ownershipClaim.test(phrase)).toBe(false);
  });

  it('handedOver is the narrow matcher for machine-readable files: "take home pride" is fine there', () => {
    expect(handedOver.test('Every kid gets a robot')).toBe(true);
    expect(handedOver.test('Jedes Kind bekommt einen eigenen Roboter')).toBe(true);
    expect(handedOver.test('a working creation they take home pride in')).toBe(false);
    expect(ownershipClaim.test('a working creation they take home pride in')).toBe(true);
  });
});

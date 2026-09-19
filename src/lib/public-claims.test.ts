import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const readPublic = (path: string) =>
  readFileSync(fileURLToPath(new URL(`../../public/${path}`, import.meta.url)), 'utf-8');

/** Machine-readable / AI-facing files that describe what a course includes. */
const machineReadableFiles = [
  'facts.json',
  'agents.md',
  'llms.txt',
  'llms-full.txt',
  '.well-known/agent-card.json',
];

describe('machine-readable site data', () => {
  it.each(machineReadableFiles)('%s does not claim kids keep the mbot2 robot', (file) => {
    expect(readPublic(file)).not.toMatch(/robot to keep/i);
    expect(readPublic(file)).not.toMatch(/\bkids? keep (their|the|a|an|his|her)\b[^.\n]*robots?/i);
  });

  it('states in facts.json that the robot is for use during the course only', () => {
    const facts = JSON.parse(readPublic('facts.json')) as {
      courses: { whatIsIncluded: string }[];
    };
    expect(facts.courses).toHaveLength(2);
    for (const course of facts.courses) {
      expect(course.whatIsIncluded).toBe(
        'All materials, instruction, and an mbot2 robot to use during the course (not to keep)',
      );
    }
  });

  it.each(['agents.md', 'llms.txt', 'llms-full.txt'])('%s uses the corrected inclusion line', (file) => {
    expect(readPublic(file)).toContain(
      "What's included:** All materials, instruction, and an mbot2 robot to use during the course (not to keep)",
    );
  });

  it('describes booking info in the agent card without the robot-to-keep claim', () => {
    const card = JSON.parse(readPublic('.well-known/agent-card.json')) as {
      skills: { id: string; description: string }[];
    };
    const booking = card.skills.find((s) => s.id === 'booking-info');
    expect(booking?.description).toContain(
      'all materials + an mbot2 robot to use during the course',
    );
  });
});

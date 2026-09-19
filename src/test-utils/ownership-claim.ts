/**
 * Wording that says a kid is handed a robot. Kids only work with an mbot2 during the course,
 * so "gets a robot" / "bekommt einen eigenen Roboter" read as a gift.
 */
export const handedOver =
  /\bgets? (a|an|their|his|her|its)( own)? robots?\b|\bbekommt (einen|ein)( eigenen| eigenes)? roboter\b/i;

/** Visible flyer copy: the robot is handed over, kept or taken home. */
export const ownershipClaim = new RegExp(
  [
    handedOver.source,
    String.raw`\bkeeps? (their|the|a|an|his|her|your)\b`,
    'robot to keep',
    'behalten',
    'zum mitnehmen',
    'take home',
    'nach hause',
  ].join('|'),
  'i',
);

const BLOCKED_WORDS = [
  'penis', 'vagina', 'dick', 'cock', 'pussy', 'boob', 'boobs', 'tits', 'titties',
  'ass', 'anus', 'nude', 'naked', 'porn', 'sex', 'sexual', 'hentai', 'xxx',
  'gun', 'guns', 'rifle', 'pistol', 'shotgun', 'murder', 'kill', 'killing',
  'bomb', 'explosive', 'terrorist', 'terrorism',
  'drug', 'drugs', 'cocaine', 'heroin', 'meth',
  'racial', 'racist', 'slur',
  'rape', 'molest',
  'shit', 'fuck', 'bitch', 'cunt', 'whore',
];

const REJECTION_MESSAGE = "HEY — there's kids present! 👶 I think you're on the wrong site, buddy.";

export function checkContentFilter(prompt: string): { allowed: boolean; message: string } {
  const lower = prompt.toLowerCase().replace(/[^a-z\s]/g, '');
  const words = lower.split(/\s+/);

  const found = BLOCKED_WORDS.some(blocked =>
    words.some(word => word === blocked || word.includes(blocked))
  );

  if (found) {
    return { allowed: false, message: REJECTION_MESSAGE };
  }

  return { allowed: true, message: '' };
}

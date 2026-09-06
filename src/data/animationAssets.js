// Pools of emoji for animated explanations
export const ANIMALS = ['🐶', '🐱', '🐸', '🐼', '🦊', '🐯', '🐻', '🦁', '🐧', '🦋', '🐝', '🦄'];
export const FRUITS  = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍋', '🍉', '🍑', '🥝', '🍒', '🫐', '🥭'];

const ALL_EMOJIS = [...ANIMALS, ...FRUITS];

const LABELS = [
  'puppies','kittens','frogs','pandas','foxes','tigers','bears','lions',
  'penguins','butterflies','bees','unicorns',
  'apples','bananas','grapes','strawberries','oranges','lemons',
  'watermelons','peaches','kiwis','cherries','blueberries','mangoes',
];

/**
 * Returns a single emoji and its label for a question.
 * Each question index maps to a DIFFERENT, CONSISTENT emoji.
 * The same questionIndex always returns the same emoji.
 */
export function getSingleEmojiForQuestion(questionIndex) {
  const idx = questionIndex % ALL_EMOJIS.length;
  return {
    emoji: ALL_EMOJIS[idx],
    label: LABELS[idx] || 'things',
  };
}

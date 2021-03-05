/**
 * Polyfill Screeps game object.
 *
 * @returns Game - Game Object with Date.now() fallback.
 */
const fallbackGameInstance: () => Game = () => {
  const gameObject = {};

  Object.defineProperty(gameObject, 'time', {
    get: () => Date.now(),
    set: () => {
      throw new Error('Cannot modify time');
    },
    configurable: false,
    enumerable: false
  });

  return gameObject as Game;
};

export { fallbackGameInstance };

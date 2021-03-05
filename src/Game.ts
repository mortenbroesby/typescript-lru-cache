const fallbackGame: () => Game = () => {
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

export const GameObject = global.Game ?? fallbackGame();

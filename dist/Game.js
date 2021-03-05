"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallbackGameInstance = void 0;
/**
 * Polyfill Screeps game object.
 *
 * @returns Game - Game Object with Date.now() fallback.
 */
const fallbackGameInstance = () => {
    const gameObject = {};
    Object.defineProperty(gameObject, 'time', {
        get: () => Date.now(),
        set: () => {
            throw new Error('Cannot modify time');
        },
        configurable: false,
        enumerable: false
    });
    return gameObject;
};
exports.fallbackGameInstance = fallbackGameInstance;
//# sourceMappingURL=Game.js.map
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const fallbackGame = () => {
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
exports.GameObject = (_a = global.Game) !== null && _a !== void 0 ? _a : fallbackGame();
//# sourceMappingURL=Game.js.map
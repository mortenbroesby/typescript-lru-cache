"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCacheNode = void 0;
const Game_1 = require("./Game");
class LRUCacheNode {
    constructor(key, value, options) {
        this.Game = Game_1.GameObject;
        const { entryExpirationTimeInTicks = null, next = null, prev = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed } = options || {};
        if (typeof entryExpirationTimeInTicks === 'number' &&
            (entryExpirationTimeInTicks <= 0 || Number.isNaN(entryExpirationTimeInTicks))) {
            throw new Error('entryExpirationTimeInTicks must either be null (no expiry) or greater than 0');
        }
        this.key = key;
        this.value = value;
        this.created = Date.now();
        this.entryExpirationTimeInTicks = entryExpirationTimeInTicks;
        this.next = next;
        this.prev = prev;
        this.onEntryEvicted = onEntryEvicted;
        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
    }
    get isExpired() {
        return (typeof this.entryExpirationTimeInTicks === 'number' &&
            this.Game.time - this.created > this.entryExpirationTimeInTicks);
    }
    invokeOnEvicted() {
        if (this.onEntryEvicted) {
            const { key, value, isExpired } = this;
            this.onEntryEvicted({ key, value, isExpired });
        }
    }
    invokeOnEntryMarkedAsMostRecentlyUsed() {
        if (this.onEntryMarkedAsMostRecentlyUsed) {
            const { key, value } = this;
            this.onEntryMarkedAsMostRecentlyUsed({ key, value });
        }
    }
}
exports.LRUCacheNode = LRUCacheNode;
//# sourceMappingURL=LRUCacheNode.js.map
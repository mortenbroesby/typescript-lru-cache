"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCache = void 0;
const LRUCacheNode_1 = require("./LRUCacheNode");
class LRUCache {
    /**
     * Creates a new instance of the LRUCache.
     *
     * @param options Additional configuration options for the LRUCache.
     */
    constructor(options) {
        this.lookupTable = new Map();
        this.head = null;
        this.tail = null;
        const { maxSize = 25, entryExpirationTimeInTicks = null, onEntryEvicted, onEntryMarkedAsMostRecentlyUsed } = options || {};
        if (Number.isNaN(maxSize) || maxSize <= 0) {
            throw new Error('maxSize must be greater than 0.');
        }
        if (typeof entryExpirationTimeInTicks === 'number' &&
            (entryExpirationTimeInTicks <= 0 || Number.isNaN(entryExpirationTimeInTicks))) {
            throw new Error('entryExpirationTimeInTicks must either be null (no expiry) or greater than 0');
        }
        this.maxSizeInternal = maxSize;
        this.entryExpirationTimeInTicks = entryExpirationTimeInTicks;
        this.onEntryEvicted = onEntryEvicted;
        this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
    }
    /**
     * Returns the number of entries in the LRUCache object.
     *
     * @returns The number of entries in the cache.
     */
    get size() {
        return this.lookupTable.size;
    }
    /**
     * Returns the number of entries that can still be added to the LRUCache without evicting existing entries.
     *
     * @returns The number of entries that can still be added without evicting existing entries.
     */
    get remainingSize() {
        return this.maxSizeInternal - this.size;
    }
    /**
     * Returns the most recently used (newest) entry in the cache.
     * This will not mark the entry as recently used.
     *
     * @returns The most recently used (newest) entry in the cache.
     */
    get newest() {
        if (!this.head) {
            return null;
        }
        return this.mapNodeToEntry(this.head);
    }
    /**
     * Returns the least recently used (oldest) entry in the cache.
     * This will not mark the entry as recently used.
     *
     * @returns The least recently used (oldest) entry in the cache.
     */
    get oldest() {
        if (!this.tail) {
            return null;
        }
        return this.mapNodeToEntry(this.tail);
    }
    /**
     * Returns the max number of entries the LRUCache can hold.
     *
     * @returns The max size for the cache.
     */
    get maxSize() {
        return this.maxSizeInternal;
    }
    /**
     * Sets the maxSize of the cache.
     * This will evict the least recently used entries if needed to reach new maxSize.
     *
     * @param value The new value for maxSize. Must be greater than 0.
     */
    set maxSize(value) {
        if (Number.isNaN(value) || value <= 0) {
            throw new Error('maxSize must be greater than 0.');
        }
        this.maxSizeInternal = value;
        this.enforceSizeLimit();
    }
    /**
     * Sets the value for the key in the LRUCache object. Returns the LRUCache object.
     * This marks the newly added entry as the most recently used entry.
     * If adding the new entry makes the cache size go above maxSize,
     * this will evict the least recently used entries until size is equal to maxSize.
     *
     * @param key The key of the entry.
     * @param value The value to set for the key.
     * @param entryOptions Additional configuration options for the cache entry.
     * @returns The LRUCache instance.
     */
    set(key, value, entryOptions) {
        const currentNodeForKey = this.lookupTable.get(key);
        if (currentNodeForKey) {
            this.removeNodeFromListAndLookupTable(currentNodeForKey);
        }
        const node = new LRUCacheNode_1.LRUCacheNode(key, value, {
            entryExpirationTimeInTicks: this.entryExpirationTimeInTicks,
            onEntryEvicted: this.onEntryEvicted,
            onEntryMarkedAsMostRecentlyUsed: this.onEntryMarkedAsMostRecentlyUsed,
            ...entryOptions
        });
        this.setNodeAsHead(node);
        this.lookupTable.set(key, node);
        this.enforceSizeLimit();
        return this;
    }
    /**
     * Returns the value associated to the key, or null if there is none or if the entry is expired.
     * If an entry is returned, this marks the returned entry as the most recently used entry.
     *
     * @param key The key of the entry to get.
     * @returns The cached value or null.
     */
    get(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return null;
        }
        if (node.isExpired) {
            this.removeNodeFromListAndLookupTable(node);
            return null;
        }
        this.setNodeAsHead(node);
        return node.value;
    }
    /**
     * Returns the value associated to the key, or null if there is none or if the entry is expired.
     * If an entry is returned, this will not mark the entry as most recently accessed.
     * Useful if a value is needed but the order of the cache should not be changed.
     *
     * @param key The key of the entry to get.
     * @returns The cached value or null.
     */
    peek(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return null;
        }
        if (node.isExpired) {
            this.removeNodeFromListAndLookupTable(node);
            return null;
        }
        return node.value;
    }
    /**
     * Deletes the entry for the passed in key.
     *
     * @param key The key of the entry to delete
     * @returns True if an element in the LRUCache object existed and has been removed,
     * or false if the element does not exist.
     */
    delete(key) {
        const node = this.lookupTable.get(key);
        if (!node) {
            return false;
        }
        return this.removeNodeFromListAndLookupTable(node);
    }
    /**
     * Returns a boolean asserting whether a value has been associated to the key in the LRUCache object or not.
     * This does not mark the entry as recently used.
     *
     * @param key The key of the entry to check if exists
     * @returns true if the cache contains the supplied key. False if not.
     */
    has(key) {
        return this.lookupTable.has(key);
    }
    /**
     * Removes all entries in the cache.
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.lookupTable.clear();
    }
    /**
     * Searches the cache for an entry matching the passed in condition.
     * Expired entries will be skipped (and removed).
     * If multiply entries in the cache match the condition, the most recently used entry will be returned.
     * If an entry is returned, this marks the returned entry as the most recently used entry.
     *
     * @param condition The condition to apply to each entry in the
     * @returns The first cache entry to match the condition. Null if none match.
     */
    find(condition) {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            const entry = this.mapNodeToEntry(node);
            if (condition(entry)) {
                this.setNodeAsHead(node);
                return entry;
            }
            node = node.next;
        }
        return null;
    }
    /**
     * Iterates over and applies the callback function to each entry in the cache.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as recently used.
     *
     * @param callback the callback function to apply to the entry
     */
    forEach(callback) {
        let node = this.head;
        let index = 0;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            callback(node.value, node.key, index);
            node = node.next;
            index++;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache values.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache values.
     */
    *values() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield node.value;
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache keys.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache keys.
     */
    *keys() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield node.key;
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache entries.
     */
    *entries() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield this.mapNodeToEntry(node);
            node = node.next;
        }
    }
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache entries.
     */
    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            if (node.isExpired) {
                const next = node.next;
                this.removeNodeFromListAndLookupTable(node);
                node = next;
                continue;
            }
            yield this.mapNodeToEntry(node);
            node = node.next;
        }
    }
    enforceSizeLimit() {
        let node = this.tail;
        while (node !== null && this.size > this.maxSizeInternal) {
            const prev = node.prev;
            this.removeNodeFromListAndLookupTable(node);
            node = prev;
        }
    }
    mapNodeToEntry({ key, value }) {
        return {
            key,
            value
        };
    }
    setNodeAsHead(node) {
        this.removeNodeFromList(node);
        if (!this.head) {
            this.head = node;
            this.tail = node;
        }
        else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
        node.invokeOnEntryMarkedAsMostRecentlyUsed();
    }
    removeNodeFromList(node) {
        if (node.prev !== null) {
            node.prev.next = node.next;
        }
        if (node.next !== null) {
            node.next.prev = node.prev;
        }
        if (this.head === node) {
            this.head = node.next;
        }
        if (this.tail === node) {
            this.tail = node.prev;
        }
        node.next = null;
        node.prev = null;
    }
    removeNodeFromListAndLookupTable(node) {
        node.invokeOnEvicted();
        this.removeNodeFromList(node);
        return this.lookupTable.delete(node.key);
    }
}
exports.LRUCache = LRUCache;
//# sourceMappingURL=LRUCache.js.map
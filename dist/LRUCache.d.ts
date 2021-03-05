/// <reference types="screeps" />
export interface LRUCacheOptions<TKey, TValue> {
    maxSize?: number;
    entryExpirationTimeInTicks?: number | null;
    onEntryEvicted?: (evictedEntry: {
        key: TKey;
        value: TValue;
        isExpired: boolean;
    }) => void;
    onEntryMarkedAsMostRecentlyUsed?: (entry: {
        key: TKey;
        value: TValue;
    }) => void;
    gameInstance?: Game;
}
export interface LRUCacheSetEntryOptions<TKey, TValue> {
    entryExpirationTimeInTicks?: number | null;
    onEntryEvicted?: (evictedEntry: {
        key: TKey;
        value: TValue;
        isExpired: boolean;
    }) => void;
    onEntryMarkedAsMostRecentlyUsed?: (entry: {
        key: TKey;
        value: TValue;
    }) => void;
}
export interface LRUCacheEntry<TKey, TValue> {
    key: TKey;
    value: TValue;
}
export declare class LRUCache<TKey = string, TValue = any> {
    private readonly lookupTable;
    private readonly entryExpirationTimeInTicks;
    private readonly onEntryEvicted?;
    private readonly onEntryMarkedAsMostRecentlyUsed?;
    private maxSizeInternal;
    private head;
    private tail;
    private readonly gameInstance;
    /**
     * Creates a new instance of the LRUCache.
     *
     * @param options Additional configuration options for the LRUCache.
     */
    constructor(options?: LRUCacheOptions<TKey, TValue>);
    /**
     * Returns the number of entries in the LRUCache object.
     *
     * @returns The number of entries in the cache.
     */
    get size(): number;
    /**
     * Returns the number of entries that can still be added to the LRUCache without evicting existing entries.
     *
     * @returns The number of entries that can still be added without evicting existing entries.
     */
    get remainingSize(): number;
    /**
     * Returns Game instance.
     */
    get Game(): Game;
    /**
     * Returns the most recently used (newest) entry in the cache.
     * This will not mark the entry as recently used.
     *
     * @returns The most recently used (newest) entry in the cache.
     */
    get newest(): LRUCacheEntry<TKey, TValue> | null;
    /**
     * Returns the least recently used (oldest) entry in the cache.
     * This will not mark the entry as recently used.
     *
     * @returns The least recently used (oldest) entry in the cache.
     */
    get oldest(): LRUCacheEntry<TKey, TValue> | null;
    /**
     * Returns the max number of entries the LRUCache can hold.
     *
     * @returns The max size for the cache.
     */
    get maxSize(): number;
    /**
     * Sets the maxSize of the cache.
     * This will evict the least recently used entries if needed to reach new maxSize.
     *
     * @param value The new value for maxSize. Must be greater than 0.
     */
    set maxSize(value: number);
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
    set(key: TKey, value: TValue, entryOptions?: LRUCacheSetEntryOptions<TKey, TValue>): LRUCache<TKey, TValue>;
    /**
     * Returns the value associated to the key, or null if there is none or if the entry is expired.
     * If an entry is returned, this marks the returned entry as the most recently used entry.
     *
     * @param key The key of the entry to get.
     * @returns The cached value or null.
     */
    get(key: TKey): TValue | null;
    /**
     * Returns the value associated to the key, or null if there is none or if the entry is expired.
     * If an entry is returned, this will not mark the entry as most recently accessed.
     * Useful if a value is needed but the order of the cache should not be changed.
     *
     * @param key The key of the entry to get.
     * @returns The cached value or null.
     */
    peek(key: TKey): TValue | null;
    /**
     * Deletes the entry for the passed in key.
     *
     * @param key The key of the entry to delete
     * @returns True if an element in the LRUCache object existed and has been removed,
     * or false if the element does not exist.
     */
    delete(key: TKey): boolean;
    /**
     * Returns a boolean asserting whether a value has been associated to the key in the LRUCache object or not.
     * This does not mark the entry as recently used.
     *
     * @param key The key of the entry to check if exists
     * @returns true if the cache contains the supplied key. False if not.
     */
    has(key: TKey): boolean;
    /**
     * Removes all entries in the cache.
     */
    clear(): void;
    /**
     * Searches the cache for an entry matching the passed in condition.
     * Expired entries will be skipped (and removed).
     * If multiply entries in the cache match the condition, the most recently used entry will be returned.
     * If an entry is returned, this marks the returned entry as the most recently used entry.
     *
     * @param condition The condition to apply to each entry in the
     * @returns The first cache entry to match the condition. Null if none match.
     */
    find(condition: (entry: LRUCacheEntry<TKey, TValue>) => boolean): LRUCacheEntry<TKey, TValue> | null;
    /**
     * Iterates over and applies the callback function to each entry in the cache.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as recently used.
     *
     * @param callback the callback function to apply to the entry
     */
    forEach(callback: (value: TValue, key: TKey, index: number) => void): void;
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache values.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache values.
     */
    values(): Generator<TValue>;
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache keys.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache keys.
     */
    keys(): Generator<TKey>;
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache entries.
     */
    entries(): Generator<LRUCacheEntry<TKey, TValue>>;
    /**
     * Creates a Generator which can be used with for ... of ... to iterate over the cache entries.
     * Iterates in order from most recently accessed entry to least recently.
     * Expired entries will be skipped (and removed).
     * No entry will be marked as accessed.
     *
     * @returns A Generator for the cache entries.
     */
    [Symbol.iterator](): Generator<LRUCacheEntry<TKey, TValue>>;
    private enforceSizeLimit;
    private mapNodeToEntry;
    private setNodeAsHead;
    private removeNodeFromList;
    private removeNodeFromListAndLookupTable;
}
//# sourceMappingURL=LRUCache.d.ts.map
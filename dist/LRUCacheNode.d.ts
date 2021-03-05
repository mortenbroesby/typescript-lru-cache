/// <reference types="screeps" />
export interface LRUCacheNodeOptions<TKey, TValue> {
    next?: LRUCacheNode<TKey, TValue> | null;
    prev?: LRUCacheNode<TKey, TValue> | null;
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
export declare class LRUCacheNode<TKey, TValue> {
    readonly key: TKey;
    readonly value: TValue;
    readonly created: number;
    readonly entryExpirationTimeInTicks: number | null;
    next: LRUCacheNode<TKey, TValue> | null;
    prev: LRUCacheNode<TKey, TValue> | null;
    private readonly onEntryEvicted?;
    private readonly onEntryMarkedAsMostRecentlyUsed?;
    private readonly gameInstance;
    constructor(key: TKey, value: TValue, options?: LRUCacheNodeOptions<TKey, TValue>);
    /**
     * Returns Game instance.
     */
    get Game(): Game;
    get isExpired(): boolean;
    invokeOnEvicted(): void;
    invokeOnEntryMarkedAsMostRecentlyUsed(): void;
}
//# sourceMappingURL=LRUCacheNode.d.ts.map
import { GameObject } from './Game';

export interface LRUCacheNodeOptions<TKey, TValue> {
  next?: LRUCacheNode<TKey, TValue> | null;
  prev?: LRUCacheNode<TKey, TValue> | null;
  entryExpirationTimeInTicks?: number | null;
  onEntryEvicted?: (evictedEntry: { key: TKey; value: TValue; isExpired: boolean }) => void;
  onEntryMarkedAsMostRecentlyUsed?: (entry: { key: TKey; value: TValue }) => void;
}

export class LRUCacheNode<TKey, TValue> {
  public readonly key: TKey;

  public readonly value: TValue;

  public readonly created: number;

  public readonly Game: Game = GameObject;

  public readonly entryExpirationTimeInTicks: number | null;

  public next: LRUCacheNode<TKey, TValue> | null;

  public prev: LRUCacheNode<TKey, TValue> | null;

  private readonly onEntryEvicted?: (evictedEntry: { key: TKey; value: TValue; isExpired: boolean }) => void;

  private readonly onEntryMarkedAsMostRecentlyUsed?: (entry: { key: TKey; value: TValue }) => void;

  public constructor(key: TKey, value: TValue, options?: LRUCacheNodeOptions<TKey, TValue>) {
    const {
      entryExpirationTimeInTicks = null,
      next = null,
      prev = null,
      onEntryEvicted,
      onEntryMarkedAsMostRecentlyUsed
    } = options || {};

    if (
      typeof entryExpirationTimeInTicks === 'number' &&
      (entryExpirationTimeInTicks <= 0 || Number.isNaN(entryExpirationTimeInTicks))
    ) {
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

  public get isExpired(): boolean {
    return (
      typeof this.entryExpirationTimeInTicks === 'number' &&
      this.Game.time - this.created > this.entryExpirationTimeInTicks
    );
  }

  public invokeOnEvicted(): void {
    if (this.onEntryEvicted) {
      const { key, value, isExpired } = this;
      this.onEntryEvicted({ key, value, isExpired });
    }
  }

  public invokeOnEntryMarkedAsMostRecentlyUsed(): void {
    if (this.onEntryMarkedAsMostRecentlyUsed) {
      const { key, value } = this;
      this.onEntryMarkedAsMostRecentlyUsed({ key, value });
    }
  }
}

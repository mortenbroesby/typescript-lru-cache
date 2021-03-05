import { fallbackGameInstance } from './Game';

global.Game = typeof Game !== 'undefined' ? Game : fallbackGameInstance();

export interface LRUCacheNodeOptions<TKey, TValue> {
  next?: LRUCacheNode<TKey, TValue> | null;
  prev?: LRUCacheNode<TKey, TValue> | null;
  entryExpirationTimeInTicks?: number | null;
  onEntryEvicted?: (evictedEntry: { key: TKey; value: TValue; isExpired: boolean }) => void;
  onEntryMarkedAsMostRecentlyUsed?: (entry: { key: TKey; value: TValue }) => void;
  gameInstance?: Game;
}

export class LRUCacheNode<TKey, TValue> {
  public readonly key: TKey;

  public readonly value: TValue;

  public readonly created: number;

  public readonly entryExpirationTimeInTicks: number | null;

  public next: LRUCacheNode<TKey, TValue> | null;

  public prev: LRUCacheNode<TKey, TValue> | null;

  private readonly onEntryEvicted?: (evictedEntry: { key: TKey; value: TValue; isExpired: boolean }) => void;

  private readonly onEntryMarkedAsMostRecentlyUsed?: (entry: { key: TKey; value: TValue }) => void;

  private readonly gameInstance: Game;

  public constructor(key: TKey, value: TValue, options?: LRUCacheNodeOptions<TKey, TValue>) {
    const {
      entryExpirationTimeInTicks = null,
      next = null,
      prev = null,
      onEntryEvicted,
      onEntryMarkedAsMostRecentlyUsed,
      gameInstance
    } = options || {};

    if (
      typeof entryExpirationTimeInTicks === 'number' &&
      (entryExpirationTimeInTicks <= 0 || Number.isNaN(entryExpirationTimeInTicks))
    ) {
      throw new Error('entryExpirationTimeInTicks must either be null (no expiry) or greater than 0');
    }

    this.gameInstance = gameInstance ?? Game;

    this.key = key;
    this.value = value;
    this.created = this.gameInstance.time;
    this.entryExpirationTimeInTicks = entryExpirationTimeInTicks;
    this.next = next;
    this.prev = prev;

    this.onEntryEvicted = onEntryEvicted;
    this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
  }

  /**
   * Returns Game instance.
   */
  public get Game(): Game {
    return this.gameInstance;
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

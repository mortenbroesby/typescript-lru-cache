import { LRUCacheNode } from '../LRUCacheNode';

describe('LRUCacheNode', () => {
  describe('constructor', () => {
    it.each([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
      { key: 'key3', value: 'value3' }
    ])('should create a cache node with the passed in keys and values', ({ key, value }) => {
      const node = new LRUCacheNode(key, value);

      expect(node.key).toEqual(key);
      expect(node.value).toEqual(value);
      expect(typeof node.created).toBe('number');
      expect(node.entryExpirationTimeInTicks).toBeNull();
      expect(node.next).toBeNull();
      expect(node.prev).toBeNull();
    });

    it('should set null for entryExpirationTimeInTicks', () => {
      const node1 = new LRUCacheNode('key', 'value');

      expect(node1.entryExpirationTimeInTicks).toBeNull();

      const node2 = new LRUCacheNode('key', 'value', { entryExpirationTimeInTicks: null });

      expect(node2.entryExpirationTimeInTicks).toBeNull();
    });

    it.each([0.1, 1, 1099387, Number.MAX_VALUE])('should set the passed number for entryExpirationTimeInTicks', num => {
      const node = new LRUCacheNode('key', 'value', { entryExpirationTimeInTicks: num });

      expect(node.entryExpirationTimeInTicks).toBe(num);
    });

    it.each([0, -1, -1099387, NaN])('should throw for invalid entryExpirationTimeInTicks', num => {
      expect(() => new LRUCacheNode('key', 'value', { entryExpirationTimeInTicks: num })).toThrow();
    });

    it('should set the passed in next node as next', () => {
      const next = new LRUCacheNode('nextKey', 'nextValue');
      const node = new LRUCacheNode('key', 'value', { next });

      expect(node.next).toBe(next);
    });

    it('should set the passed in prev node as prev', () => {
      const prev = new LRUCacheNode('prevKey', 'prevValue');
      const node = new LRUCacheNode('key', 'value', { prev });

      expect(node.prev).toBe(prev);
    });
  });

  describe('isExpired', () => {
    it('should not be expired due to null entryExpirationTimeInTicks (no expiration)', () => {
      const node = new LRUCacheNode('key', 'value');

      expect(node.isExpired).toBe(false);

      // Force created to be less than now
      (node as any).created = 0;

      expect(node.isExpired).toBe(false);
      expect(node.entryExpirationTimeInTicks).toBeNull();
    });

    it('should not be expired', () => {
      const node = new LRUCacheNode('key', 'value', { entryExpirationTimeInTicks: 10000 });

      expect(node.isExpired).toBe(false);
      expect(node.entryExpirationTimeInTicks).not.toBeNull();
    });

    it('should be expired', () => {
      const node = new LRUCacheNode('key', 'value', { entryExpirationTimeInTicks: 10000 });

      // Force created to be less than now
      (node as any).created = 0;

      expect(node.isExpired).toBe(true);
      expect(node.entryExpirationTimeInTicks).not.toBeNull();
    });
  });

  describe('invokeOnEvicted', () => {
    it('should call the passed in onEvicted function', () => {
      const onEntryEvicted = jest.fn();

      const key = 'key';
      const value = 'value';

      const node = new LRUCacheNode(key, value, { onEntryEvicted });

      node.invokeOnEvicted();

      expect(onEntryEvicted).toBeCalledTimes(1);
      expect(onEntryEvicted).toBeCalledWith({ key, value, isExpired: false });
    });
  });

  describe('invokeOnEntryMarkedAsMostRecentlyUsed', () => {
    it('should call the passed in onEvicted function', () => {
      const onEntryMarkedAsMostRecentlyUsed = jest.fn();

      const key = 'key';
      const value = 'value';

      const node = new LRUCacheNode(key, value, { onEntryMarkedAsMostRecentlyUsed });

      node.invokeOnEntryMarkedAsMostRecentlyUsed();

      expect(onEntryMarkedAsMostRecentlyUsed).toBeCalledTimes(1);
      expect(onEntryMarkedAsMostRecentlyUsed).toBeCalledWith({ key, value });
    });
  });
});

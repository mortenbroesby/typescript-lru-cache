import { LRUCache } from '../LRUCache';
import { LRUCacheNode } from '../LRUCacheNode';

describe('LRUCache - Game', () => {
  it('should work even if global Game does not exist', () => {
    const time = 50;
    const now = jest.fn(() => time);
    Date.now = now;

    const cache = new LRUCache();

    expect(cache.Game).toBeDefined();
    expect(cache.Game.time).toBeDefined();
    expect(typeof cache.Game.time).toBe('number');
    expect(cache.Game.time).toBe(time);

    expect(now).toHaveBeenCalled();

    expect(() => {
      cache.Game.time = 0;
    }).toThrow('Cannot modify time');
  });

  it('should work with Game instance passed in', () => {
    let mockedTime: number = 1;

    const mockedGameIntance = {} as Game;

    Object.defineProperty(mockedGameIntance, 'time', {
      get: () => mockedTime
    });

    const cache = new LRUCache({
      entryExpirationTimeInTicks: 10,
      gameInstance: mockedGameIntance
    });

    const key = 'test-key';
    const value = 'test-value';

    cache.set(key, value);

    mockedTime = 5;

    let result = cache.peek(key);
    expect(result).toEqual(value);

    mockedTime = 50;

    result = cache.peek(key);
    expect(result).toEqual(null);
  });
});

describe('LRUCacheNode - Game', () => {
  it('should work even if global Game does not exist', () => {
    const node = new LRUCacheNode('key', 'value');

    expect(node.Game).toBeDefined();
    expect(node.Game.time).toBeDefined();
    expect(typeof node.Game.time).toBe('number');
    expect(node.Game.time).toBe(Date.now());

    expect(() => {
      node.Game.time = 0;
    }).toThrow('Cannot modify time');
  });

  it('should work with Game instance passed in', () => {
    let mockedTime: number = 1;

    const mockedGameIntance = {} as Game;

    Object.defineProperty(mockedGameIntance, 'time', {
      get: () => mockedTime
    });

    const node = new LRUCacheNode('key', 'value', {
      gameInstance: mockedGameIntance
    });

    expect(node.Game.time).toBe(mockedTime);

    mockedTime = 50;

    expect(node.Game.time).toBe(mockedTime);
  });
});

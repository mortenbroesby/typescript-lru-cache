import { LRUCacheNode } from '../LRUCacheNode';

describe('LRUCacheNode - Game', () => {
  it('should work even if global Game does not exist', () => {
    const node = new LRUCacheNode('key', 'value');

    expect(node.Game).toBeDefined();
    expect(node.Game.time).toBeDefined();
    expect(typeof node.Game.time).toBe('number');

    expect(() => {
      node.Game.time = 0;
    }).toThrow('Cannot modify time');
  });
});

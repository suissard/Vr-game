import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import GameView from '../GameView.vue';
import Maze from '../Maze.vue';

// Mock the socket dependency
vi.mock('../../socket', () => ({
  socket: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

describe('GameView.vue', () => {
  it('renders the Maze component when the game id is 11', () => {
    const game = { id: 11, name: '3D Maze' };
    const wrapper = mount(GameView, {
      props: { game },
      global: {
        stubs: {
          // We stub the Maze component to avoid rendering its complex 3D content
          Maze: {
            template: '<div class="stub-maze"></div>',
          },
        },
      },
    });

    expect(wrapper.findComponent(Maze).exists()).toBe(true);
    expect(wrapper.find('.game-container').exists()).toBe(false);
  });

  it('does not render the Maze component for other games', () => {
    const game = { id: 1, name: 'Galaxy Gliders' };
    const wrapper = mount(GameView, {
      props: { game },
    });

    expect(wrapper.findComponent(Maze).exists()).toBe(false);
    expect(wrapper.find('.game-container').exists()).toBe(true);
  });
});

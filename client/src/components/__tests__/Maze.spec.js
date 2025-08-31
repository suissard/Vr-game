import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Maze from '../Maze.vue';
import { socket } from '../../socket';

// Mock the entire socket module
vi.mock('../../socket', () => ({
  socket: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

// Mock Three.js and OrbitControls
vi.mock('three', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        WebGLRenderer: vi.fn(() => ({
            setSize: vi.fn(),
            render: vi.fn(),
            dispose: vi.fn(),
        })),
        Scene: vi.fn(),
        PerspectiveCamera: vi.fn(),
        BoxGeometry: vi.fn(),
        MeshStandardMaterial: vi.fn(),
        Mesh: vi.fn(),
        AmbientLight: vi.fn(),
        DirectionalLight: vi.fn(),
        BufferGeometry: vi.fn(() => ({
            setFromPoints: vi.fn(),
        })),
        LineBasicMaterial: vi.fn(),
        Line: vi.fn(),
        PlaneGeometry: vi.fn(),
        Color: vi.fn(),
    };
});

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: vi.fn(() => ({
    update: vi.fn(),
  })),
}));

describe('Maze.vue', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('emits "get maze" on mount', () => {
    mount(Maze);
    expect(socket.emit).toHaveBeenCalledWith('get maze');
  });

  it('sets up the scene when "maze data" is received', async () => {
    const wrapper = mount(Maze);

    // Find the handler for 'maze data'
    const mazeDataHandler = socket.on.mock.calls.find(
      (call) => call[0] === 'maze data'
    )[1];

    const mockMaze = {
      maze: [[1, 1, 1], [0, 0, 0], [1, 1, 1]],
      solution: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    };

    // Simulate the server sending data
    await mazeDataHandler(mockMaze);

    // Check that the canvas element is visible and has been processed
    expect(wrapper.find('canvas').exists()).toBe(true);

    // We can't easily test the three.js internals, but we can confirm
    // that the component tried to set up the renderer, which is a good proxy.
    const THREE = await import('three');
    expect(THREE.WebGLRenderer).toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const wrapper = mount(Maze);
    wrapper.unmount();

    // Check that the 'maze data' listener is removed
    expect(socket.off).toHaveBeenCalledWith('maze data');
  });
});

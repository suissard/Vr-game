// A simple implementation of a maze generator using recursive backtracking.
function generateMaze(width, height) {
  if (width % 2 === 0) width++;
  if (height % 2 === 0) height++;

  const maze = Array.from({ length: height }, () => Array(width).fill(1));

  function carve(x, y) {
    maze[y][x] = 0; // Carve a path

    const directions = [
      { x: 2, y: 0 },
      { x: -2, y: 0 },
      { x: 0, y: 2 },
      { x: 0, y: -2 },
    ];
    // Randomize directions
    directions.sort(() => Math.random() - 0.5);

    for (const dir of directions) {
      const newX = x + dir.x;
      const newY = y + dir.y;

      if (newX > 0 && newX < width - 1 && newY > 0 && newY < height - 1 && maze[newY][newX] === 1) {
        maze[y + dir.y / 2][x + dir.x / 2] = 0; // Carve wall
        carve(newX, newY);
      }
    }
  }

  carve(1, 1); // Start carving from the top-left corner

  // Create an entrance and an exit
  maze[1][0] = 0;
  maze[height - 2][width - 1] = 0;

  return maze;
}

// Solves the maze using Depth First Search
function solveMaze(maze) {
  const path = [];
  const visited = new Set();
  const start = { x: 0, y: 1 };
  const end = { x: maze[0].length - 1, y: maze.length - 2 };

  function dfs(x, y) {
    const key = `${x},${y}`;
    if (
      x < 0 ||
      x >= maze[0].length ||
      y < 0 ||
      y >= maze.length ||
      maze[y][x] === 1 ||
      visited.has(key)
    ) {
      return false;
    }

    visited.add(key);
    path.push({ x, y });

    if (x === end.x && y === end.y) {
      return true; // Path found
    }

    // Explore neighbors: Down, Right, Up, Left
    if (dfs(x, y + 1)) return true;
    if (dfs(x + 1, y)) return true;
    if (dfs(x, y - 1)) return true;
    if (dfs(x - 1, y)) return true;

    path.pop(); // Backtrack
    return false;
  }

  dfs(start.x, start.y);
  return path;
}


// Simple test to ensure the maze is solvable
if (require.main === module) {
  const width = 21;
  const height = 21;
  const maze = generateMaze(width, height);
  const solution = solveMaze(maze);

  console.log('Generated Maze:');
  maze.forEach(row => console.log(row.join(' ')));
  console.log('\\nSolution Path:');
  console.log(solution);
  if (solution.length > 0) {
    console.log('\\nTest Passed: Maze is solvable.');
  } else {
    console.error('\\nTest Failed: Maze could not be solved.');
  }
}

module.exports = { generateMaze, solveMaze };

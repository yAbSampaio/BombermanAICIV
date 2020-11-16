/*var percentages_range_obj = {
    100: {name:"ground", code:0},
    90: {name:"block_immutable", code:-1},
    50: {name:"block_mutable", code:1},
    20: {name:"buff_bomb", code: 2},
    10: {name:"buff_explosion", code: 3}
};*/
function randomArbitrary(min = 0, max = 0) {
  return Math.random() * (max - min) + min;
}

// check distance between player spawn
function checkDistance(positions, distance) {
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      if (
        i !== j &&
        Math.abs(positions[i].x - positions[j].x) <= distance &&
        Math.abs(positions[i].y - positions[j].y) <= distance
      ) {
        return false;
      }
    }
  }
  return true;
}

function sortPlayersPosition(matrix_width, matrix_height, n_players, distance) {
  var positions = new Array(n_players);
  let done = false;

  while (!done) {
    for (var i = 0; i < n_players; i++) {
      positions[i] = {
        x: Math.round(randomArbitrary(1, matrix_width - 2)),
        y: Math.round(randomArbitrary(1, matrix_height - 2)),
      };
    }
    if (checkDistance(positions, distance)) {
      done = true;
    }
  }
  return positions;
}

function calcStartArea(positions, matrix_width, matrix_height) {
  var spots = {};

  for (let i = 0; i < positions.length; i++) {
    spots["" + positions[i].x + "," + positions[i].y] = true;

    let count = 0;
    let directions = [0, 0, 0, 0];
    while (count < 2) {
      let random = Math.round(randomArbitrary(0, 3));
      switch (random) {
        case 0:
          if (positions[i].y - directions[0] > 1) {
            spots[
              "" + positions[i].x + "," + (positions[i].y - 1 - directions[0])
            ] = true;
            directions[0]++;
            count++;
          }
          break;
        case 1:
          if (positions[i].x + directions[1] < matrix_width - 2) {
            spots[
              "" + (positions[i].x + 1 + directions[1]) + "," + positions[i].y
            ] = true;

            directions[1]++;
            count++;
          }
          break;
        case 2:
          if (positions[i].y + directions[2] < matrix_height - 2) {
            spots[
              "" + positions[i].x + "," + (positions[i].y + 1 + directions[2])
            ] = true;

            directions[2]++;
            count++;
          }
          break;
        case 3:
          if (positions[i].x - directions[3] > 1) {
            spots[
              "" + (positions[i].x - 1 - directions[3]) + "," + positions[i].y
            ] = true;

            directions[3]++;
            count++;
          }
          break;
        default:
          break;
      }
    }
  }
  return spots;
}

function generateMapContent(
  matrix_width,
  matrix_height,
  grounds,
  blocks_mutable,
  blocks_immutable,
  percentages_range_obj,
  spawn_areas,
  tile_edge = 24
) {
  var map = new Array(matrix_width);
  for (var i = 0; i < matrix_width; i++) {
    if (i == 0 || i == matrix_width - 1) {
      map[i] = new Array(matrix_height).fill(-1);
    } else {
      map[i] = new Array(matrix_height);
      for (var j = 0; j < matrix_height; j++) {
        if (j == 0 || j == matrix_height - 1) {
          map[i][j] = -1;
        } else {
          let pos_x = i * tile_edge + tile_edge / 2;
          let pos_y = j * tile_edge + tile_edge / 2;
          if (spawn_areas["" + i + "," + j]) {
            grounds.create(pos_x, pos_y, "ground");
            map[i][j] = 0;
          } else {
            let percentage = Math.round(Math.random() * 100);
            let uppermost = 0;
            for (var percentage_range in percentages_range_obj) {
              if (percentage_range >= percentage) {
                uppermost = percentage_range;
                break;
              }
            }
            map[i][j] = percentages_range_obj[uppermost].code;
          }
        }
      }
    }
  }
  return map;
}

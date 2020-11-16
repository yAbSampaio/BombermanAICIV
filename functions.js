/*var percentages_range_obj = {
    100: {name:"ground", code:0},
    90: {name:"block_immutable", code:-1},
    50: {name:"block_mutable", code:1},
    20: {name:"buff_bomb", code: 2},
    10: {name:"buff_explosion", code: 3}
};*/
function randomArbitrary(max = 0, min = 0) {
  return Math.random() * (max - min) + min;
}
function checkDistance(positions, distance) {
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      if (
        i !== j &&
        Math.abs(positions[i].x - positions[j].x) <= distance &&
        Math.abs(positions[i].y - positions[j].y)
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
        x: Math.round(randomArbitrary(1, matrix_width - 1)),
        y: Math.round(randomArbitrary(1, matrix_height - 1)),
      };
    }
    if (checkDistance(positions, distance)) {
      done = true;
    }
  }
  return positions;
}

function generateMapContent(
  matrix_width,
  matrix_height,
  grounds,
  blocks_mutable,
  blocks_immutable,
  percentages_range_obj,
  n_players = 4,
  tile_edge = 24
) {
  var map = new Array(matrix_width);
  for (var i = 1; i < matrix_width; i++) {
    map[i] = new Array(matrix_height);
    for (var j = 1; j < matrix_height; j++) {
      let percentage = Math.round(Math.random() * 100);

      let uppermost = 0;
      for (var percentage_range in percentages_range_obj) {
        if (percentage_range >= percentage) {
          uppermost = percentage_range;
          break;
        }
      }
      //console.log(percentage, uppermost);
      let pos_x = i * tile_edge + tile_edge / 2;
      let pos_y = j * tile_edge + tile_edge / 2;
      if (percentages_range_obj[uppermost].code === -1) {
        blocks_immutable.create(
          pos_x,
          pos_y,
          percentages_range_obj[uppermost].name
        );
      } else {
        grounds.create(pos_x, pos_y, "ground");
      }
      if (
        percentages_range_obj[uppermost].code !== 0 &&
        percentages_range_obj[uppermost].code !== -1
      ) {
        blocks_mutable.create(pos_x, pos_y, "block_mutable");
      }
      map[i][j] = percentages_range_obj[uppermost].code;
    }
  }
  return map;
}

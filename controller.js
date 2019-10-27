import Game from "/engine/game.js";

$(document).ready(() => {
  const $board = $("#board");
  let game = new Game(4);
  updateBoardView($board, game);
  game.onMove(() => $());
  $("#reset-button").on("click", () => {
    game.setupNewGame();
    updateBoardView($board, game);
    $("#winText").addClass("hidden");
    $("#lostText").addClass("hidden");

    $("#winLoseDiv").addClass("hidden");
  });
  game.onWin(() => {
    $("#winText").removeClass("hidden");
    $("#winLoseDiv").removeClass("hidden");
  });
  game.onLose(() => {
    $("#loseText").removeClass("hidden");
    $("#winLoseDiv").removeClass("hidden");
  });  
  $(document).keydown(function(e) {
    switch (e.keyCode) {
      case 65:
      case 37:
        game.move("left");
        break;
      case 87:
      case 38:
        game.move("up");

        break;
      case 68:
      case 39:
        game.move("right");

        break;
      case 83:
      case 40:  
        game.move("down");
        break;
    }
    updateBoardView($board, game);
  });
});

let updateBoardView = ($board, game) => {
  $board.empty();
  let $board_table = $("<table></table>");
  let index = 0;
  for (let y = 0; y < 4; y++) {
    let row = $("<tr></tr>");
    for (let x = 0; x < 4; x++) {
      let spot = game.gameState.board[index];

      let spot_div = $(`<div class='spot value${spot}'></div>`);
      index++;
      spot_div.append(`<h1>${spot != 0 ? spot : ""} </h1`);
      row.append($("<td></td>").append(spot_div));
    }
    $board_table.append(row);
  }
  $board.append($board_table);
  $("#score").text(`Score: ${game.gameState.score} `);
};

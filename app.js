class Game {
  constructor() {
    this.board = new Board;
    this.lost = false;
    this.linesCleared = 0;
  }
}

class Board {
  constructor() {
    this.grid = [];
    for (var i = 0; i < 20; i++) {
      this.grid.push([]);
    }
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < 10; j++) {
        this.grid[i].push(new Square());
      }
    }
  }
}

class Square {
  constructor(full = false, active=false) {
    this.filled = full;
    this.active = active;
  }
}

class Piece {
  constructor() {
    this.squares = [new Square(true, true),new Square(true, true),new Square(true, true),new Square(true, true)];
    this.type = Math.floor(Math.random()*7);
    this.color = ['red','orange','yellow','green','blue','purple','lightblue'][this.type];
    this.combos = [[[0,3],[0,4],[1,4],[1,5]],[[1,3],[1,4],[0,5],[1,5]],
    [[0,4],[0,5],[1,4],[1,5]],[[1,3],[0,4],[1,4],[0,5]],[[0,3],[1,3],[1,4],[1,5]],
    [[1,3],[0,4],[1,4],[1,5]],[[0,3],[0,4],[0,5],[0,6]]];
  }
}

var game = new Game();

$(document).ready(function() {
  // $('.score h3').append('<span>' + game.linesCleared + '</span>');
  for (var i = 0; i < game.board.grid.length; i++) {
    for (var j = 0; j < game.board.grid[i].length; j++) {
      if (game.board.grid[i][j].filled) {
        $('.board').append('<div class="filled square '+i+'"></div>');
      } else {
        $('.board').append('<div class="square r'+i+' c'+j+'"></div>');
      }
    }
    $('.board').append("<br />");
  }
  createNewPiece();

  $(document).keydown(function(key) {
    if (key.which == 37) {
      var activeCells = moveSideActiveCells(game.board);

      var movable = true;
      for (var i = 0; i < activeCells.length; i++) {
        if (activeCells[i][1] <= 0 || (!game.board.grid[activeCells[i][0]][activeCells[i][1]-1].active && game.board.grid[activeCells[i][0]][activeCells[i][1]-1].filled)) {
          movable = false;
        }
      }
      if (movable) {
        var color = unfill(game.board, activeCells);
        for (var i = 0; i < activeCells.length; i++) {
          game.board.grid[activeCells[i][0]][activeCells[i][1]-1].active = true;
          game.board.grid[activeCells[i][0]][activeCells[i][1]-1].filled = true;
          $('.square.r'+(activeCells[i][0])+'.c'+(activeCells[i][1]-1)).addClass("filled active");
          $('.square.r'+(activeCells[i][0])+'.c'+(activeCells[i][1]-1)).attr("color", color);
        }
      }
    } else if (key.which == 39) {
      var activeCells = moveSideActiveCells(game.board);

      var movable = true;
      for (var i = 0; i < activeCells.length; i++) {
        if (activeCells[i][1] >= 9 || (!game.board.grid[activeCells[i][0]][activeCells[i][1]+1].active && game.board.grid[activeCells[i][0]][activeCells[i][1]+1].filled)) {
          movable = false;
        }
      }
      if (movable) {
        var color = unfill(game.board, activeCells);
        for (var i = 0; i < activeCells.length; i++) {
          game.board.grid[activeCells[i][0]][activeCells[i][1]+1].active = true;
          game.board.grid[activeCells[i][0]][activeCells[i][1]+1].filled = true;
          $('.square.r'+(activeCells[i][0])+'.c'+(activeCells[i][1]+1)).addClass("filled active");
          $('.square.r'+(activeCells[i][0])+'.c'+(activeCells[i][1]+1)).attr("color", color);
        }
      }
    } else if (key.which == 40) {
      moveDown();
    }
  });

  window.setInterval(function() {
    moveDown();
  }, 1000);
});

function moveDown() {
  var activeCells = findActiveCells(game.board);

  if (pieceDone(game.board, activeCells)) {
    lineFull();
    var piece = createNewPiece();
  } else {
    var color = $('.active').attr("color");
    $('.active').removeAttr("color");
    $('.active').removeClass("filled");
    $('.active').removeClass("active");
    for (var i = 0; i < activeCells.length; i++) {
      game.board.grid[activeCells[i][0]+1][activeCells[i][1]].active = true;
      game.board.grid[activeCells[i][0]+1][activeCells[i][1]].filled = true;
      $('.square.r'+(activeCells[i][0]+1)+'.c'+activeCells[i][1]).addClass("filled active");
      $('.square.r'+(activeCells[i][0]+1)+'.c'+activeCells[i][1]).attr("color", color);
    }
  }
}


function findActiveCells(board) {
  var activeCells = [];
  for (var i = 0; i < board.grid.length; i++) {
    for (var j = 0; j < board.grid[i].length; j++) {
      if (board.grid[i][j].active) {
        board.grid[i][j].active = false;
        board.grid[i][j].filled = false;
        activeCells.push([i,j]);
      }
    }
  }
  return activeCells;
}

function createNewPiece() {
  var piece = new Piece();
  for (var i = 0; i < piece.squares.length; i++) {
    if (game.board.grid[piece.combos[piece.type][i][0]][piece.combos[piece.type][i][1]].filled) {
      break;
    } else {
      game.board.grid[piece.combos[piece.type][i][0]][piece.combos[piece.type][i][1]] = piece.squares[i]
      $('.square.r'+(piece.combos[piece.type][i][0])+'.c'+(piece.combos[piece.type][i][1])).addClass("filled active");
      $('.square.r'+(piece.combos[piece.type][i][0])+'.c'+(piece.combos[piece.type][i][1])).attr("color", piece.color);

    }
  }
  return piece;
}

function pieceDone(board, activeCells) {
  var pieceDone = false;
  for (var i = 0; i < activeCells.length; i++) {
    if (((activeCells[i][0]+1) > 19) || (!board.grid[activeCells[i][0]+1][activeCells[i][1]].active && board.grid[activeCells[i][0]+1][activeCells[i][1]].filled)) {
      pieceDone = true;
    }
    if (pieceDone) {
      for (var i = 0; i < activeCells.length; i++) {
        board.grid[activeCells[i][0]][activeCells[i][1]].filled = true;
      }
      $('.active').removeClass("active");
    }
  }
  return pieceDone;
}

function moveSideActiveCells(board) {
  var activeCells = [];
  for (var i = 0; i < board.grid.length; i++) {
    for (var j = 0; j < board.grid[i].length; j++) {
      if (board.grid[i][j].active) {
        activeCells.push([i,j]);
      }
    }
  }
  return activeCells;
}

function unfill(board, activeCells) {
  var color = $('.active').attr("color");
  $('.active').removeAttr("color");
  $('.active').removeClass("filled");
  $('.active').removeClass("active");
  for (var i = 0; i < activeCells.length; i++) {
    board.grid[activeCells[i][0]][activeCells[i][1]].active = false;
    board.grid[activeCells[i][0]][activeCells[i][1]].filled = false;
  }
  return color;
}

function lineFull() {
  for (var i = 0; i < game.board.grid.length; i++) {
    var lineFull = true;
    for (var j = 0; j < game.board.grid[i].length; j++) {
      if (!game.board.grid[i][j].filled) {
        lineFull = false;
      }
    }
    if (lineFull) {
      lineClear(i);
    }
  }
}

function lineClear(row) {
  game.linesCleared ++;
  for (var i = row; i >= 0; i--) {
    for (var j = 0; j < game.board.grid[i].length; j++) {
      if (i > 0) {
        game.board.grid[i][j] = game.board.grid[i-1][j];
      } else {
        game.board.grid[i][j] = new Square();
      }
      if (game.board.grid[i][j].filled) {
        var color = $('.square.r'+(i-1)+'.c'+j).attr("color");
        $('.square.r'+i+'.c'+j).addClass("filled");
        $('.square.r'+i+'.c'+j).attr("color", color);
      } else {
        $('.square.r'+i+'.c'+j).removeClass("filled");
        $('.square.r'+i+'.c'+j).removeAttr("color");
      }
    }
  }
}

class Game {
  constructor() {
    this.board = new Board;
    this.pieces = [];
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
    this.orient = "up";
    this.combos = [[[0,3],[0,4],[1,4],[1,5]],[[1,3],[1,4],[0,5],[1,5]],
    [[0,4],[0,5],[1,4],[1,5]],[[1,3],[0,4],[1,4],[0,5]],[[0,3],[1,3],[1,4],[1,5]],
    [[1,3],[0,4],[1,4],[1,5]],[[0,3],[0,4],[0,5],[0,6]]];
    this.directions = ["up", "right", "down", "left"];
  }
}

Piece.prototype = {
  directions: ["up", "right", "down", "left"],
  combos: [[[0,3],[0,4],[1,4],[1,5]],[[1,3],[1,4],[0,5],[1,5]],
  [[0,4],[0,5],[1,4],[1,5]],[[1,3],[0,4],[1,4],[0,5]],[[0,3],[1,3],[1,4],[1,5]],
  [[1,3],[0,4],[1,4],[1,5]],[[0,3],[0,4],[0,5],[0,6]]]
};

var game = new Game();

$(document).ready(function() {
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
  $("div").on("tap", function() {
    rotate();
  });
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
    } else if (key.which == 38) {
      rotate();
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
    createNewPiece();
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
  game.pieces.push(piece);
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
  $('.score').text('Score: ' + game.linesCleared);
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

function rotate() {
  var color = $('.active').attr("color");
  var orient = game.pieces[(game.pieces.length)-1].orient;
  if (color == "yellow") {
    return;
  }
  var activeCells = [];
  for (var i = 0; i < game.board.grid.length; i++) {
    for (var j = 0; j < game.board.grid[i].length; j++) {
      if (game.board.grid[i][j].active) {
        game.board.grid[i][j].active = false;
        game.board.grid[i][j].filled = false;
        activeCells.push([i,j]);
      }
    }
  }
  $('.active').removeAttr("color");
  $('.active').removeClass("filled");
  $('.active').removeClass("active");

  if (color == "purple") {
    if (orient == "up") {
      rotatePurpleCells([0,2,3],2,"vertical",1,"up",activeCells);
    } else if (orient == "right") {
      rotatePurpleCells([1,2,3],1,"horizontal",-1,"right",activeCells);
    } else if (orient == "down") {
      rotatePurpleCells([0,1,3],1,"vertical",-1,"down",activeCells);
    } else if (orient == "left") {
      rotatePurpleCells([0,1,2],2,"horizontal",1,"left",activeCells);
    }
  } else if (color == "red") {
    if (orient == "up") {
      game.board.grid[activeCells[2][0]][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+activeCells[2][1]).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+activeCells[2][1]).attr("color", "red");
      game.board.grid[activeCells[3][0]][activeCells[3][1]].active = true;
      game.board.grid[activeCells[3][0]][activeCells[3][1]].filled = true;
      $('.square.r'+(activeCells[3][0])+'.c'+activeCells[3][1]).addClass("filled active");
      $('.square.r'+(activeCells[3][0])+'.c'+activeCells[3][1]).attr("color", "red");
      game.board.grid[activeCells[0][0]][activeCells[0][1]+2].active = true;
      game.board.grid[activeCells[0][0]][activeCells[0][1]+2].filled = true;
      $('.square.r'+(activeCells[0][0])+'.c'+(activeCells[0][1]+2)).addClass("filled active");
      $('.square.r'+(activeCells[0][0])+'.c'+(activeCells[0][1]+2)).attr("color", "red");
      game.board.grid[activeCells[1][0]+2][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]+2][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0]+2)+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0]+2)+'.c'+(activeCells[1][1])).attr("color", "red");
      game.pieces[game.pieces.length-1].orient = "right";
    } else if (orient == "right") {
      game.board.grid[activeCells[1][0]][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+activeCells[1][1]).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+activeCells[1][1]).attr("color", "red");
      game.board.grid[activeCells[3][0]][activeCells[3][1]].active = true;
      game.board.grid[activeCells[3][0]][activeCells[3][1]].filled = true;
      $('.square.r'+(activeCells[3][0])+'.c'+activeCells[3][1]).addClass("filled active");
      $('.square.r'+(activeCells[3][0])+'.c'+activeCells[3][1]).attr("color", "red");
      game.board.grid[activeCells[0][0]+2][activeCells[0][1]].active = true;
      game.board.grid[activeCells[0][0]+2][activeCells[0][1]].filled = true;
      $('.square.r'+(activeCells[0][0]+2)+'.c'+(activeCells[0][1])).addClass("filled active");
      $('.square.r'+(activeCells[0][0]+2)+'.c'+(activeCells[0][1])).attr("color", "red");
      game.board.grid[activeCells[2][0]][activeCells[2][1]-2].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]-2].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1]-2)).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1]-2)).attr("color", "red");
      game.pieces[game.pieces.length-1].orient = "down";
    } else if (orient == "down") {
      game.board.grid[activeCells[0][0]][activeCells[0][1]].active = true;
      game.board.grid[activeCells[0][0]][activeCells[0][1]].filled = true;
      $('.square.r'+(activeCells[0][0])+'.c'+activeCells[0][1]).addClass("filled active");
      $('.square.r'+(activeCells[0][0])+'.c'+activeCells[0][1]).attr("color", "red");
      game.board.grid[activeCells[1][0]][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+activeCells[1][1]).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+activeCells[1][1]).attr("color", "red");
      game.board.grid[activeCells[2][0]-2][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]-2][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0]-2)+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0]-2)+'.c'+(activeCells[2][1])).attr("color", "red");
      game.board.grid[activeCells[3][0]][activeCells[3][1]-2].active = true;
      game.board.grid[activeCells[3][0]][activeCells[3][1]-2].filled = true;
      $('.square.r'+(activeCells[3][0])+'.c'+(activeCells[3][1]-2)).addClass("filled active");
      $('.square.r'+(activeCells[3][0])+'.c'+(activeCells[3][1]-2)).attr("color", "red");
      game.pieces[game.pieces.length-1].orient = "left";
    } else if (orient == "left") {
      game.board.grid[activeCells[0][0]][activeCells[0][1]].active = true;
      game.board.grid[activeCells[0][0]][activeCells[0][1]].filled = true;
      $('.square.r'+(activeCells[0][0])+'.c'+activeCells[0][1]).addClass("filled active");
      $('.square.r'+(activeCells[0][0])+'.c'+activeCells[0][1]).attr("color", "red");
      game.board.grid[activeCells[2][0]][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+activeCells[2][1]).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+activeCells[2][1]).attr("color", "red");
      game.board.grid[activeCells[1][0]][activeCells[1][1]+2].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]+2].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1]+2)).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1]+2)).attr("color", "red");
      game.board.grid[activeCells[3][0]-2][activeCells[3][1]].active = true;
      game.board.grid[activeCells[3][0]-2][activeCells[3][1]].filled = true;
      $('.square.r'+(activeCells[3][0]-2)+'.c'+(activeCells[3][1])).addClass("filled active");
      $('.square.r'+(activeCells[3][0]-2)+'.c'+(activeCells[3][1])).attr("color", "red");
      game.pieces[game.pieces.length-1].orient = "up";
    }
  } else if (color == "green") {
    if (orient == "up") {
      game.board.grid[activeCells[0][0]][activeCells[0][1]].active = true;
      game.board.grid[activeCells[0][0]][activeCells[0][1]].filled = true;
      $('.square.r'+(activeCells[0][0])+'.c'+activeCells[0][1]).addClass("filled active");
      $('.square.r'+(activeCells[0][0])+'.c'+activeCells[0][1]).attr("color", "green");
      game.board.grid[activeCells[3][0]][activeCells[3][1]].active = true;
      game.board.grid[activeCells[3][0]][activeCells[3][1]].filled = true;
      $('.square.r'+(activeCells[3][0])+'.c'+activeCells[3][1]).addClass("filled active");
      $('.square.r'+(activeCells[3][0])+'.c'+activeCells[3][1]).attr("color", "green");
      game.board.grid[activeCells[1][0]+2][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]+2][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0]+2)+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0]+2)+'.c'+(activeCells[1][1])).attr("color", "green");
      game.board.grid[activeCells[2][0]][activeCells[2][1]+2].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]+2].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1]+2)).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1]+2)).attr("color", "green");
      game.pieces[game.pieces.length-1].orient = "right";
    } else if (orient == "right") {
      game.board.grid[activeCells[1][0]][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+activeCells[1][1]).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+activeCells[1][1]).attr("color", "green");
      game.board.grid[activeCells[2][0]][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+activeCells[2][1]).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+activeCells[2][1]).attr("color", "green");
      game.board.grid[activeCells[0][0]+2][activeCells[0][1]].active = true;
      game.board.grid[activeCells[0][0]+2][activeCells[0][1]].filled = true;
      $('.square.r'+(activeCells[0][0]+2)+'.c'+(activeCells[0][1])).addClass("filled active");
      $('.square.r'+(activeCells[0][0]+2)+'.c'+(activeCells[0][1])).attr("color", "green");
      game.board.grid[activeCells[3][0]][activeCells[3][1]-2].active = true;
      game.board.grid[activeCells[3][0]][activeCells[3][1]-2].filled = true;
      $('.square.r'+(activeCells[3][0])+'.c'+(activeCells[3][1]-2)).addClass("filled active");
      $('.square.r'+(activeCells[3][0])+'.c'+(activeCells[3][1]-2)).attr("color", "green");
      game.pieces[game.pieces.length-1].orient = "down";
    } else if (orient == "down") {
      game.board.grid[activeCells[0][0]][activeCells[0][1]].active = true;
      game.board.grid[activeCells[0][0]][activeCells[0][1]].filled = true;
      $('.square.r'+(activeCells[0][0])+'.c'+activeCells[0][1]).addClass("filled active");
      $('.square.r'+(activeCells[0][0])+'.c'+activeCells[0][1]).attr("color", "green");
      game.board.grid[activeCells[3][0]][activeCells[3][1]].active = true;
      game.board.grid[activeCells[3][0]][activeCells[3][1]].filled = true;
      $('.square.r'+(activeCells[3][0])+'.c'+activeCells[3][1]).addClass("filled active");
      $('.square.r'+(activeCells[3][0])+'.c'+activeCells[3][1]).attr("color", "green");
      game.board.grid[activeCells[1][0]][activeCells[1][1]-2].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]-2].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1]-2)).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1]-2)).attr("color", "green");
      game.board.grid[activeCells[2][0]-2][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]-2][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0]-2)+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0]-2)+'.c'+(activeCells[2][1])).attr("color", "green");
      game.pieces[game.pieces.length-1].orient = "left";
    } else if (orient == "left") {
      game.board.grid[activeCells[1][0]][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+activeCells[1][1]).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+activeCells[1][1]).attr("color", "green");
      game.board.grid[activeCells[2][0]][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+activeCells[2][1]).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+activeCells[2][1]).attr("color", "green");
      game.board.grid[activeCells[0][0]][activeCells[0][1]+2].active = true;
      game.board.grid[activeCells[0][0]][activeCells[0][1]+2].filled = true;
      $('.square.r'+(activeCells[0][0])+'.c'+(activeCells[0][1]+2)).addClass("filled active");
      $('.square.r'+(activeCells[0][0])+'.c'+(activeCells[0][1]+2)).attr("color", "green");
      game.board.grid[activeCells[3][0]-2][activeCells[3][1]].active = true;
      game.board.grid[activeCells[3][0]-2][activeCells[3][1]].filled = true;
      $('.square.r'+(activeCells[3][0]-2)+'.c'+(activeCells[3][1])).addClass("filled active");
      $('.square.r'+(activeCells[3][0]-2)+'.c'+(activeCells[3][1])).attr("color", "green");
      game.pieces[game.pieces.length-1].orient = "up";
    }
  } else if (color == "orange") {
    if (orient == "up") {
      game.board.grid[activeCells[0][0]+2][activeCells[0][1]].active = true;
      game.board.grid[activeCells[0][0]+2][activeCells[0][1]].filled = true;
      $('.square.r'+(activeCells[0][0]+2)+'.c'+(activeCells[0][1])).addClass("filled active");
      $('.square.r'+(activeCells[0][0]+2)+'.c'+(activeCells[0][1])).attr("color", "orange");
      game.board.grid[activeCells[1][0]-1][activeCells[1][1]+1].active = true;
      game.board.grid[activeCells[1][0]-1][activeCells[1][1]+1].filled = true;
      $('.square.r'+(activeCells[1][0]-1)+'.c'+(activeCells[1][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[1][0]-1)+'.c'+(activeCells[1][1]+1)).attr("color", "orange");
      game.board.grid[activeCells[2][0]][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1])).attr("color", "orange");
      game.board.grid[activeCells[3][0]+1][activeCells[3][1]-1].active = true;
      game.board.grid[activeCells[3][0]+1][activeCells[3][1]-1].filled = true;
      $('.square.r'+(activeCells[3][0]+1)+'.c'+(activeCells[3][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]+1)+'.c'+(activeCells[3][1]-1)).attr("color", "orange");
      game.pieces[game.pieces.length-1].orient = "right";
    } else if (orient == "right") {
      game.board.grid[activeCells[0][0]+1][activeCells[0][1]+1].active = true;
      game.board.grid[activeCells[0][0]+1][activeCells[0][1]+1].filled = true;
      $('.square.r'+(activeCells[0][0]+1)+'.c'+(activeCells[0][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]+1)+'.c'+(activeCells[0][1]+1)).attr("color", "orange");
      game.board.grid[activeCells[1][0]][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1])).attr("color", "orange");
      game.board.grid[activeCells[2][0]-1][activeCells[2][1]-1].active = true;
      game.board.grid[activeCells[2][0]-1][activeCells[2][1]-1].filled = true;
      $('.square.r'+(activeCells[2][0]-1)+'.c'+(activeCells[2][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[2][0]-1)+'.c'+(activeCells[2][1]-1)).attr("color", "orange");
      game.board.grid[activeCells[3][0]][activeCells[3][1]-2].active = true;
      game.board.grid[activeCells[3][0]][activeCells[3][1]-2].filled = true;
      $('.square.r'+(activeCells[3][0])+'.c'+(activeCells[3][1]-2)).addClass("filled active");
      $('.square.r'+(activeCells[3][0])+'.c'+(activeCells[3][1]-2)).attr("color", "orange");
      game.pieces[game.pieces.length-1].orient = "down";
    } else if (orient == "down") {
      game.board.grid[activeCells[0][0]-1][activeCells[0][1]+1].active = true;
      game.board.grid[activeCells[0][0]-1][activeCells[0][1]+1].filled = true;
      $('.square.r'+(activeCells[0][0]-1)+'.c'+(activeCells[0][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]-1)+'.c'+(activeCells[0][1]+1)).attr("color", "orange");
      game.board.grid[activeCells[1][0]][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1])).attr("color", "orange");
      game.board.grid[activeCells[2][0]+1][activeCells[2][1]-1].active = true;
      game.board.grid[activeCells[2][0]+1][activeCells[2][1]-1].filled = true;
      $('.square.r'+(activeCells[2][0]+1)+'.c'+(activeCells[2][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[2][0]+1)+'.c'+(activeCells[2][1]-1)).attr("color", "orange");
      game.board.grid[activeCells[3][0]-2][activeCells[3][1]].active = true;
      game.board.grid[activeCells[3][0]-2][activeCells[3][1]].filled = true;
      $('.square.r'+(activeCells[3][0]-2)+'.c'+(activeCells[3][1])).addClass("filled active");
      $('.square.r'+(activeCells[3][0]-2)+'.c'+(activeCells[3][1])).attr("color", "orange");
      game.pieces[game.pieces.length-1].orient = "left";
    } else if (orient == "left") {
      game.board.grid[activeCells[0][0]][activeCells[0][1]+2].active = true;
      game.board.grid[activeCells[0][0]][activeCells[0][1]+2].filled = true;
      $('.square.r'+(activeCells[0][0])+'.c'+(activeCells[0][1]+2)).addClass("filled active");
      $('.square.r'+(activeCells[0][0])+'.c'+(activeCells[0][1]+2)).attr("color", "orange");
      game.board.grid[activeCells[1][0]+1][activeCells[1][1]+1].active = true;
      game.board.grid[activeCells[1][0]+1][activeCells[1][1]+1].filled = true;
      $('.square.r'+(activeCells[1][0]+1)+'.c'+(activeCells[1][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[1][0]+1)+'.c'+(activeCells[1][1]+1)).attr("color", "orange");
      game.board.grid[activeCells[2][0]][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1])).attr("color", "orange");
      game.board.grid[activeCells[3][0]-1][activeCells[3][1]-1].active = true;
      game.board.grid[activeCells[3][0]-1][activeCells[3][1]-1].filled = true;
      $('.square.r'+(activeCells[3][0]-1)+'.c'+(activeCells[3][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]-1)+'.c'+(activeCells[3][1]-1)).attr("color", "orange");
      game.pieces[game.pieces.length-1].orient = "up";
    }
  } else if (color == "blue") {
    if (orient == "up") {
      game.board.grid[activeCells[0][0]][activeCells[0][1]+2].active = true;
      game.board.grid[activeCells[0][0]][activeCells[0][1]+2].filled = true;
      $('.square.r'+(activeCells[0][0])+'.c'+(activeCells[0][1]+2)).addClass("filled active");
      $('.square.r'+(activeCells[0][0])+'.c'+(activeCells[0][1]+2)).attr("color", "blue");
      game.board.grid[activeCells[1][0]-1][activeCells[1][1]+1].active = true;
      game.board.grid[activeCells[1][0]-1][activeCells[1][1]+1].filled = true;
      $('.square.r'+(activeCells[1][0]-1)+'.c'+(activeCells[1][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[1][0]-1)+'.c'+(activeCells[1][1]+1)).attr("color", "blue");
      game.board.grid[activeCells[2][0]][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1])).attr("color", "blue");
      game.board.grid[activeCells[3][0]+1][activeCells[3][1]-1].active = true;
      game.board.grid[activeCells[3][0]+1][activeCells[3][1]-1].filled = true;
      $('.square.r'+(activeCells[3][0]+1)+'.c'+(activeCells[3][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]+1)+'.c'+(activeCells[3][1]-1)).attr("color", "blue");
      game.pieces[game.pieces.length-1].orient = "right";
    } else if (orient == "right") {
      game.board.grid[activeCells[0][0]+1][activeCells[0][1]+1].active = true;
      game.board.grid[activeCells[0][0]+1][activeCells[0][1]+1].filled = true;
      $('.square.r'+(activeCells[0][0]+1)+'.c'+(activeCells[0][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]+1)+'.c'+(activeCells[0][1]+1)).attr("color", "blue");
      game.board.grid[activeCells[1][0]+2][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]+2][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0]+2)+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0]+2)+'.c'+(activeCells[1][1])).attr("color", "blue");
      game.board.grid[activeCells[2][0]][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1])).attr("color", "blue");
      game.board.grid[activeCells[3][0]-1][activeCells[3][1]-1].active = true;
      game.board.grid[activeCells[3][0]-1][activeCells[3][1]-1].filled = true;
      $('.square.r'+(activeCells[3][0]-1)+'.c'+(activeCells[3][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]-1)+'.c'+(activeCells[3][1]-1)).attr("color", "blue");
      game.pieces[game.pieces.length-1].orient = "down";
    } else if (orient == "down") {
      game.board.grid[activeCells[0][0]-1][activeCells[0][1]+1].active = true;
      game.board.grid[activeCells[0][0]-1][activeCells[0][1]+1].filled = true;
      $('.square.r'+(activeCells[0][0]-1)+'.c'+(activeCells[0][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]-1)+'.c'+(activeCells[0][1]+1)).attr("color", "blue");
      game.board.grid[activeCells[1][0]][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1])).attr("color", "blue");
      game.board.grid[activeCells[2][0]+1][activeCells[2][1]-1].active = true;
      game.board.grid[activeCells[2][0]+1][activeCells[2][1]-1].filled = true;
      $('.square.r'+(activeCells[2][0]+1)+'.c'+(activeCells[2][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[2][0]+1)+'.c'+(activeCells[2][1]-1)).attr("color", "blue");
      game.board.grid[activeCells[3][0]][activeCells[3][1]-2].active = true;
      game.board.grid[activeCells[3][0]][activeCells[3][1]-2].filled = true;
      $('.square.r'+(activeCells[3][0])+'.c'+(activeCells[3][1]-2)).addClass("filled active");
      $('.square.r'+(activeCells[3][0])+'.c'+(activeCells[3][1]-2)).attr("color", "blue");
      game.pieces[game.pieces.length-1].orient = "left";
    } else if (orient == "left") {
      game.board.grid[activeCells[0][0]+1][activeCells[0][1]+1].active = true;
      game.board.grid[activeCells[0][0]+1][activeCells[0][1]+1].filled = true;
      $('.square.r'+(activeCells[0][0]+1)+'.c'+(activeCells[0][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]+1)+'.c'+(activeCells[0][1]+1)).attr("color", "blue");
      game.board.grid[activeCells[1][0]][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1])).attr("color", "blue");
      game.board.grid[activeCells[2][0]-2][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]-2][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0]-2)+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0]-2)+'.c'+(activeCells[2][1])).attr("color", "blue");
      game.board.grid[activeCells[3][0]-1][activeCells[3][1]-1].active = true;
      game.board.grid[activeCells[3][0]-1][activeCells[3][1]-1].filled = true;
      $('.square.r'+(activeCells[3][0]-1)+'.c'+(activeCells[3][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]-1)+'.c'+(activeCells[3][1]-1)).attr("color", "blue");
      game.pieces[game.pieces.length-1].orient = "up";
    }
  } else if (color == "lightblue") {
    if (orient == "up") {
      game.board.grid[activeCells[0][0]-1][activeCells[0][1]+2].active = true;
      game.board.grid[activeCells[0][0]-1][activeCells[0][1]+2].filled = true;
      $('.square.r'+(activeCells[0][0]-1)+'.c'+(activeCells[0][1]+2)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]-1)+'.c'+(activeCells[0][1]+2)).attr("color", "lightblue");
      game.board.grid[activeCells[1][0]][activeCells[1][1]+1].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]+1].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1]+1)).attr("color", "lightblue");
      game.board.grid[activeCells[2][0]+1][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]+1][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0]+1)+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0]+1)+'.c'+(activeCells[2][1])).attr("color", "lightblue");
      game.board.grid[activeCells[3][0]+2][activeCells[3][1]-1].active = true;
      game.board.grid[activeCells[3][0]+2][activeCells[3][1]-1].filled = true;
      $('.square.r'+(activeCells[3][0]+2)+'.c'+(activeCells[3][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]+2)+'.c'+(activeCells[3][1]-1)).attr("color", "lightblue");
      game.pieces[game.pieces.length-1].orient = "right";
    } else if (orient == "right") {
      game.board.grid[activeCells[0][0]+2][activeCells[0][1]+1].active = true;
      game.board.grid[activeCells[0][0]+2][activeCells[0][1]+1].filled = true;
      $('.square.r'+(activeCells[0][0]+2)+'.c'+(activeCells[0][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]+2)+'.c'+(activeCells[0][1]+1)).attr("color", "lightblue");
      game.board.grid[activeCells[1][0]+1][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]+1][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0]+1)+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0]+1)+'.c'+(activeCells[1][1])).attr("color", "lightblue");
      game.board.grid[activeCells[2][0]][activeCells[2][1]-1].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]-1].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1]-1)).attr("color", "lightblue");
      game.board.grid[activeCells[3][0]-1][activeCells[3][1]-2].active = true;
      game.board.grid[activeCells[3][0]-1][activeCells[3][1]-2].filled = true;
      $('.square.r'+(activeCells[3][0]-1)+'.c'+(activeCells[3][1]-2)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]-1)+'.c'+(activeCells[3][1]-2)).attr("color", "lightblue");
      game.pieces[game.pieces.length-1].orient = "down";
    } else if (orient == "down") {
      game.board.grid[activeCells[0][0]-2][activeCells[0][1]+1].active = true;
      game.board.grid[activeCells[0][0]-2][activeCells[0][1]+1].filled = true;
      $('.square.r'+(activeCells[0][0]-2)+'.c'+(activeCells[0][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]-2)+'.c'+(activeCells[0][1]+1)).attr("color", "lightblue");
      game.board.grid[activeCells[1][0]-1][activeCells[1][1]].active = true;
      game.board.grid[activeCells[1][0]-1][activeCells[1][1]].filled = true;
      $('.square.r'+(activeCells[1][0]-1)+'.c'+(activeCells[1][1])).addClass("filled active");
      $('.square.r'+(activeCells[1][0]-1)+'.c'+(activeCells[1][1])).attr("color", "lightblue");
      game.board.grid[activeCells[2][0]][activeCells[2][1]-1].active = true;
      game.board.grid[activeCells[2][0]][activeCells[2][1]-1].filled = true;
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[2][0])+'.c'+(activeCells[2][1]-1)).attr("color", "lightblue");
      game.board.grid[activeCells[3][0]+1][activeCells[3][1]-2].active = true;
      game.board.grid[activeCells[3][0]+1][activeCells[3][1]-2].filled = true;
      $('.square.r'+(activeCells[3][0]+1)+'.c'+(activeCells[3][1]-2)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]+1)+'.c'+(activeCells[3][1]-2)).attr("color", "lightblue");
      game.pieces[game.pieces.length-1].orient = "left";
    } else if (orient == "left") {
      game.board.grid[activeCells[0][0]+1][activeCells[0][1]+2].active = true;
      game.board.grid[activeCells[0][0]+1][activeCells[0][1]+2].filled = true;
      $('.square.r'+(activeCells[0][0]+1)+'.c'+(activeCells[0][1]+2)).addClass("filled active");
      $('.square.r'+(activeCells[0][0]+1)+'.c'+(activeCells[0][1]+2)).attr("color", "lightblue");
      game.board.grid[activeCells[1][0]][activeCells[1][1]+1].active = true;
      game.board.grid[activeCells[1][0]][activeCells[1][1]+1].filled = true;
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1]+1)).addClass("filled active");
      $('.square.r'+(activeCells[1][0])+'.c'+(activeCells[1][1]+1)).attr("color", "lightblue");
      game.board.grid[activeCells[2][0]-1][activeCells[2][1]].active = true;
      game.board.grid[activeCells[2][0]-1][activeCells[2][1]].filled = true;
      $('.square.r'+(activeCells[2][0]-1)+'.c'+(activeCells[2][1])).addClass("filled active");
      $('.square.r'+(activeCells[2][0]-1)+'.c'+(activeCells[2][1])).attr("color", "lightblue");
      game.board.grid[activeCells[3][0]-2][activeCells[3][1]-1].active = true;
      game.board.grid[activeCells[3][0]-2][activeCells[3][1]-1].filled = true;
      $('.square.r'+(activeCells[3][0]-2)+'.c'+(activeCells[3][1]-1)).addClass("filled active");
      $('.square.r'+(activeCells[3][0]-2)+'.c'+(activeCells[3][1]-1)).attr("color", "lightblue");
      game.pieces[game.pieces.length-1].orient = "up";
    }
  }
}

function rotatePurpleCells(unchangedCells,four,direction,change,orient,activeCells) {
  for (var i = 0; i < unchangedCells.length; i++) {
    game.board.grid[activeCells[unchangedCells[i]][0]][activeCells[unchangedCells[i]][1]].active = true;
    game.board.grid[activeCells[unchangedCells[i]][0]][activeCells[unchangedCells[i]][1]].filled = true;
    $('.square.r'+(activeCells[unchangedCells[i]][0])+'.c'+activeCells[unchangedCells[i]][1]).addClass("filled active");
    $('.square.r'+(activeCells[unchangedCells[i]][0])+'.c'+activeCells[unchangedCells[i]][1]).attr("color", "purple");
  }
  if (direction == "vertical") {
    game.board.grid[activeCells[four][0]+change][activeCells[four][1]].active = true;
    game.board.grid[activeCells[four][0]+change][activeCells[four][1]].filled = true;
    $('.square.r'+(activeCells[four][0]+change)+'.c'+(activeCells[four][1])).addClass("filled active");
    $('.square.r'+(activeCells[four][0]+change)+'.c'+(activeCells[four][1])).attr("color", "purple");
  } else if (direction == "horizontal") {
    game.board.grid[activeCells[four][0]][activeCells[four][1]+change].active = true;
    game.board.grid[activeCells[four][0]][activeCells[four][1]+change].filled = true;
    $('.square.r'+(activeCells[four][0])+'.c'+(activeCells[four][1]+change)).addClass("filled active");
    $('.square.r'+(activeCells[four][0])+'.c'+(activeCells[four][1]+change)).attr("color", "purple");
  }
  if (orient == "up") {
    game.pieces[game.pieces.length-1].orient = "right";
  } else if (orient == "right") {
    game.pieces[game.pieces.length-1].orient = "down";
  } else if (orient == "down") {
    game.pieces[game.pieces.length-1].orient = "left";
  } else if (orient == "left") {
    game.pieces[game.pieces.length-1].orient = "up";
  }
}

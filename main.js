
var Sudoku = (function () {
	var _board = [
		[5,3,null,null,7,null,null,null,null],
		[6,null,null,1,9,5,null,null,null],
		[null,9,8,null,null,null,null,6,null],
		[8,null,null,null,6,null,null,null,3],
		[4,null,null,8,null,3,null,null,1],
		[7,null,null,null,2,null,null,null,6],
		[null,6,null,null,null,null,2,8,null],
		[null,null,null,4,1,9,null,null,5],
		[null,null,null,null,8,null,null,7,9]
	];

	var _playing = _board.map(function (arr) {
		return arr.slice();
	});

	var _currentCell = null;

	var _startGame = function () {
		_view.render();
		_controller.bindEvents();
	};

	var _view = {
		render: function () {
			//render the board using underscore template
			_.templateSettings.variable = "rc";

			var templateData = {
		    	board: _board,
		    	number: [1,2,3,4,5,6,7,8,9]
		    };

		    var template = _.template(
		        $("script.sudokuBoard").html()
		    );
			$("#board").append(template(templateData));

			//assign ids to each cell and add color to preset cells
			$("#board .board-row").each(function (i) {
				$(this).find("a.board-cell").each(function (j) {
					// var row = i+1;
					// var col = j+1;
					var row = i;
					var col = j;
					$(this).attr("id", "cell" + row + col);

					if (_board[i][j]) $(this).addClass("preset");
				});
			});

			//render number board
			var template2 = _.template(
		    	$("script.numberBoard").html()
		    );
		    $("#number").append(template2(templateData));

		    $("#number a.board-cell").each(function (i) {
		    	$(this).attr("id", i+1);
		    });
		},

		reRender: function () {
			$("#board a.board-cell").removeClass("selected");
			$("#board a.board-cell").removeClass("wrong");
			for (var row in _board) {
				for (var col in _board[row]) {
					if (!_board[row][col]) {
						// var i = parseInt(row) + 1;
						// var j = parseInt(col) + 1;

						// var cell_id = "#cell" + i + j;
						var cell_id = "#cell" + row + col;
						$(cell_id + " .cell-content-table-cell").html("1");
					}
				}
			}
		}
	};

	var _controller = {
		bindEvents: function () {
			//bind event to clicking cells to select
			$("#board a.board-cell").click(function () {
				if (!$(this).hasClass("preset")) {
					_controller.selectCell($(this));
				}
			});

			//bind event to clicking number cell
			$("#number a.board-cell").click(function () {
				if (_currentCell) _controller.selectNumber($(this));
				else alert("Please select a cell first!");
			});

			//bind event to restart button
			$("#restartBtn").click(function () {
				_view.reRender();
			});
		},

		selectCell: function (element) {
			$("a.board-cell").removeClass("selected");
			element.addClass("selected");
			_currentCell = "#" + element.attr("id");
		},

		selectNumber: function (element) {
			$(_currentCell).removeClass("wrong");
			$(_currentCell + " .cell-content-table-cell").html(element.attr("id"));
			_controller.validate(element.attr("id"));
		},

		validate: function (selectedNumber) {
			var row = _currentCell.charAt(_currentCell.length-2);
			var col = _currentCell.charAt(_currentCell.length-1);

			var squareRow = Math.floor(row/3);
			var squareCol = Math.floor(col/3);

			_playing[row][col] = parseInt(selectedNumber);

			_controller.checkRow(row);
			_controller.checkCol(col);
			_controller.checkSquare(squareRow, squareCol);
			_controller.checkCompleted();
		},

		checkRow: function (row) {
			var visited = [false, false, false, false, false, false, false, false, false];
			// $("#board .board-row:eq("+row+")").each(function (i) {
			// 	$(this).find("a.board-cell").each(function (j) {
			// 		$(this).addClass("preset");
			// 	});
			// });
			for (var col in _playing[row]) {
				if (_playing[row][col]) {
					if (visited[_playing[row][col]-1]) {
						$(_currentCell).addClass("wrong");
					}
					else visited[_playing[row][col]-1] = true;
				}
			};
		},

		checkCol: function (col) {
			var visited = [false, false, false, false, false, false, false, false, false];
			// $("#board .board-row").each(function (i) {
			// 	$(this).find("a.board-cell:eq("+col+")").each(function (j) {
			// 		$(this).addClass("preset");
			// 	});
			// });
			for (var row in _playing) {
				if (_playing[row][col]) {
					if (visited[_playing[row][col]-1]) {
						$(_currentCell).addClass("wrong");
					}
					else visited[_playing[row][col]-1] = true;
				}
			}
		},

		checkSquare: function (squareRow, squareCol) {
			var visited = [false, false, false, false, false, false, false, false, false];
			// $("#board .board-row").slice(squareRow*3,squareRow*3+3).each(function (i) {
			// 	$(this).find("a.board-cell").slice(squareCol*3,squareCol*3+3).each(function (j) {
			// 		$(this).addClass("preset");
			// 	});
			// });
			for (var row = squareRow*3; row < squareRow*3+3; row++) {
				for (var col = squareCol*3; col < squareCol*3+3; col++) {
					if (_playing[row][col]) {
						if (visited[_playing[row][col]-1]) {
							$(_currentCell).addClass("wrong");
						}
						else visited[_playing[row][col]-1] = true;
						//console.log("(" + row + ", " + col + ")");
					}
				}
			}
		},

		checkCompleted: function () {
			for (var row in _playing) {
				for (var col in _playing[row]) {
					if (_playing[row][col] === null) {
						console.log("not completed");
						return;
					}
				}
			}

			if ($("#board").find(".wrong").length > 0) alert("Please fix wrong cells");
			else alert("Congratulations! You solved this quiz");
		}
	};

	return {
		startGame: _startGame
	}
})();

// var solution = [
// 	[5,3,4,6,7,8,9,1,2],
// 	[6,7,2,1,9,5,3,4,8],
// 	[1,9,8,3,4,2,5,6,7],
// 	[8,5,9,7,6,1,4,2,3],
// 	[4,2,6,8,5,3,7,9,1],
// 	[7,1,3,9,2,4,8,5,6],
// 	[9,6,1,5,3,7,2,8,4],
// 	[2,8,7,4,1,9,6,3,5],
// 	[3,4,5,2,8,6,1,7,9]];


$(function () {
	Sudoku.startGame();
});


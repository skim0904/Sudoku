
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
	var _currentRow = null;
	var _currentCol = null;

	var _startGame = function () {
		//this.view.render();
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
						var cell_id = "#cell" + row + col;
						$(cell_id + " .cell-content-table-cell").html("");
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
				_playing = _board.map(function (arr) {
					return arr.slice();
				});
				_view.reRender();
			});

			//bind event to erase button
			$("#eraseBtn").click(function () {
				if (_currentCell) {
					$(_currentCell + " .cell-content-table-cell").html("");
					_playing[_currentRow][_currentCol] = null;
				}
			});

			//bind keyboard events to cells
			$(document).keydown(function (e) {
				//down arrow
				if (e.which == "40") {
					e.preventDefault();
					if (_currentRow < _board.length-1) {
						var row;
						for (row = _currentRow*1+1; row < _board.length; row++) {
							if (!_board[row][_currentCol]) {
								_currentRow = row;
								var moveId = "#cell" + _currentRow + _currentCol;
								_controller.selectCell($(this).find(moveId));
								break;
							}
						}
					}
				}

				//up arrow
				if (e.which == "38") {
					e.preventDefault();
					if (_currentRow > 0) {
						var row;
						for (row = _currentRow-1; row >= 0; row--) {
							if (!_board[row][_currentCol]) {
								_currentRow = row;
								var moveId = "#cell" + _currentRow + _currentCol;
								_controller.selectCell($(this).find(moveId));
								break;
							}
						}
					}
				}

				//left arrow
				if (e.which == "37") {
					e.preventDefault();
					if (_currentCol > 0) {
						for (col = _currentCol-1; col >= 0; col--) {
							if (!_board[_currentRow][col]) {
								_currentCol = col;
								var moveId = "#cell" + _currentRow + _currentCol;
								_controller.selectCell($(this).find(moveId));
								break;
							}
						}
					}
				}

				//right arrow
				if (e.which == "39") {
					e.preventDefault();
					if (_currentCol < _board.length-1) {
						var col;
						for (col = _currentCol*1+1; col < _board[_currentRow].length; col++) {
							if (!_board[_currentRow][col]) {
								_currentCol = col;
								var moveId = "#cell" + _currentRow + _currentCol;
								_controller.selectCell($(this).find(moveId));
								break;
							}
						}
					}
				}

				//number
				if (e.which >= 49 && e.which <= 57) {
					var number = e.which-48;
					_controller.selectNumber($(this).find("#" + number));
				}
			});
		},

		selectCell: function (element) {
			$("a.board-cell").removeClass("selected");
			element.addClass("selected");
			_currentCell = "#" + element.attr("id");
			_currentRow = _currentCell.charAt(_currentCell.length-2);
			_currentCol = _currentCell.charAt(_currentCell.length-1);
		},

		selectNumber: function (element) {
			$(_currentCell).removeClass("wrong");
			$(_currentCell + " .cell-content-table-cell").html(element.attr("id"));
			_playing[_currentRow][_currentCol] = parseInt(element.attr("id"));

			_validation.validate();
		}
	};

	var _validation = {
		validate: function () {
			var squareRow = Math.floor(_currentRow/3);
			var squareCol = Math.floor(_currentCol/3);

			_validation.checkRow(_currentRow);
			_validation.checkCol(_currentCol);
			_validation.checkSquare(squareRow, squareCol);
			_validation.checkCompleted();
		},

		checkRow: function (row) {
			var visited = [false, false, false, false, false, false, false, false, false];
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
			for (var row = squareRow*3; row < squareRow*3+3; row++) {
				for (var col = squareCol*3; col < squareCol*3+3; col++) {
					if (_playing[row][col]) {
						if (visited[_playing[row][col]-1]) {
							$(_currentCell).addClass("wrong");
						}
						else visited[_playing[row][col]-1] = true;
					}
				}
			}
		},

		checkCompleted: function () {
			for (var row in _playing) {
				for (var col in _playing[row]) {
					if (_playing[row][col] === null) {
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


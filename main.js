
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
		],

		_playing = _board.map(function (arr) {
			return arr.slice();
		}),

		_currentCell = null,
		_currentRow = null,
		_currentCol = null,

		_wrongCell = [],
		_wrongCellCheckingMode = false;


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
				_wrongCell = [];
				_view.reRender();
			});

			//bind event to erase button
			$("#eraseBtn").click(function () {
				if (_currentCell) {
					$(_currentCell + " .cell-content-table-cell").html("");
					_playing[_currentRow][_currentCol] = null;
					//$(_currentCell).removeClass("wrong");
					_controller.removeFromWrongArray(_currentRow, _currentCell);
				}
			});

			//bind keyboard events to cells
			$(document).keydown(function (e) {
				if (_currentCell) {
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

					//backspace
					if (e.which == "8") {
						e.preventDefault();
						$("#eraseBtn").click();
					}

					//number
					if ((e.which >= 49 && e.which <= 57) || (e.which >= 97 && e.which <= 105)) {
						var number;
						if (e.which <= 57) number = e.which-48;
						else number = e.which-96;
						_controller.selectNumber($(this).find("#" + number));
					}
				}
				else alert("Please select a cell first!");
			});
		},

		selectCell: function (element) {
			$("a.board-cell").removeClass("selected");
			element.addClass("selected");
			_currentCell = "#" + element.attr("id");
			_currentRow = parseInt(_currentCell.charAt(_currentCell.length-2));
			_currentCol = parseInt(_currentCell.charAt(_currentCell.length-1));
		},

		selectNumber: function (element) {
			_controller.removeFromWrongArray(_currentRow, _currentCol);
			$(_currentCell + " .cell-content-table-cell").html(element.attr("id"));
			_playing[_currentRow][_currentCol] = parseInt(element.attr("id"));

			_validation.validate(_currentRow,_currentCol);
		},

		findIndexWrongArray: function (row, col) {
			var index = -1;
			_.find(_wrongCell, function (element, i) {
				if (element.r === row && element.c === col) {
					index = i;
				}
			});
			return index;
		},

		addToWrongArray: function (row, col, type) {
			var index = _controller.findIndexWrongArray(row,col);
			if (index === -1) {
				var cell = "#cell" + row + col;
				$(cell).addClass("wrong");

				var object = {'r': row, 'c': col, 'wrongType': type};
				_wrongCell.push(object);
			}
		},

		removeFromWrongArray: function (row, col) {
			var index = _controller.findIndexWrongArray(row,col);
			if (index !== -1) {
				var cell = "#cell" + row + col;
				$(cell).removeClass("wrong");

				_wrongCell.splice(index,1);
			}
		}
	};


	var _validation = {
		validate: function (row, col) {
			_validation.checkRow(row, col);
			_validation.checkCol(row, col);
			_validation.checkSquare(row, col);
			_validation.checkWrongArray();
			_validation.checkCompleted();
		},

		checkRow: function (r, c) {
			var visited = [false, false, false, false, false, false, false, false, false];

			for (var col in _playing[r]) {
				if (col != c) {
					if (_playing[r][col]) {
						if (!visited[_playing[r][col]-1]) visited[_playing[r][col]-1] = true;
					}
				}
			}

			if (visited[_playing[r][c]-1]) {
				var index = _controller.findIndexWrongArray(r,c);
				if (index === -1) {
					_controller.addToWrongArray(r,c,"row");
				}
			}
			else {
				visited[_playing[r][c]-1] = true;
				if (_wrongCellCheckingMode) {
					_controller.removeFromWrongArray(r, c);

					_wrongCellCheckingMode = false;
					_validation.checkCol(r, c);
					_validation.checkSquare(r, c);
				}
			}
		},

		checkCol: function (r, c) {
			var visited = [false, false, false, false, false, false, false, false, false];

			for (var row in _playing) {
				if (row != r) {
					if (_playing[row][c]) {
						if (!visited[_playing[row][c]-1]) visited[_playing[row][c]-1] = true;
					}
				}
			}

			if (visited[_playing[r][c]-1]) {
				var index = _controller.findIndexWrongArray(r,c);
				if (index === -1) {
					_controller.addToWrongArray(r,c,"col");
				}
			}
			else {
				visited[_playing[r][c]-1] = true;
				if (_wrongCellCheckingMode) {
					_controller.removeFromWrongArray(r, c);

					_wrongCellCheckingMode = false;
					_validation.checkRow(r, c);
					_validation.checkSquare(r, c);
				}
			}
		},

		checkSquare: function (r, c) {
			var squareRow = Math.floor(r/3);
			var squareCol = Math.floor(c/3);

			var visited = [false, false, false, false, false, false, false, false, false];

			for (var row = squareRow*3; row < squareRow*3+3; row++) {
				for (var col = squareCol*3; col < squareCol*3+3; col++) {
					if (row != r && col != c) {
						if (_playing[row][col]) {
							if (!visited[_playing[row][col]-1]) visited[_playing[row][col]-1] = true;
						}
					}
				}
			}

			if (visited[_playing[r][c]-1]) {
				var index = _controller.findIndexWrongArray(r,c);
				if (index === -1) {
					_controller.addToWrongArray(r,c,"square");
				}
			}
			else {
				visited[_playing[r][c]-1] = true;
				if (_wrongCellCheckingMode) {
					_controller.removeFromWrongArray(r, c);

					_wrongCellCheckingMode = false;
					_validation.checkRow(r, c);
					_validation.checkCol(r, c);
				}
			}
		},

		checkWrongArray: function () {
			_wrongCellCheckingMode = true;

			for (var i in _wrongCell) {
				var row = _wrongCell[i].r;
				var col = _wrongCell[i].c;
				var type = _wrongCell[i].wrongType;

				switch(type) {
					case "row":
						_validation.checkRow(row, col);
						break;
					case "col":
						_validation.checkCol(row,col);
						break;
					case "square":
						_validation.checkSquare(row, col);
						break;
				}
			}

			_wrongCellCheckingMode = false;
		},

		checkCompleted: function () {
			for (var row in _playing) {
				for (var col in _playing[row]) {
					if (_playing[row][col] === null) {
						return;
					}
				}
			}

			if (_wrongCell.length > 0) alert("Please fix wrong cells");
			else alert("Congratulations! You solved this quiz");
		}
	};


	return {
		startGame: _startGame
	}
})();



$(function () {
	Sudoku.startGame();
});


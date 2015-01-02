var App = {
	board: [
		[5,3,null,null,7,null,null,null,null],
		[6,null,null,1,9,5,null,null,null],
		[null,9,8,null,null,null,null,6,null],
		[8,null,null,null,6,null,null,null,3],
		[4,null,null,8,null,3,null,null,1],
		[7,null,null,null,2,null,null,null,6],
		[null,6,null,null,null,null,2,8,null],
		[null,null,null,4,1,9,null,null,5],
		[null,null,null,null,8,null,null,7,9]
	]
};

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


// var cellModel = function () {
// 	var cellValue = null;

// 	var setCell = function (input) {
// 		cellValue = input;
// 	};

// 	var eraseCell = function () {
// 		cellValue = null;
// 	};

// 	var getCellValue = function () {
// 		return cellValue;
// 	};

// 	return {
// 		setCell: setCell,
// 		eraseCell: eraseCell,
// 		getCellValue: getCellValue
// 	};
// };

var exampleFunction = function () {
	alert("Hello World!");
}


$(function () {
	_.templateSettings.variable = "rc";

    var template = _.template(
        $( "script.table" ).html()
    );

    var templateData = {
    	board: App.board
    };

	$("#board").append(template(templateData));

	$(".board-row").each(function (i) {
		$(this).find('a.board-cell').each(function (j) {
			var row = i+1;
			var col = j+1;
			$(this).attr("id", "cell" + row + col);

			if (App.board[i][j]) $(this).addClass("preset");
			else $(this).attr("onclick", "exampleFunction()");
		});
	});
});


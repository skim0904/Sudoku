Sudoku for code challenge
======

This is a Sudoku app to solve the puzzle.
To play this Sudoku, visit [http://kim-sudoku.herokuapp.com/](http://kim-sudoku.herokuapp.com/)

###1. Structure of the application
  - Home.html: the HTML page that has elements to be displayed, including template scripts.
  - main.js: the Javascript file for view, controller, and logic functions.
  - style.css: the CSS file to style elements.
  - index.php: a PHP file to masquerade the app so that it can be deployed in Heroku.
  
###2. Technologies
  - jQuery: I used this Javascript library heavily as it makes a lot easier to communicate with HTML elements.
  - Underscore: I used this as templating engine to render the board and the number pad and as helper function. I picked this one as I've seen the uses a few times before. I haven't had much experience with Underscore but it was easy to find enough resource to teach myself and decided to go with it.
  - CSS Media Queries: I used this to make the board size responsive to devices of different sizes.
  - Module Pattern (Revealing Modular Pattern): I worked with this pattern because I personally think it's clean and simple, and data/functions can be hidden as private methods. It's harder to extend or test as private data and methods are unaccessible, but I felt safe to stay with it as the application was fairly simple and ended up with less than 500 lines of code. If the application was bigger I would have used it differently to split them up in model/view/controller manner.
  
###3. Workflow
  1. Board, default numbers, and the number pad are rendered at the beginning
    - The board is responsive to screen size. For small screen, the board takes up 90% of screen, for medium screen 60% and for large screen 30% of screen.
    - All clickable cells have different colors at hover or select event.
    - Default numbers are gray colored and they can't be modified.
  2. User can fill in the cell by clicking it and choose number
    - Device with keyboard: supports both clicking on number pad and typing (number, backspace, and 4 direction arrow keys).
    - Mobile devices without keyboard: supports only clicking on number pad. I made the number pad on purpose as I personally felt very inconvinient to use keyboard when I tried Sudoku on phone as the keyboard blocks half of the screen (and the board), and it's hard to look at other possible errors that would happen.
    - _Erase_ button will remove the value in the selected cell.
  3. When a number is chosen, validation code is invoked.
    - It checks if that number has duplicate in the row, column, or 3X3 sub-square. 
    - If there's an error the value will be displayed in red.
  4. When a number is erased or replaced, validation on existing errors is also invoked to check if erasing or replacing that cell removed other existing error.
    - If it did remove any error and that error doesn't conflict with anything else then the value in the error cell will change to black color.
  5. When _Restart_ button is clicked, the board resets to default.
  6. When all cells are filled, it checks if there's any error. If yes it asks for fix, otherwise it lets the user know he/she completed the puzzle.

###4. Possible improvements
  If I had more time:
  - I would implement a board generator function, with different levels.
  - I would implement a note function, where users can keep list of possible answers for each cell. That would be helpful solving difficult level of Sudoku.
  - I would implement a time elapsed function so that users can keep (or even share) their records.
  - I would research if there's a better way to validate numbers, e.g. error checking, than my algorithm to expedite the performance.
  - I would investigate more in UI so that filling in the board is optimized for users.

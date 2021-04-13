class Game {
	constructor (HEIGHT, WIDTH) {
		this.HEIGHT = HEIGHT;
		this.WIDTH = WIDTH;
		this.currPlayer = 1;
		this.boardArray = [];
		this.makeBoard();
		this.makeHtmlBoard();
	}

	makeBoard () {
		for (let y = 0; y < this.HEIGHT; y++) {
			this.boardArray.push(Array.from({ length: this.WIDTH }));
		}
	}

	makeHtmlBoard () {
		const board = document.getElementById('board');
		board.innerHTML = '';
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');

		this.handleGameClick = this.handleClick.bind(this); // need to understand this better.
		top.addEventListener('click', this.handleGameClick);

		for (let x = 0; x < this.WIDTH; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}
		board.append(top);
		for (let y = 0; y < this.HEIGHT; y++) {
			const row = document.createElement('tr');
			for (let x = 0; x < this.WIDTH; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}
			board.append(row);
		}
	}

	handleClick (evt) {
		const x = +evt.target.id;
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		this.boardArray[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		if (this.checkForWin()) {
			return this.endGame(`Player ${this.currPlayer} won!`);
		}

		if (this.boardArray.every((row) => row.every((cell) => cell))) {
			return this.endGame('Tie!');
		}

		this.currPlayer = this.currPlayer === 1 ? 2 : 1;
	}

	findSpotForCol (x) {
		for (let y = this.HEIGHT - 1; y >= 0; y--) {
			if (!this.boardArray[y][x]) {
				return y;
			}
		}
		return null;
	}

	placeInTable (y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.classList.add(`p${this.currPlayer}`);
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	checkForWin () {
		const _win = (cells) =>
			cells.every(
				([ y, x ]) =>
					y >= 0 && y < this.HEIGHT && x >= 0 && x < this.WIDTH && this.boardArray[y][x] === this.currPlayer,
			);

		for (let y = 0; y < this.HEIGHT; y++) {
			for (let x = 0; x < this.WIDTH; x++) {
				const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}

	endGame (msg) {
		alert(msg);
		const top = document.querySelector('#column-top');
		top.removeEventListener('click', this.handleGameClick);
	}
}

document.getElementById('button').addEventListener('click', () => {
	new Game(6, 7);
});

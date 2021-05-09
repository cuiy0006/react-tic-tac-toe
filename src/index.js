import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}

// function Square(props){
//     return (
//         <button className="square" onClick={props.onClick}>
//             {props.value}
//         </button>
//     );
// }

class Board extends React.Component {

    renderSquare(i, j) {
        return (
            <Square 
                key={i.toString() + ',' + j.toString()}
                value={this.props.squares[i][j]} 
                onClick={() => this.props.onClick(i, j)}
            />
        );
    }

    renderRow(i) {
        let row = []
        for(let j = 0; j < this.props.size; j++){
            row.push(this.renderSquare(i, j));
        }
        return <div key={i} className="board-row">{row}</div>;
    }

    render() {
        let all = []
        for(let i = 0; i < this.props.size; i++){
            all.push(this.renderRow(i));
        }
        return (
            <div>{all}</div>
        );
    }
}

class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {size: this.props.size};
  
    }
  
    handleChange(event) {
        this.setState({
            size: event.target.value
        });
    }

    handleClick() {
        this.props.onClick(this.state.size);
    } 
  
    render() {
      return (
        <div>
          <label>
            Size: 
            <input className="input-text" type="text" maxLength="1" value={this.state.size} onChange={(event) => this.handleChange(event)} />
          </label>

          <button onClick={() => this.handleClick()}>Submit</button>
        </div>
      );
    }
  }


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitState(3);
    }

    getInitState(size) {
        return {
            size: size,
            history: [{
                squares: Array(size).fill(Array(size).fill(null))
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleSizeClick(size){
        size = parseInt(size);
        this.setState(
            this.getInitState(size)
        );
    }

    handleClick(i, j){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.map(function(row) {
            return row.slice();
        });

        if(calculateWinner(squares) || squares[i][j]){
            return;
        }

        squares[i][j] = this.state.xIsNext? 'X': 'O';

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: this.state.stepNumber + 1,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move:
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext? 'X': 'O');
        }

        return (
            <div className="game">
                <div>
                    <div>
                        <NameForm size={this.state.size} onClick={(size) => this.handleSizeClick(size)} />
                    </div>
                    <div className="game-broad">
                        <Board squares={current.squares} size={this.state.size} onClick={(i, j) => this.handleClick(i, j)} />
                    </div>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const l = squares.length;
    let rows = Array(l).fill(0);
    let cols = Array(l).fill(0);
    let diag = 0;
    let rev_diag = 0;
    for(let i = 0; i < l; i++){
        for(let j = 0; j < l; j++){
            let curr = 0;
            if(squares[i][j] === 'X')
                curr = 1;
            else if(squares[i][j] === 'O')
                curr = -1;

            rows[i] += curr;
            cols[j] += curr;
            if(i === j){
                diag += curr;
            }
            if(i + j === l - 1){
                rev_diag += curr;
            }
            if(rows[i] === l || cols[j] === l || diag === l || rev_diag === l){
                return 'X';
            }
            if(rows[i] === -l || cols[j] === -l || diag === -l || rev_diag === -l){
                return 'O';
            }
        }
    }

    return null;
}



ReactDom.render(
    <Game />,
    document.getElementById('root')
);


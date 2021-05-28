import React, { useState, useEffect } from "react";
import "./index.css";
const SnackGame = () => {
  let blockMaping = require("../../json/maping.json"); // json file for dynamic div,classes,ladder,snake.
  const [playerOneActiveIndex, setPlayerOneActiveIndex] = useState(1);
  const [playerTwoActiveIndex, setPlayerTwoActiveIndex] = useState(1);
  const [playerOneDice, setPlayerOneDice] = useState(0);
  const [playerTwoDice, setPlayerTwoDice] = useState(0);
  const [activePlayer, setActivePlayer] = useState("playerOne");
  const [playerOneTotalWin, setPlayerOneTotalWin] = useState(0);
  const [playerTwoTotalWin, setPlayerTwoTotalWin] = useState(0);
  const [turnament, setTurnament] = useState(null);
  const [steps, setSteps] = useState({
    playerOne: 0,
    playerTwo: 0
  });

  useEffect(() => {
    //compair player win count with turnament count
    if (turnament && playerOneTotalWin == turnament) {
      alert(" Player one win the turnament");
      setTurnament(null);
      newGame();
    } else if (turnament && playerOneTotalWin == turnament) {
      alert(" Player two win the turnament");
      setTurnament(null);
      newGame();
    }
  }, [playerOneTotalWin, playerTwoTotalWin]);

  const playerAction = (
    setDice,
    setActivePlayer,
    playerActiveIndex,
    setPlayerActiveIndex,
    setPlayerTotalWin,
    playerTotalWin,
    playerNumber,
    nextTurn
  ) => {
    //check for active player
    if (activePlayer == playerNumber) {
      setSteps({ ...steps, [playerNumber]: (steps[playerNumber] += 1) });
      console.log(steps);
      //random number from 1 to 6
      let randomNumber = Math.floor(Math.random() * 6) + 1;
      //state update
      setDice(randomNumber);
      // state for identify whose tern
      setActivePlayer(nextTurn);
      // check for skip count more than 100
      if (playerActiveIndex + randomNumber <= 100) {
        // set the position
        setPlayerActiveIndex(playerActiveIndex + randomNumber);
        // to get ladder number
        let ladder = parseInt(
          document
            .getElementById(playerActiveIndex + randomNumber)
            .getAttribute("data-for-ladder")
        );
        // to get snake number
        let snake = parseInt(
          document
            .getElementById(playerActiveIndex + randomNumber)
            .getAttribute("data-for-snake")
        );

        // check for ladder/ number is there
        if (ladder || snake) {
          // update the state after 500 milisecond for better experience
          setTimeout(function() {
            setPlayerActiveIndex(ladder || snake);
          }, 500);
        }

        // check for player win
        if (playerActiveIndex + randomNumber == 100) {
          setTimeout(function() {
            alert(`${playerNumber} Win by ${steps[playerNumber]} steps`); //alert
            setPlayerTotalWin(playerTotalWin + 1); //set win cont
            restartGame(); // restart game
          }, 800);
        }
      }
    }
  };

  const diceClick = player => {
    if (player == "playerOne") {
      playerAction(
        setPlayerOneDice,
        setActivePlayer,
        playerOneActiveIndex,
        setPlayerOneActiveIndex,
        setPlayerOneTotalWin,
        playerOneTotalWin,
        player,
        "playerTwo"
      );
    } else if (player == "playerTwo") {
      playerAction(
        setPlayerTwoDice,
        setActivePlayer,
        playerTwoActiveIndex,
        setPlayerTwoActiveIndex,
        setPlayerTwoTotalWin,
        playerTwoTotalWin,
        player,
        "playerOne"
      );
    }
  };

  const restartGame = () => {
    // for restart game
    setPlayerOneActiveIndex(1);
    setPlayerTwoActiveIndex(1);
    setPlayerOneDice(0);
    setPlayerTwoDice(0);
    setActivePlayer("playerOne");
    setSteps({
      playerOne: 0,
      playerTwo: 0
    });
  };

  const newGame = () => {
    //for new game
    setPlayerOneTotalWin(0);
    setPlayerTwoTotalWin(0);
    restartGame();
  };

  const onTurnamentClick = () => {
    //for set turnament limit
    var turnamentLimit = prompt("Set the match limit", 5);
    if (turnamentLimit) {
      setTurnament(turnamentLimit);
    }
  };

  const getPlayBoard = () => {
    return (
      <>
        {blockMaping.map((row, index) => {
          return (
            <>
              <div className={`row${index + 1}`}>
                {row.map((value, rowIndex) => {
                  return (
                    <div className={`block-${rowIndex + 1}`}>
                      <div
                        id={value.block}
                        data-for-ladder={value.ladder}
                        data-for-snake={value.snake}
                      >
                        {playerOneActiveIndex === value.block && (
                          <span className="playerOneCoin">@</span>
                        )}
                        {playerTwoActiveIndex === value.block && (
                          <span className="playerTwoCoin">@</span>
                        )}
                        {value.block}
                        {value.ladder ? (
                          <span className="ladder-to">{`-> ${value.ladder}`}</span>
                        ) : (
                          value.snake && (
                            <span className="snake-to">{`-> ${value.snake}`}</span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
      </>
    );
  };

  return (
    <div className="snake-game-container">
      <button onClick={restartGame} className="restart-game-button">
        Restart
      </button>
      <button onClick={newGame} className="new-game-button">
        New Game
      </button>
      <button onClick={onTurnamentClick} className="turnament-button">
        Set turnament
      </button>
      <div className="playerOne">
        Player One
        <div className="dice-1">
          <button
            className="playerOneDice"
            onClick={() => diceClick("playerOne")}
          >
            {playerOneDice}
          </button>
        </div>
        <div className="playerWinCount">
          Player one total Win :- {playerOneTotalWin}
        </div>
      </div>
      <div className="playerTwo">
        Player Two
        <div className="dice-2">
          <button
            className="playerTwoDice"
            onClick={() => diceClick("playerTwo")}
          >
            {playerTwoDice}
          </button>
        </div>
        <div className="playerWinCount">
          Player two total Win :- {playerTwoTotalWin}
        </div>
      </div>
      {getPlayBoard()}
    </div>
  );
};
export default SnackGame;

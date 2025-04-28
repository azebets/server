const { Server } = require("socket.io");
const Chats = require("../model/public-chat");
const DiceGame = require("../model/games/classic-dice/dice_game");  
const { CrashGameEngine } = require("../games/crash.controllers");
const { Public_Chat } = require("../controllers/public_chat.controller");
const { MinesGames } = require("../games/mines.controllers");
const { PlinkoGameSocket } = require("../games/plinko.controller");
const {
  handleHiloBet,
  handleHiloNextRound,
  handleHiloCashout,
  initHiloGame,
} = require("../games/hilo.controller");

async function createsocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["https://azebets.com","http://localhost:5173" ]
    },
  });
  new Public_Chat(io).connection()
  new MinesGames(io).connect()
    // Plinko GAME
  new PlinkoGameSocket(io).listen();

  // Crash Game
  new CrashGameEngine(io)
  .run((latestBet) => {
    io.emit("latest-bet", latestBet);
  })
  .catch((err) => {
    console.log("Crash Game failed to start ::> ", err);
  })

  let fghhs = await DiceGame.find().limit(20)
  let activeplayers = [...fghhs];
  const DiceActivePlayers = async (e) => {
    if (activeplayers.length > 21) {
      activeplayers.shift();
      activeplayers.push(e);
    } else {
      activeplayers.push(e);
    }
    io.emit("dice-gamePLayers", activeplayers);
  };

  io.on("connection", (socket) => {
    socket.on("dice-game", (data) => {
      DiceActivePlayers(data);
    });

    //HILO GAME
    socket.on("hilo-init", (data) => {
      initHiloGame(data, (event, payload) => {
        io.emit(event, payload);
      });
    });
    socket.on("hilo-bet", (data) => {
      handleHiloBet(data, (event, payload) => {
        io.emit(event, payload);
      });
    });
    socket.on("hilo-cashout", (data) => {
      handleHiloCashout(data, (event, payload) => {
        io.emit(event, payload);
      });
    });
    socket.on("hilo-next-round", (data) => {
      handleHiloNextRound(data, (event, payload) => {
        io.emit(event, payload);
      });
    });
  });

 
}

module.exports = { createsocket }

const authRoute = require('./auth.route');
const DiceRoute = require('./api/games/dice.route');
const HiloRoute = require('./api/games/hilo.route');
const crash = require('./api/games/crashgame.route');
const profileRoute = require('./api/profile.route');
const ccpaymentRoute = require('./api/ccpayment.route');
const plinkoGame = require("./api/games/plinko.route")

const routeManager = (app) => {

    // API Routes
    app.use("/auth", authRoute);
    app.use('/api/games', DiceRoute);
    app.use('/api/hilo-game', HiloRoute);
    app.use('/api/user/crash-game', crash);
    app.use("/api/user/plinko-game", plinkoGame);
    app.use("/api/profile", profileRoute);
    app.use("/api/ccpayment", ccpaymentRoute);

}

module.exports = routeManager
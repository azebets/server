const express = require('express');
const router = express.Router();
const mainRouter = express.Router();
const requireAuth = require('../../../middleware/requireAuth');
const controller = require('../../../games/plinko.controller');



// auth middleware

mainRouter.get('/details/:betID', controller.gameDetail);
router.get('/seeds', requireAuth,  controller.gameSeeds);
router.post('/my-bet',requireAuth, controller.userBets);
router.post('/update-seeds',requireAuth, controller.updateSeeds);

mainRouter.use(router);

module.exports = mainRouter;
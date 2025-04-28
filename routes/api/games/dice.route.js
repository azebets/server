const express = require('express')
const router = express.Router()

const controller = require('../../../games/dice.controllers')
const requireAuth = require('../../../middleware/requireAuth')


//============ Dice game ==========================

router.get('/dice-game/historyByID/:id', controller.gameDetalsByID)
router.get('/dice-game/generate-seed', controller.generateNewServerSeed)
router.post('/dice-game/Verify-dice', controller.VerifyDice)
router.get('/dice-game/encrypt', requireAuth, controller.handleDiceGameEncryption)
router.get('/dice-game/dice-history',requireAuth,  controller.getDiceGameHistory)
router.post('/dice-game/bet',requireAuth, controller.HandlePlayDice)
router.post('/dice-game/seed-settings', requireAuth, controller.seedSettings)


module.exports = router
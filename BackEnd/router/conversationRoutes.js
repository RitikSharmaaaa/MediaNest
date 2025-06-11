const express = require('express');
const { isAuthencaicated } = require('../middleware/Auth');
const { sendMessage, getAllMessage } = require('../controllers/conversationControllers');
const router = express.Router();

router.route('/sendmessage/:id').post(isAuthencaicated,sendMessage);
router.route('/allcoversation/:id').get(isAuthencaicated,getAllMessage);

module.exports = router;
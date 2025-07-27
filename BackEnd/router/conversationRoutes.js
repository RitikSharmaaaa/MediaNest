const express = require('express');
const { isAuthenticated } = require('../middleware/Auth'); // <-- fix here
const { sendMessage, getAllMessage } = require('../controllers/conversationControllers');
const router = express.Router();

router.route('/sendmessage/:id').post(isAuthenticated, sendMessage);
router.route('/allconversation/:id').get(isAuthenticated, getAllMessage);

module.exports = router;

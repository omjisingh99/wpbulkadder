const express = require('express');
const router = express.Router();
const client = require('../whatsapp');

router.post('/', async (req, res) => {
  try {
    const groupId = req.body.groupId?.trim();
    const file = req.files?.file;

    if (!groupId || !file) {
      return res.status(400).json({ error: 'Group ID or file missing.' });
    }

    const content = file.data.toString('utf8');
    const numbers = content
      .split(/\r?\n/)
      .map(n => n.trim().replace(/\D/g, ''))
      .filter(n => n.length >= 10)
      .map(n => `${n}@c.us`);

    const chat = await client.getChatById(groupId);

    let added = [];
    let failed = [];

    for (const number of numbers) {
      try {
        await chat.addParticipants([number]);
        added.push(number);
      } catch (err) {
        failed.push({ number, error: err.message });
      }
    }

    res.json({ success: true, added, failed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

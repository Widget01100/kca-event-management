const firebaseService = require('../services/firebaseService');

exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const event = await firebaseService.createEvent(eventData);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await firebaseService.getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

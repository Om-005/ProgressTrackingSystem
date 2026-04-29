const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { protect } = require('../middleware/auth');

// @route   GET /api/logs
// @desc    Get user logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/logs
// @desc    Add a log
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { date, category, hours, notes } = req.body;

    if (!date || !category || !hours) {
        return res.status(400).json({ error: 'Date, category, and hours are required' });
    }

    const log = await Log.create({
      userId: req.user.id,
      date,
      category,
      hours,
      notes
    });

    res.status(201).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PUT /api/logs/:id
// @desc    Update a log
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) {
        return res.status(404).json({ error: 'Log not found' });
    }

    if (log.userId.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    const { date, category, hours, notes } = req.body;
    if (date !== undefined) log.date = date;
    if (category !== undefined) log.category = category;
    if (hours !== undefined) log.hours = hours;
    if (notes !== undefined) log.notes = notes;

    await log.save();
    res.status(200).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   DELETE /api/logs/:id
// @desc    Delete a log
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) {
        return res.status(404).json({ error: 'Log not found' });
    }

    if (log.userId.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    await log.deleteOne();
    res.status(200).json({ message: 'Log removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;

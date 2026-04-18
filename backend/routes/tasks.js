const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Log = require('../models/Log');
const { protect } = require('../middleware/auth');

const CATEGORIES = [
  { id: 'dsa', name: 'DSA' },
  { id: 'development', name: 'Development' },
  { id: 'cs-core', name: 'CS Core' },
  { id: 'ai-ml', name: 'AI/ML' },
  { id: 'learning', name: 'Learning' }
];

// @route   GET /api/tasks
// @desc    Get user tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/tasks
// @desc    Add a task
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!title || !date) {
        return res.status(400).json({ error: 'Title and date are required' });
    }

    const task = await Task.create({
      userId: req.user.id,
      title,
      date,
      completed: false
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completion
// @access  Private
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get dashboard stats
// @access  Private
// To keep things simple, routing this here instead of a separate stats route
router.get('/stats', protect, async (req, res) => {
    try {
        const logs = await Log.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
        const tasks = await Task.find({ userId: req.user.id });
        
        const totalHours = logs.reduce((sum, log) => sum + parseFloat(log.hours), 0);
        
        const today = new Date().toISOString().split('T')[0];
        const todayHours = logs
          .filter(log => log.date === today)
          .reduce((sum, log) => sum + parseFloat(log.hours), 0);
          
        const uniqueDates = [...new Set(logs.map(log => log.date))].sort((a, b) => new Date(b) - new Date(a));
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;
        
        for (let i = 0; i < uniqueDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const diff = (new Date(uniqueDates[i - 1]) - new Date(uniqueDates[i])) / 86400000;
                if (diff === 1) {
                    tempStreak++;
                } else {
                    if (tempStreak > bestStreak) bestStreak = tempStreak;
                    tempStreak = 1;
                }
            }
        }
        if (tempStreak > bestStreak) bestStreak = tempStreak;
    
        let currentDate = new Date();
        if (!uniqueDates.includes(today)) {
          currentDate.setDate(currentDate.getDate() - 1);
        }
        while (true) {
          const dateStr = currentDate.toISOString().split('T')[0];
          if (uniqueDates.includes(dateStr)) {
            currentStreak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
    
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyLogs = logs.filter(log => new Date(log.date) >= oneWeekAgo);
        const weeklyHours = weeklyLogs.reduce((sum, log) => sum + parseFloat(log.hours), 0);
        
        const catHours = {};
        weeklyLogs.forEach(log => {
          catHours[log.category] = (catHours[log.category] || 0) + parseFloat(log.hours);
        });
        
        let mostFocusedCategory = 'None';
        let maxCatHours = 0;
        Object.entries(catHours).forEach(([cat, hours]) => {
          if (hours > maxCatHours) {
            maxCatHours = hours;
            mostFocusedCategory = CATEGORIES.find(c => c.id === cat)?.name || cat;
          }
        });
    
        const completionRate = tasks.length > 0 
            ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
            : 0;
    
        res.json({ 
          totalHours, 
          todayHours, 
          currentStreak, 
          bestStreak,
          weeklySummary: {
              hours: weeklyHours,
              mostFocused: mostFocusedCategory,
              completionRate
          }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    approveLeave,
    rejectLeave,
} = require('../controllers/leaveController');
const { protect, employer } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);

router.get('/all', protect, employer, getAllLeaves);
router.patch('/:id/approve', protect, employer, approveLeave);
router.patch('/:id/reject', protect, employer, rejectLeave);

module.exports = router;

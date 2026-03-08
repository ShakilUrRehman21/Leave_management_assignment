const Leave = require('../models/Leave');

// @desc    Apply for leave
// @route   POST /api/leaves/apply
// @access  Private (Employee)
const applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: 'End date cannot be before start date' });
        }

        const leave = new Leave({
            employeeId: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'Pending',
        });

        const createdLeave = await leave.save();
        res.status(201).json(createdLeave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user's leaves
// @route   GET /api/leaves/my-leaves
// @access  Private
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all leaves (Admin)
// @route   GET /api/leaves/all
// @access  Private/Employer
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({})
            .populate('employeeId', 'name email')
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Approve leave
// @route   PATCH /api/leaves/:id/approve
// @access  Private/Employer
const approveLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        leave.status = 'Approved';
        const updatedLeave = await leave.save();
        res.json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Reject leave
// @route   PATCH /api/leaves/:id/reject
// @access  Private/Employer
const rejectLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        leave.status = 'Rejected';
        const updatedLeave = await leave.save();
        res.json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    approveLeave,
    rejectLeave,
};

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Add student
router.post('/add', async (req, res) => {

    try {

        const student = new Student({
            name: req.body.name,
            rollNo: req.body.rollNo,
            course: req.body.course
        });

        await student.save();

        res.json({ message: 'Student added successfully' });

    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all students
router.get('/', async (req, res) => {

    try {

        const students = await Student.find();
        res.json(students);

    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Update student
router.put('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                rollNo: req.body.rollNo,
                course: req.body.course
            },
            { new: true }
        );
        res.json(updatedStudent);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
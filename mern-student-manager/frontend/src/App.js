import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', rollNo: '', course: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = 'http://localhost:5000/students';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.course) {
      alert('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API}/add`, formData);
      }
      setFormData({ name: '', rollNo: '', course: '' });
      fetchStudents();
    } catch (error) {
      console.log(error);
      alert('An error occurred. Check console.');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      course: student.course
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchStudents();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', rollNo: '', course: '' });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Student Nexus</h1>
        <p>Advanced Record Management System</p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="rollNo">Roll Number</label>
            <input
              id="rollNo"
              name="rollNo"
              type="number"
              placeholder="e.g. 101"
              value={formData.rollNo}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="course">Course</label>
            <input
              id="course"
              name="course"
              placeholder="e.g. Computer Science"
              value={formData.course}
              onChange={handleChange}
            />
          </div>
          <div className="actions" style={{ marginBottom: '2px' }}>
            <button type="submit">
              {editingId ? 'Update' : 'Add Student'}
            </button>
            {editingId && (
              <button type="button" className="btn-danger" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel">
        {loading ? (
          <div className="empty-state">Loading records...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <h3>No students found</h3>
            <p>Add a student to get started.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{student.name}</strong>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>#{student.rollNo}</td>
                    <td>
                      <span className="badge">{student.course}</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-icon" onClick={() => handleEdit(student)}>
                          Edit
                        </button>
                        <button className="btn-icon btn-danger" onClick={() => handleDelete(student._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
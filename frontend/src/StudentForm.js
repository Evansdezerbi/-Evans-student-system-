import React, { useState, useEffect } from 'react';

const StudentForm = ({ onSubmit, student }) => {
  const [form, setForm] = useState({ name: '', email: '', age: '', course: '' });

  useEffect(() => {
    if (student) {
      setForm(student);
    } else {
      setForm({ name: '', email: '', age: '', course: '' });
    }
  }, [student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!student) setForm({ name: '', email: '', age: '', course: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" />
      <input name="course" value={form.course} onChange={handleChange} placeholder="Course" />
      <button type="submit">{student ? 'Update' : 'Add'} Student</button>
    </form>
  );
};

export default StudentForm;
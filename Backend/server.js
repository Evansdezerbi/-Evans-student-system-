const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_secret_key';

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('srms');
    console.log('Connected to MongoDB');
    await db.collection('admin').createIndex({ username: 1 }, { unique: true });
    await db.collection('students').createIndex({ email: 1 }, { unique: true });
    console.log('Indexes created');
    const adminCollection = db.collection('admin');
    const existingAdmin = await adminCollection.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = '$2b$10$5ezhOW3p6YxhJXoGhNBefeeebB3WhIb5FUBhWSgi7o3O9VqaDVwHO';
      await adminCollection.insertOne({ username: 'admin', password: hashedPassword });
      console.log('Admin user inserted');
    }
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await db.collection('admin').findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

app.get('/api/students', authenticateToken, async (req, res) => {
  const search = req.query.search || '';
  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { course: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const students = await db.collection('students').find(query).toArray();
    const formattedStudents = students.map(student => ({
      id: student._id,
      name: student.name,
      email: student.email,
      age: student.age,
      course: student.course
    }));
    res.json(formattedStudents);
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
  const { name, email, age, course } = req.body;
  try {
    const result = await db.collection('students').insertOne({ name, email, age, course });
    res.json({ id: result.insertedId, name, email, age, course });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Database error' });
    }
  }
});

app.put('/api/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, age, course } = req.body;
  try {
    await db.collection('students').updateOne({ _id: new ObjectId(id) }, { $set: { name, email, age, course } });
    res.json({ message: 'Student updated' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Database error' });
    }
  }
});

app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('students').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

app.put('/api/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.header('Authorization')?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await db.collection('admin').findOne({ _id: new ObjectId(decoded.id) });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('admin').updateOne({ _id: new ObjectId(decoded.id) }, { $set: { password: hashedNewPassword } });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
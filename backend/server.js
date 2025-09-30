const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require("passport");
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');

require("./utils/birthdayCron");

// Load environment variables
dotenv.config();
require("./config/passport");

// Connect to MongoDB
connectDB();

const app = express();

// ------------------------
// CORS CONFIGURATION
// ------------------------
const FRONTEND_URL = "https://workhubbb.netlify.app"; // ✅ Your frontend URL

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// ------------------------
// Socket.IO Setup
// ------------------------
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});

// ------------------------
// Middleware
// ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for default avatars and uploaded files
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Security headers
app.use(helmet());

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));

// ------------------------
// SESSION CONFIGURATION FOR PASSPORT
// ------------------------
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_super_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// ------------------------
// ROUTES
// ------------------------
const authRoutes = require('./routes/authRoutes');
const workRoutes = require('./routes/workRoutes'); 
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const taskRoutes = require('./routes/taskRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const testRoutes = require("./routes/testRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/work', workRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/holidays', holidayRoutes);
app.use("/test", testRoutes);

// ------------------------
// SOCKET.IO LOGIC
// ------------------------
const { markAttendance } = require('./controllers/attendanceController');

io.on('connection', (socket) => {
  console.log(`✅ Socket.IO: Client connected with ID: ${socket.id}`);

  socket.on('update_attendance', async ({ userId, status }) => {
    try {
      const req = { user: { _id: userId }, body: { status } };
      const res = {
        status: (code) => ({ json: (data) => {} }),
        json: (data) => {}
      };
      
      await markAttendance(req, res);

      io.emit('attendance_updated', { userId, status });

    } catch (error) {
      console.error('Socket.IO: Error updating attendance:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket.IO: Client disconnected:', socket.id);
  });
});

// ------------------------
// Cron Jobs
// ------------------------
require("./utils/birthdayCron");
require("./utils/attendanceCron");

// ------------------------
// Health check
// ------------------------
app.get('/', (req, res) => res.send('✅ API is running...'));

// ------------------------
// 404 Handler
// ------------------------
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ------------------------
// Global error handler
// ------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ------------------------
// START SERVER
// ------------------------
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

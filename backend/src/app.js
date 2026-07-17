const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const authRoutes          = require('./routes/authRoutes');
const ticketRoutes        = require('./routes/ticketRoutes');
const commentRoutes       = require('./routes/commentRoutes');
const knowledgeBaseRoutes = require('./routes/knowledgeBaseRoutes');
const notificationRoutes  = require('./routes/notificationRoutes');
const clientRoutes        = require('./routes/clientRoutes');
const managerRoutes       = require('./routes/managerRoutes');
const adminRoutes         = require('./routes/adminRoutes');
const developerRoutes     = require('./routes/developerRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));

// Public auth routes
app.use('/api/auth', authRoutes);

// Protected routes (JWT required via protect middleware inside each router)
app.use('/api/tickets', ticketRoutes);
app.use('/api/tickets/:id/comments', commentRoutes);
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/client',   clientRoutes);
app.use('/api/manager',  managerRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/developer', developerRoutes);

// 404
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

// Central error handler
app.use(errorHandler);

module.exports = app;

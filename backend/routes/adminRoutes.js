import express from 'express';
import { setUserRole, verifyUserRole } from '../services/firebase-admin.js';

const router = express.Router();

// Middleware to verify admin status
router.use(async (req, res, next) => {
  const { uid } = req.user;
  const isAdmin = await verifyUserRole(uid, 'admin');
  if (!isAdmin) return res.status(403).json({ error: 'Admin access required' });
  next();
});

// Promote user to admin
router.post('/promote/:userId', async (req, res) => {
  const success = await setUserRole(req.params.userId, 'admin');
  if (success) return res.json({ message: 'User promoted to admin' });
  return res.status(500).json({ error: 'Promotion failed' });
});

export default router;
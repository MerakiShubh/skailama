import express from 'express';
import { createEvent, getAllEvents, updateEvent, getEventLogs } from '../controllers/event.controllers.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/', getAllEvents);
router.put('/', updateEvent);
router.get('/logs', getEventLogs);

export default router;

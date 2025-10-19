import express from 'express';
import { createEvent, getAllEvents, updateEvent, getEventLogs } from '../controllers/event.controllers.js';

const router = express.Router();

router.post('/', createEvent);
router.post('/getAllEvents', getAllEvents);
router.put('/', updateEvent);
router.post('/logs', getEventLogs);

export default router;

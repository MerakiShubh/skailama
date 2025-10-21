import express from 'express';
import { createEvent, getAllEvents, updateEvent, getEventLogs } from '../controllers/event.controllers.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/getAllEvents/:userId', getAllEvents);
router.put('/', updateEvent);
router.get('/logs/:eventId', getEventLogs);

export default router;

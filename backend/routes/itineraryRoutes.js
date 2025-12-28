import express from 'express';
import {
  createItinerary,
  getItinerary,
  getUserItineraries,
  exportPDF
} from '../controllers/itineraryController.js';

const router = express.Router();

router.post('/generate', createItinerary);
router.get('/:id', getItinerary);
router.get('/user/:userId', getUserItineraries);
router.post('/export-pdf', exportPDF);

export default router;



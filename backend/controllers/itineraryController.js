import Itinerary from '../models/Itinerary.js';
import User from '../models/User.js';
import { generateItinerary } from '../services/geminiService.js';
import { generatePDF } from '../services/pdfService.js';

export const createItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, preferences, userId } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: destination, startDate, endDate' 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid date format. Please use YYYY-MM-DD format.' 
      });
    }
    if (end < start) {
      return res.status(400).json({ 
        error: 'End date must be after start date.' 
      });
    }

    // Create or get user (handle MongoDB connection errors gracefully)
    let user;
    try {
      if (userId) {
        user = await User.findOne({ userId });
        if (!user) {
          user = await User.create({ userId, name: 'Guest User' });
        }
      } else {
        const newUserId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        user = await User.create({ userId: newUserId, name: 'Guest User' });
      }
    } catch (dbError) {
      // If MongoDB is not connected, create a temporary user object
      console.warn('MongoDB not connected, using temporary user:', dbError.message);
      user = {
        userId: userId || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        name: 'Guest User'
      };
    }

    // Generate itinerary using Gemini
    const itineraryData = await generateItinerary(
      destination,
      startDate,
      endDate,
      preferences || {}
    );

    // Save itinerary to database (handle MongoDB connection errors gracefully)
    let itinerary;
    try {
      itinerary = await Itinerary.create({
        userId: user.userId,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        preferences: preferences || {},
        itineraryData
      });
    } catch (dbError) {
      // If MongoDB is not connected, create itinerary object without saving
      console.warn('MongoDB not connected, returning itinerary without saving:', dbError.message);
      itinerary = {
        _id: `temp_${Date.now()}`,
        userId: user.userId,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        preferences: preferences || {},
        itineraryData,
        createdAt: new Date()
      };
    }

    res.status(201).json({
      success: true,
      itinerary,
      userId: user.userId
    });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    
    // Provide more specific error messages
    let errorMessage = error.message || 'Failed to create itinerary';
    if (error.message?.includes('API key')) {
      errorMessage = 'Gemini API key is missing or invalid. Please add GEMINI_API_KEY to your .env file.';
    }
    
    res.status(500).json({ 
      error: 'Failed to create itinerary', 
      message: errorMessage 
    });
  }
};

export const getItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findById(id);

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json({ success: true, itinerary });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ 
      error: 'Failed to fetch itinerary', 
      message: error.message 
    });
  }
};

export const getUserItineraries = async (req, res) => {
  try {
    const { userId } = req.params;
    const itineraries = await Itinerary.find({ userId })
      .sort({ createdAt: -1 })
      .select('-itineraryData.days.activities.location');

    res.json({ success: true, itineraries });
  } catch (error) {
    console.error('Error fetching user itineraries:', error);
    res.status(500).json({ 
      error: 'Failed to fetch itineraries', 
      message: error.message 
    });
  }
};

export const exportPDF = async (req, res) => {
  try {
    const { itineraryId } = req.body;

    if (!itineraryId) {
      return res.status(400).json({ error: 'itineraryId is required' });
    }

    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const pdfBuffer = await generatePDF(itinerary);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="itinerary-${itinerary.destination}-${itinerary._id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      message: error.message 
    });
  }
};


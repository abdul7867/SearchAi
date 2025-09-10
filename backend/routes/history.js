import express from 'express';
import { protect } from '../middleware/auth.js';
import Search from '../models/Search.js';

const router = express.Router();

// @desc    Get user's search history
// @route   GET /api/history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'createdAt' } = req.query;
    
    const searches = await Search.findByUser(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: -1 }
    });

    // Get total count for pagination
    const total = await Search.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        searches: searches.map(search => search.summary),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get history error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching history' }
    });
  }
});

// @desc    Get bookmarked searches
// @route   GET /api/history/bookmarked
// @access  Private
router.get('/bookmarked', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const searches = await Search.findBookmarked(req.user._id)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Search.countDocuments({ 
      userId: req.user._id, 
      isBookmarked: true 
    });

    res.json({
      success: true,
      data: {
        searches: searches.map(search => search.summary),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get bookmarked error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching bookmarked searches' }
    });
  }
});

// @desc    Clear search history
// @route   DELETE /api/history
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await Search.deleteMany({ userId: req.user._id });

    res.json({
      success: true,
      message: 'Search history cleared successfully'
    });

  } catch (error) {
    console.error('❌ Clear history error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while clearing history' }
    });
  }
});

export default router;

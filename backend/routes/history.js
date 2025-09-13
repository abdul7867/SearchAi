import express from 'express';
import { protect } from '../middleware/auth.js';
import Search from '../models/Search.js';

const router = express.Router();

// @desc    Get user's search history
// @route   GET /api/history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'createdAt', bookmarked } = req.query;
    
    const searches = await Search.findByUser(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: -1 },
      bookmarked: bookmarked === 'true'
    });

    // Get total count for pagination
    const total = await Search.countDocuments({ 
      userId: req.user._id,
      ...(bookmarked === 'true' && { isBookmarked: true })
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
    
    const searches = await Search.findByUser(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit),
      bookmarked: true
    });

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

// @desc    Clean up old search history (keep last 100 searches per user)
// @route   DELETE /api/history/cleanup
// @access  Private
router.delete('/cleanup', protect, async (req, res) => {
  try {
    // Find the 100th most recent search
    const hundredthSearch = await Search.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(100)
      .select('_id createdAt');

    if (!hundredthSearch) {
      return res.json({
        success: true,
        message: 'No cleanup needed - search history is within limits.',
        data: { deleted: 0 }
      });
    }

    // Delete searches older than the 100th search, excluding bookmarked items
    const deleteResult = await Search.deleteMany({
      userId: req.user._id,
      isBookmarked: false,
      createdAt: { $lt: hundredthSearch.createdAt }
    });

    res.json({
      success: true,
      message: `Cleaned up ${deleteResult.deletedCount} old search entries.`,
      data: {
        deleted: deleteResult.deletedCount
      }
    });

  } catch (error) {
    console.error('❌ History cleanup error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while cleaning up history' }
    });
  }
});

export default router;

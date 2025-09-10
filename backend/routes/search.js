import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Search from '../models/Search.js';
import searchService from '../services/searchService.js';

const router = express.Router();

// @desc    Perform conversational search
// @route   POST /api/search
// @access  Private
router.post('/', protect, [
  body('query')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Query must be between 1 and 500 characters'),
  body('focus')
    .optional()
    .isIn(['general', 'academic', 'news', 'technical'])
    .withMessage('Invalid focus value'),
  body('conversationId')
    .optional()
    .custom((value) => {
      // Allow null, undefined, or string values
      if (value === null || value === undefined || typeof value === 'string') {
        return true;
      }
      throw new Error('Conversation ID must be null, undefined, or a string');
    })
    .withMessage('Conversation ID must be null, undefined, or a string')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Search validation failed:', {
        body: req.body,
        errors: errors.array()
      });
      return res.status(400).json({
        success: false,
        error: { 
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { query, focus = 'general', conversationId } = req.body;
    const startTime = Date.now();

    // Always get DuckDuckGo results first (this is free and always works)
    let webResults;
    let searchResults;
    let aiAnswer;
    
    try {
      console.log('🔍 Getting DuckDuckGo search results...');
      webResults = await searchService.performWebSearch(query, focus);
      console.log(`✅ Found ${webResults.length} DuckDuckGo results`);
    } catch (webError) {
      console.log('⚠️ DuckDuckGo search failed:', webError.message);
      webResults = [];
    }
    
    // Try to generate AI response if Gemini is configured
    try {
      if (webResults.length > 0) {
        console.log('🤖 Generating AI response with Gemini...');
        const aiResponse = await searchService.generateAIResponse(query, webResults, focus);
        aiAnswer = aiResponse;
        searchResults = {
          answer: aiAnswer,
          sources: webResults,
          metadata: {
            processingTime: Date.now() - startTime,
            searchResultsCount: webResults.length,
            tokensUsed: Math.ceil(aiAnswer.length / 4)
          }
        };
        console.log('✅ AI-powered search completed successfully');
      } else {
        throw new Error('No web results to process');
      }
    } catch (error) {
      console.log('⚠️ Gemini AI failed, using DuckDuckGo results only:', error.message);
      
      // Use DuckDuckGo results with enhanced fallback answer
      searchResults = searchService.getEnhancedFallbackResponse(query, focus, webResults);
      aiAnswer = searchResults.answer;
      console.log('✅ Using enhanced fallback with real DuckDuckGo results');
    }

    const processingTime = Date.now() - startTime;

    // Create search record
    const search = await Search.create({
      userId: req.user._id,
      query,
      answer: aiAnswer,
      sources: searchResults.sources,
      focus,
      conversationId,
      metadata: {
        processingTime,
        tokensUsed: searchResults.metadata.tokensUsed,
        searchResultsCount: searchResults.metadata.searchResultsCount
      }
    });

    res.status(201).json({
      success: true,
      data: {
        search: {
          id: search._id,
          query: search.query,
          answer: search.answer,
          sources: search.sources,
          focus: search.focus,
          conversationId: search.conversationId,
          createdAt: search.createdAt,
          metadata: search.metadata
        }
      },
      message: 'Search completed successfully'
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error during search' }
    });
  }
});

// @desc    Get search by ID
// @route   GET /api/search/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const search = await Search.findById(req.params.id)
      .populate('userId', 'name email');

    if (!search) {
      return res.status(404).json({
        success: false,
        error: { message: 'Search not found' }
      });
    }

    // Check if user owns this search
    if (search.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to access this search' }
      });
    }

    res.json({
      success: true,
      data: {
        search: {
          id: search._id,
          query: search.query,
          answer: search.answer,
          sources: search.sources,
          focus: search.focus,
          conversationId: search.conversationId,
          createdAt: search.createdAt,
          updatedAt: search.updatedAt,
          metadata: search.metadata,
          isBookmarked: search.isBookmarked
        }
      }
    });

  } catch (error) {
    console.error('❌ Get search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching search' }
    });
  }
});

// @desc    Toggle bookmark for search
// @route   PUT /api/search/:id/bookmark
// @access  Private
router.put('/:id/bookmark', protect, async (req, res) => {
  try {
    const search = await Search.findById(req.params.id);

    if (!search) {
      return res.status(404).json({
        success: false,
        error: { message: 'Search not found' }
      });
    }

    // Check if user owns this search
    if (search.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to modify this search' }
      });
    }

    // Toggle bookmark
    await search.toggleBookmark();

    res.json({
      success: true,
      data: {
        isBookmarked: search.isBookmarked
      },
      message: `Search ${search.isBookmarked ? 'bookmarked' : 'unbookmarked'} successfully`
    });

  } catch (error) {
    console.error('❌ Bookmark toggle error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while toggling bookmark' }
    });
  }
});

// @desc    Delete search
// @route   DELETE /api/search/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const search = await Search.findById(req.params.id);

    if (!search) {
      return res.status(404).json({
        success: false,
        error: { message: 'Search not found' }
      });
    }

    // Check if user owns this search
    if (search.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to delete this search' }
      });
    }

    await Search.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Search deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while deleting search' }
    });
  }
});

export default router;

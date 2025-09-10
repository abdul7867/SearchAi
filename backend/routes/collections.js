import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Collection from '../models/Collection.js';
import Search from '../models/Search.js';

const router = express.Router();

// @desc    Get user's collections
// @route   GET /api/collections
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const collections = await Collection.findByUser(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    const total = await Collection.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        collections: collections.map(collection => collection.summary),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get collections error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching collections' }
    });
  }
});

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private
router.post('/', protect, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Collection name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { 
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { name, description, tags = [], color = '#3B82F6' } = req.body;

    // Check if collection name already exists for this user
    const existingCollection = await Collection.findOne({
      userId: req.user._id,
      name: name
    });

    if (existingCollection) {
      return res.status(409).json({
        success: false,
        error: { message: 'Collection with this name already exists' }
      });
    }

    const collection = await Collection.create({
      userId: req.user._id,
      name,
      description,
      tags,
      color
    });

    res.status(201).json({
      success: true,
      data: {
        collection: collection.summary
      },
      message: 'Collection created successfully'
    });

  } catch (error) {
    console.error('❌ Create collection error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while creating collection' }
    });
  }
});

// @desc    Get collection by ID with searches
// @route   GET /api/collections/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('searches');

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: { message: 'Collection not found' }
      });
    }

    // Check if user owns this collection
    if (collection.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to access this collection' }
      });
    }

    res.json({
      success: true,
      data: {
        collection: {
          ...collection.summary,
          searches: collection.searches.map(search => search.summary)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get collection error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while fetching collection' }
    });
  }
});

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
router.put('/:id', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Collection name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { 
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: { message: 'Collection not found' }
      });
    }

    // Check if user owns this collection
    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to modify this collection' }
      });
    }

    const { name, description, tags, color } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (tags) updateFields.tags = tags;
    if (color) updateFields.color = color;

    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        collection: updatedCollection.summary
      },
      message: 'Collection updated successfully'
    });

  } catch (error) {
    console.error('❌ Update collection error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while updating collection' }
    });
  }
});

// @desc    Add search to collection
// @route   POST /api/collections/:id/searches
// @access  Private
router.post('/:id/searches', protect, [
  body('searchId')
    .notEmpty()
    .withMessage('Search ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { 
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { searchId } = req.body;

    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: { message: 'Collection not found' }
      });
    }

    // Check if user owns this collection
    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to modify this collection' }
      });
    }

    // Check if search exists and belongs to user
    const search = await Search.findById(searchId);
    if (!search) {
      return res.status(404).json({
        success: false,
        error: { message: 'Search not found' }
      });
    }

    if (search.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to add this search to collection' }
      });
    }

    // Add search to collection
    await collection.addSearch(searchId);

    res.json({
      success: true,
      message: 'Search added to collection successfully'
    });

  } catch (error) {
    console.error('❌ Add search to collection error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while adding search to collection' }
    });
  }
});

// @desc    Remove search from collection
// @route   DELETE /api/collections/:id/searches/:searchId
// @access  Private
router.delete('/:id/searches/:searchId', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: { message: 'Collection not found' }
      });
    }

    // Check if user owns this collection
    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to modify this collection' }
      });
    }

    // Remove search from collection
    await collection.removeSearch(req.params.searchId);

    res.json({
      success: true,
      message: 'Search removed from collection successfully'
    });

  } catch (error) {
    console.error('❌ Remove search from collection error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while removing search from collection' }
    });
  }
});

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: { message: 'Collection not found' }
      });
    }

    // Check if user owns this collection
    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to delete this collection' }
      });
    }

    await Collection.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete collection error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error while deleting collection' }
    });
  }
});

export default router;

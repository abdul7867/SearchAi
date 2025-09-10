import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    maxlength: [100, 'Collection name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  searches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Search'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  metadata: {
    totalSearches: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for collection summary
collectionSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    searchesCount: this.searches.length,
    tags: this.tags,
    isPublic: this.isPublic,
    color: this.color,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    metadata: {
      totalSearches: this.metadata.totalSearches,
      lastUpdated: this.metadata.lastUpdated
    }
  };
});

// Virtual for collection with populated searches
collectionSchema.virtual('searchesWithDetails', {
  ref: 'Search',
  localField: 'searches',
  foreignField: '_id'
});

// Method to add search to collection
collectionSchema.methods.addSearch = function(searchId) {
  if (!this.searches.includes(searchId)) {
    this.searches.push(searchId);
    this.metadata.totalSearches = this.searches.length;
    this.metadata.lastUpdated = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove search from collection
collectionSchema.methods.removeSearch = function(searchId) {
  this.searches = this.searches.filter(id => id.toString() !== searchId.toString());
  this.metadata.totalSearches = this.searches.length;
  this.metadata.lastUpdated = new Date();
  return this.save();
};

// Method to add tag
collectionSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove tag
collectionSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

// Method to toggle public status
collectionSchema.methods.togglePublic = function() {
  this.isPublic = !this.isPublic;
  return this.save();
};

// Static method to find collections by user
collectionSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, sort = { updatedAt: -1 } } = options;
  
  return this.find({ userId })
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('userId', 'name email');
};

// Static method to find public collections
collectionSchema.statics.findPublic = function(options = {}) {
  const { page = 1, limit = 10, sort = { updatedAt: -1 } } = options;
  
  return this.find({ isPublic: true })
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('userId', 'name');
};

// Static method to find collections by tag
collectionSchema.statics.findByTag = function(tag, options = {}) {
  const { page = 1, limit = 10, sort = { updatedAt: -1 } } = options;
  
  return this.find({ 
    tags: { $in: [tag] },
    $or: [{ isPublic: true }, { userId: options.userId }]
  })
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('userId', 'name');
};

// Pre-save middleware to update metadata
collectionSchema.pre('save', function(next) {
  if (this.isModified('searches')) {
    this.metadata.totalSearches = this.searches.length;
    this.metadata.lastUpdated = new Date();
  }
  next();
});

// Indexes for better query performance
collectionSchema.index({ userId: 1, updatedAt: -1 });
collectionSchema.index({ isPublic: 1, updatedAt: -1 });
collectionSchema.index({ tags: 1 });
collectionSchema.index({ name: 'text', description: 'text' }); // Text search index

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;

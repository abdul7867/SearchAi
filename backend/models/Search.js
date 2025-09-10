import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  query: {
    type: String,
    required: [true, 'Search query is required'],
    trim: true,
    maxlength: [500, 'Query cannot exceed 500 characters']
  },
  answer: {
    type: String,
    required: [true, 'AI-generated answer is required'],
    maxlength: [10000, 'Answer cannot exceed 10000 characters']
  },
  sources: [{
    title: {
      type: String,
      required: [true, 'Source title is required'],
      trim: true,
      maxlength: [200, 'Source title cannot exceed 200 characters']
    },
    url: {
      type: String,
      required: [true, 'Source URL is required'],
      trim: true,
      maxlength: [500, 'Source URL cannot exceed 500 characters']
    },
    snippet: {
      type: String,
      trim: true,
      maxlength: [500, 'Source snippet cannot exceed 500 characters']
    },
    domain: {
      type: String,
      trim: true,
      maxlength: [100, 'Domain cannot exceed 100 characters']
    }
  }],
  focus: {
    type: String,
    enum: ['general', 'academic', 'news', 'technical'],
    default: 'general'
  },
  conversationId: {
    type: String,
    trim: true,
    maxlength: [100, 'Conversation ID cannot exceed 100 characters']
  },
  metadata: {
    processingTime: {
      type: Number, // in milliseconds
      default: 0
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    searchResultsCount: {
      type: Number,
      default: 0
    }
  },
  isBookmarked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for search summary (excluding long answer text)
searchSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    query: this.query,
    answerPreview: this.answer.substring(0, 200) + (this.answer.length > 200 ? '...' : ''),
    sourcesCount: this.sources.length,
    sources: this.sources.map(source => ({
      title: source.title,
      url: source.url,
      snippet: source.snippet,
      domain: source.domain
    })),
    focus: this.focus,
    focusLabel: this.focus.charAt(0).toUpperCase() + this.focus.slice(1),
    createdAt: this.createdAt,
    isBookmarked: this.isBookmarked,
    metadata: {
      processingTime: this.metadata.processingTime,
      tokensUsed: this.metadata.tokensUsed,
      searchResultsCount: this.metadata.searchResultsCount
    }
  };
});

// Method to add source
searchSchema.methods.addSource = function(source) {
  this.sources.push(source);
  return this.save();
};

// Method to remove source
searchSchema.methods.removeSource = function(sourceId) {
  this.sources = this.sources.filter(source => source._id.toString() !== sourceId);
  return this.save();
};

// Method to toggle bookmark
searchSchema.methods.toggleBookmark = function() {
  this.isBookmarked = !this.isBookmarked;
  return this.save();
};

// Static method to find searches by user
searchSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  
  return this.find({ userId })
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('userId', 'name email');
};

// Static method to find searches by conversation
searchSchema.statics.findByConversation = function(conversationId) {
  return this.find({ conversationId }).sort({ createdAt: 1 });
};

// Static method to find bookmarked searches
searchSchema.statics.findBookmarked = function(userId) {
  return this.find({ userId, isBookmarked: true }).sort({ createdAt: -1 });
};

// Indexes for better query performance
searchSchema.index({ userId: 1, createdAt: -1 });
searchSchema.index({ conversationId: 1 });
searchSchema.index({ focus: 1 });
searchSchema.index({ isBookmarked: 1 });
searchSchema.index({ query: 'text' }); // Text search index

const Search = mongoose.model('Search', searchSchema);

export default Search;

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
  const answer = this.answer || '';
  return {
    id: this._id,
    query: this.query,
    answerPreview: answer.substring(0, 200) + (answer.length > 200 ? '...' : ''),
    url: `/search?q=${encodeURIComponent(this.query)}&focus=${this.focus}`,
    sourcesCount: this.sources.length,
    focus: this.focus,
    createdAt: this.createdAt,
    isBookmarked: this.isBookmarked
  };
});

// Method to toggle bookmark
searchSchema.methods.toggleBookmark = function() {
  this.isBookmarked = !this.isBookmarked;
  return this.save();
};

// Static method to find searches by user
searchSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, sort = { createdAt: -1 }, bookmarked } = options;
  
  const query = { userId };
  if (bookmarked) {
    query.isBookmarked = true;
  }

  return this.find(query)
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit)
    .select('query answer sources focus isBookmarked createdAt'); // Select specific fields
};

// Indexes for better query performance
searchSchema.index({ userId: 1, createdAt: -1 });
searchSchema.index({ userId: 1, isBookmarked: 1, createdAt: -1 }); // For bookmarked searches
searchSchema.index({ conversationId: 1 });
searchSchema.index({ focus: 1 });
searchSchema.index({ query: 'text' }); // Text search index

const Search = mongoose.model('Search', searchSchema);

export default Search;

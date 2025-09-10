import AICard from './AICard';

export default {
  title: 'Components/AICard',
  component: AICard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying AI-generated answers with metadata and bookmark functionality.'
      }
    }
  },
  argTypes: {
    answer: {
      control: 'text',
      description: 'The AI-generated answer text'
    },
    metadata: {
      control: 'object',
      description: 'Metadata object containing processing time, source count, etc.'
    },
    focus: {
      control: 'select',
      options: ['general', 'academic', 'news', 'technical'],
      description: 'The search focus mode'
    },
    isBookmarked: {
      control: 'boolean',
      description: 'Whether the search result is bookmarked'
    },
    onBookmark: {
      action: 'bookmarked',
      description: 'Callback function when bookmark button is clicked'
    },
    searchId: {
      control: 'text',
      description: 'Unique identifier for the search result'
    }
  }
};

// Default state
export const Default = {
  args: {
    answer: 'The AI-powered search engine provides comprehensive answers by analyzing multiple sources and synthesizing information into coherent responses. It uses advanced natural language processing to understand context and deliver relevant results.',
    metadata: {
      processingTime: 1250,
      searchResultsCount: 8,
      timestamp: new Date().toISOString()
    },
    focus: 'general',
    isBookmarked: false,
    searchId: 'search-123'
  }
};

// Bookmarked state
export const Bookmarked = {
  args: {
    ...Default.args,
    isBookmarked: true
  }
};

// Academic focus
export const AcademicFocus = {
  args: {
    ...Default.args,
    focus: 'academic',
    answer: 'Based on recent research in cognitive science, the effectiveness of AI-powered search engines stems from their ability to process and synthesize information from multiple academic sources. Studies have shown that users prefer synthesized answers over raw search results, particularly in academic contexts where information synthesis is crucial.',
    metadata: {
      processingTime: 2100,
      searchResultsCount: 12,
      timestamp: new Date().toISOString()
    }
  }
};

// News focus
export const NewsFocus = {
  args: {
    ...Default.args,
    focus: 'news',
    answer: 'Recent developments in AI search technology have shown significant improvements in real-time information processing. The latest updates include enhanced source verification and faster response times, making it easier for users to access current and accurate information.',
    metadata: {
      processingTime: 890,
      searchResultsCount: 5,
      timestamp: new Date().toISOString()
    }
  }
};

// Technical focus
export const TechnicalFocus = {
  args: {
    ...Default.args,
    focus: 'technical',
    answer: 'The technical architecture of this AI search engine utilizes a microservices-based approach with containerized deployment. It implements RESTful APIs for search queries, uses Redis for caching, and employs Elasticsearch for full-text search capabilities. The system is designed for horizontal scalability and high availability.',
    metadata: {
      processingTime: 1560,
      searchResultsCount: 15,
      timestamp: new Date().toISOString()
    }
  }
};

// Long answer
export const LongAnswer = {
  args: {
    ...Default.args,
    answer: `The AI-powered search engine represents a significant advancement in information retrieval technology. By leveraging machine learning algorithms and natural language processing, it can understand the context and intent behind user queries, providing more relevant and comprehensive answers than traditional keyword-based search engines.

The system works by analyzing multiple sources simultaneously, cross-referencing information, and synthesizing the most relevant details into coherent responses. This approach ensures that users receive well-rounded answers that consider multiple perspectives and sources of information.

Key features include:
• Intelligent query understanding
• Multi-source analysis and synthesis
• Real-time information processing
• Source verification and credibility assessment
• Personalized results based on user preferences and search history

The technology behind this system combines several cutting-edge approaches in artificial intelligence, including transformer models for language understanding, graph neural networks for knowledge representation, and reinforcement learning for continuous improvement of search quality.`
  }
};

// Minimal metadata
export const MinimalMetadata = {
  args: {
    ...Default.args,
    metadata: {
      processingTime: 450
    }
  }
};

// No bookmark functionality
export const NoBookmark = {
  args: {
    ...Default.args,
    onBookmark: null
  }
};

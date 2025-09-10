import SourceCard from './SourceCard';

export default {
  title: 'Components/SourceCard',
  component: SourceCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying individual search source results with metadata and external link functionality.'
      }
    }
  },
  argTypes: {
    source: {
      control: 'object',
      description: 'Source object containing title, url, snippet, domain, date, and sourceType'
    },
    showDomain: {
      control: 'boolean',
      description: 'Whether to show the domain badge'
    },
    showDate: {
      control: 'boolean',
      description: 'Whether to show the date'
    },
    showSnippet: {
      control: 'boolean',
      description: 'Whether to show the snippet text'
    },
    compact: {
      control: 'boolean',
      description: 'Whether to use compact layout with smaller spacing'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
};

// Default web source
export const Default = {
  args: {
    source: {
      title: 'Understanding AI-Powered Search: A Comprehensive Guide',
      url: 'https://example.com/ai-search-guide',
      snippet: 'This comprehensive guide explores the fundamentals of AI-powered search engines, including their architecture, benefits, and implementation strategies. Learn how machine learning algorithms enhance search relevance and user experience.',
      domain: 'example.com',
      date: '2024-01-15T10:30:00.000Z',
      sourceType: 'web'
    },
    showDomain: true,
    showDate: true,
    showSnippet: true,
    compact: false
  }
};

// News source
export const NewsSource = {
  args: {
    source: {
      title: 'Breaking: New AI Search Technology Revolutionizes Information Discovery',
      url: 'https://news.example.com/ai-search-breakthrough',
      snippet: 'Researchers have developed a groundbreaking AI search algorithm that can understand context and provide more relevant results than ever before. The technology is expected to transform how we find information online.',
      domain: 'news.example.com',
      date: '2024-01-20T14:15:00.000Z',
      sourceType: 'news'
    }
  }
};

// PDF source
export const PDFSource = {
  args: {
    source: {
      title: 'Technical Implementation Guide for AI Search Systems',
      url: 'https://docs.example.com/ai-search-implementation.pdf',
      snippet: 'This technical document provides detailed implementation guidelines for building AI-powered search systems, including architecture diagrams, code examples, and best practices for deployment.',
      domain: 'docs.example.com',
      date: '2024-01-10T09:00:00.000Z',
      sourceType: 'pdf'
    }
  }
};

// Academic source
export const AcademicSource = {
  args: {
    source: {
      title: 'Machine Learning Approaches in Information Retrieval: A Systematic Review',
      url: 'https://academic.example.com/ml-information-retrieval',
      snippet: 'This systematic review examines the application of machine learning techniques in information retrieval systems, analyzing 150+ research papers and identifying key trends and future research directions.',
      domain: 'academic.example.com',
      date: '2023-12-01T00:00:00.000Z',
      sourceType: 'web'
    }
  }
};

// Compact layout
export const Compact = {
  args: {
    source: {
      title: 'Quick Reference: AI Search Best Practices',
      url: 'https://quick.example.com/ai-search-best-practices',
      snippet: 'Essential best practices for implementing AI-powered search functionality in web applications.',
      domain: 'quick.example.com',
      date: '2024-01-18T16:45:00.000Z',
      sourceType: 'web'
    },
    compact: true
  }
};

// No snippet
export const NoSnippet = {
  args: {
    source: {
      title: 'AI Search API Documentation',
      url: 'https://api.example.com/ai-search-docs',
      domain: 'api.example.com',
      date: '2024-01-12T11:20:00.000Z',
      sourceType: 'web'
    },
    showSnippet: false
  }
};

// No date
export const NoDate = {
  args: {
    source: {
      title: 'AI Search Implementation Examples',
      url: 'https://examples.example.com/ai-search',
      snippet: 'Practical examples and code samples for implementing AI-powered search in various programming languages and frameworks.',
      domain: 'examples.example.com',
      sourceType: 'web'
    },
    showDate: false
  }
};

// No domain
export const NoDomain = {
  args: {
    source: {
      title: 'AI Search Performance Metrics',
      url: 'https://metrics.example.com/ai-search-performance',
      snippet: 'Key performance indicators and metrics for evaluating the effectiveness of AI-powered search systems.',
      date: '2024-01-16T13:30:00.000Z',
      sourceType: 'web'
    },
    showDomain: false
  }
};

// Long title and snippet
export const LongContent = {
  args: {
    source: {
      title: 'Advanced Natural Language Processing Techniques for Enhancing Search Relevance: A Deep Dive into Transformer Models, BERT Architecture, and Contextual Understanding in Modern Information Retrieval Systems',
      url: 'https://advanced.example.com/nlp-search-techniques',
      snippet: 'This comprehensive exploration delves into the cutting-edge natural language processing techniques that are revolutionizing search relevance. We examine the evolution from traditional keyword-based approaches to sophisticated transformer models like BERT, GPT, and their variants. The document covers architectural decisions, training methodologies, and practical implementation strategies for integrating these advanced NLP capabilities into production search systems. Special attention is given to contextual understanding, semantic similarity, and the challenges of maintaining performance while improving accuracy.',
      domain: 'advanced.example.com',
      date: '2024-01-14T15:20:00.000Z',
      sourceType: 'web'
    }
  }
};

// Multiple sources in a list
export const MultipleSources = {
  render: () => (
    <div className="space-y-3 max-w-2xl">
      <SourceCard
        source={{
          title: 'AI Search Fundamentals',
          url: 'https://fundamentals.example.com',
          snippet: 'Core concepts and principles of AI-powered search systems.',
          domain: 'fundamentals.example.com',
          date: '2024-01-15T10:00:00.000Z',
          sourceType: 'web'
        }}
      />
      <SourceCard
        source={{
          title: 'Advanced AI Search Techniques',
          url: 'https://advanced.example.com',
          snippet: 'Sophisticated approaches for optimizing AI search performance.',
          domain: 'advanced.example.com',
          date: '2024-01-16T11:00:00.000Z',
          sourceType: 'web'
        }}
      />
      <SourceCard
        source={{
          title: 'AI Search Case Studies',
          url: 'https://cases.example.com',
          snippet: 'Real-world examples of successful AI search implementations.',
          domain: 'cases.example.com',
          date: '2024-01-17T12:00:00.000Z',
          sourceType: 'web'
        }}
      />
    </div>
  )
};

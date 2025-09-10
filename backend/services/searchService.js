import axios from 'axios';
import * as cheerio from 'cheerio';

class SearchService {
  constructor() {
    // DuckDuckGo doesn't require API key - it's completely free!
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    // DuckDuckGo Instant Answer API endpoint
    this.searchEndpoint = 'https://api.duckduckgo.com/';
    this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  /**
   * Perform web search using DuckDuckGo API
   */
  async performWebSearch(query, focus = 'general') {
    try {
      // DuckDuckGo doesn't require API key - it's completely free!
      
      // Adjust search parameters based on focus
      let searchQuery = query;

      // Add academic focus if specified
      if (focus === 'academic') {
        searchQuery += ' site:edu OR site:ac.uk OR site:ac.za OR site:ac.in';
      } else if (focus === 'news') {
        searchQuery += ' site:news.yahoo.com OR site:reuters.com OR site:bbc.com OR site:cnn.com';
      } else if (focus === 'technical') {
        searchQuery += ' site:stackoverflow.com OR site:github.com OR site:docs.microsoft.com';
      }

      // Try DuckDuckGo Instant Answer API first
      try {
        console.log('🔍 Trying DuckDuckGo Instant Answer API...');
        const response = await axios.get(this.searchEndpoint, {
          params: {
            q: searchQuery,
            format: 'json',
            no_html: '1',
            skip_disambig: '1',
            t: 'youtube-clone-app',
            appid: 'youtube-clone',
            no_redirect: '1'
          }
        });

        const results = this.processDuckDuckGoResults(response.data, query);
        
        // If we got good results, return them
        if (results.length > 1 || (results.length === 1 && results[0].type !== 'fallback')) {
          console.log('✅ DuckDuckGo Instant Answer API returned good results');
          return results;
        }
      } catch (instantError) {
        console.log('⚠️ DuckDuckGo Instant Answer API failed, trying alternative method...');
      }

      // Fallback: Use DuckDuckGo web search to get referral links
      console.log('🔍 Using DuckDuckGo web search fallback...');
      return this.getWebSearchFallback(query, focus);
      
    } catch (error) {
      console.error('❌ DuckDuckGo search error:', error.message);
      throw new Error('Failed to perform web search');
    }
  }

  /**
   * Process DuckDuckGo search results
   */
  processDuckDuckGoResults(data, originalQuery) {
    const results = [];
    
    console.log('🔍 Processing DuckDuckGo results:', {
      hasAbstract: !!data.Abstract,
      hasRelatedTopics: !!(data.RelatedTopics && data.RelatedTopics.length),
      hasResults: !!(data.Results && data.Results.length),
      hasAnswer: !!data.Answer,
      hasDefinition: !!data.Definition
    });
    
    // Process Abstract (instant answer) if available
    if (data.Abstract && data.AbstractText) {
      results.push({
        title: data.Heading || data.AbstractSource || 'DuckDuckGo Instant Answer',
        url: data.AbstractURL || '#',
        snippet: this.truncateSnippet(data.AbstractText, 450), // Truncate to fit DB limit
        domain: this.extractDomain(data.AbstractURL || ''),
        type: 'instant_answer'
      });
    }

    // Process Answer if available
    if (data.Answer && data.AnswerText) {
      results.push({
        title: data.Answer || 'DuckDuckGo Answer',
        url: data.AnswerURL || '#',
        snippet: this.truncateSnippet(data.AnswerText, 450),
        domain: this.extractDomain(data.AnswerURL || ''),
        type: 'answer'
      });
    }

    // Process Definition if available
    if (data.Definition && data.DefinitionText) {
      results.push({
        title: data.Definition || 'DuckDuckGo Definition',
        url: data.DefinitionURL || '#',
        snippet: this.truncateSnippet(data.DefinitionText, 450),
        domain: this.extractDomain(data.DefinitionURL || ''),
        type: 'definition'
      });
    }

    // Process Related Topics (limit to 3 to avoid overwhelming)
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.slice(0, 3).forEach(topic => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || topic.Text,
            url: topic.FirstURL,
            snippet: this.truncateSnippet(topic.Text, 450),
            domain: this.extractDomain(topic.FirstURL),
            type: 'related_topic'
          });
        }
      });
    }

        // Process Results array if available (limit to 5)
    if (data.Results && data.Results.length > 0) {
      data.Results.slice(0, 5).forEach(item => {
        if (item.Title && item.FirstURL) {
        results.push({
            title: item.Title,
            url: item.FirstURL,
            snippet: this.truncateSnippet(item.Text || item.Title, 450),
            domain: this.extractDomain(item.FirstURL),
            type: 'web_result'
          });
        }
      });
    }

    // If no results from DuckDuckGo, provide fallback
    if (results.length === 0) {
      results.push({
        title: `Search results for: ${originalQuery}`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(originalQuery)}`,
        snippet: `No instant answer available. Click to view full search results on DuckDuckGo.`,
        domain: 'duckduckgo.com',
        type: 'fallback'
      });
    }

    console.log(`✅ Processed ${results.length} results from DuckDuckGo`);
    return results;
  }

  /**
   * Extract domain from URL
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'unknown';
    }
  }

  /**
   * Truncate snippet text to fit database limits
   */
  truncateSnippet(text, maxLength = 450) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    // Truncate at word boundary to avoid cutting words
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.8) { // If we can find a good word boundary
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  }

  /**
   * Generate AI response using Gemini
   */
  async generateAIResponse(query, searchResults, focus = 'general') {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your .env file');
      }
      
      if (this.geminiApiKey === 'your-actual-gemini-api-key-here' || this.geminiApiKey.includes('your-')) {
        throw new Error('Please replace the placeholder API key with your actual Gemini API key in the .env file');
      }

      // Prepare context for Gemini
      const context = this.prepareGeminiContext(query, searchResults, focus);
      
      console.log('🔑 Gemini API Key:', this.geminiApiKey ? 'Present' : 'Missing');
      console.log('🌐 Gemini Endpoint:', this.geminiEndpoint);
      console.log('📝 Context length:', context.length);
      
      const requestBody = {
        contents: [{
          parts: [{
            text: context
          }]
        }]
      };
      
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await axios.post(
        `${this.geminiEndpoint}?key=${this.geminiApiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return this.processGeminiResponse(response.data);
    } catch (error) {
      console.error('❌ Gemini API error:', error.message);
      
      if (error.response) {
        console.error('📊 Error response status:', error.response.status);
        console.error('📊 Error response data:', error.response.data);
        console.error('📊 Error response headers:', error.response.headers);
      }
      
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Prepare context for Gemini AI
   */
  prepareGeminiContext(query, searchResults, focus) {
    let context = `You are an AI assistant helping with a search query. Please provide a comprehensive, well-structured answer based on the search results provided.

Query: "${query}"
Focus: ${focus}

Search Results:
${searchResults.map((result, index) => 
  `${index + 1}. ${result.title}
   URL: ${result.url}
   Snippet: ${result.snippet}`
).join('\n\n')}

Instructions:
1. Provide a clear, comprehensive answer to the query
2. Use information from the search results
3. Structure your response with paragraphs and bullet points where appropriate
4. If the focus is "academic", use more formal language and cite sources
5. If the focus is "news", emphasize current information and timeliness
6. If the focus is "technical", include technical details and code examples if relevant
7. Keep your response under 1000 words
8. Always acknowledge the sources you used

Please provide your response:`;

    return context;
  }

  /**
   * Process Gemini API response
   */
  processGeminiResponse(data) {
    try {
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('❌ Gemini response processing error:', error);
      throw new Error('Failed to process AI response');
    }
  }

  /**
   * Perform complete conversational search
   */
  async performConversationalSearch(query, focus = 'general') {
    const startTime = Date.now();
    
    try {
      // Step 1: Perform web search
      console.log('🔍 Performing web search...');
      const searchResults = await this.performWebSearch(query, focus);
      
      if (searchResults.length === 0) {
        throw new Error('No search results found');
      }

      // Step 2: Generate AI response
      console.log('🤖 Generating AI response...');
      const aiResponse = await this.generateAIResponse(query, searchResults, focus);
      
      const processingTime = Date.now() - startTime;

      return {
        answer: aiResponse,
        sources: searchResults,
        metadata: {
          processingTime,
          searchResultsCount: searchResults.length,
          tokensUsed: Math.ceil(aiResponse.length / 4) // Rough estimate
        }
      };
    } catch (error) {
      console.error('❌ Conversational search error:', error);
      throw error;
    }
  }

  /**
   * Enhanced fallback response that always shows real DuckDuckGo results
   */
  getEnhancedFallbackResponse(query, focus, webResults) {
    // If we have real web results, use them; otherwise provide fallback
    const sources = webResults && webResults.length > 0 ? webResults : [
      {
        title: `Search Results for: ${query}`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        snippet: `View all search results on DuckDuckGo for "${query}"`,
        domain: 'duckduckgo.com',
        type: 'search_results'
      }
    ];

    return {
      answer: `Here's what I found about "${query}" based on web search results:

🔍 **Search Results Summary:**
I've gathered information from ${sources.length} web sources to answer your question. Below you'll find relevant websites, articles, and resources that should help you understand this topic better.

📚 **What You Can Do:**
1. **Click on any source below** - Each link will take you to the original content
2. **Explore related topics** - The search results include additional context and related information
3. **Get more specific** - Try refining your search with additional keywords for better results

💡 **Note:** These are real search results from DuckDuckGo. For AI-generated summaries and analysis, please ensure your Gemini API key is properly configured in your environment variables.

**Focus Mode:** ${focus} (${this.getFocusDescription(focus)})

**Found ${sources.length} relevant sources:**`,
      sources: sources,
      metadata: {
        processingTime: 150,
        searchResultsCount: sources.length,
        tokensUsed: 0
      }
    };
  }

  /**
   * Fallback response when APIs are not available (legacy method)
   */
  getFallbackResponse(query, focus) {
    return this.getEnhancedFallbackResponse(query, focus, []);
  }

  /**
   * Web search fallback method to get referral links
   */
  async getWebSearchFallback(query, focus) {
    try {
      // First, try to find more specific content
      const specificLinks = await this.findSpecificContent(query, focus);
      
      if (specificLinks.length > 0) {
        console.log(`✅ Found ${specificLinks.length} specific content links`);
        return specificLinks;
      }
      
      // Fallback to curated referral links
      const referralLinks = this.generateCuratedReferralLinks(query, focus);
      console.log(`✅ Generated ${referralLinks.length} curated referral links`);
      return referralLinks;
      
    } catch (error) {
      console.error('❌ Web search fallback error:', error.message);
      // Return basic fallback
      return [{
        title: `Search results for: ${query}`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        snippet: `View all search results on DuckDuckGo for "${query}"`,
        domain: 'duckduckgo.com',
        type: 'fallback'
      }];
    }
  }

  /**
   * Try to find specific content before falling back to curated links
   */
  async findSpecificContent(query, focus) {
    try {
      const links = [];
      
      // Try to find specific content based on focus
      if (focus === 'technical') {
        // For technical queries, try to find specific Stack Overflow questions
        const stackOverflowLink = this.findStackOverflowQuestion(query);
        if (stackOverflowLink) {
          links.push(stackOverflowLink);
        }
        
        // Try to find specific GitHub repositories
        const githubLink = this.findGitHubRepository(query);
        if (githubLink) {
          links.push(githubLink);
        }
        
        // Try to find specific MDN documentation
        const mdnLink = this.findMDNDocumentation(query);
        if (mdnLink) {
          links.push(mdnLink);
        }
      } else if (focus === 'academic') {
        // For academic queries, try to find specific research papers
        const arxivLink = this.findArxivPaper(query);
        if (arxivLink) {
          links.push(arxivLink);
        }
      } else if (focus === 'general') {
        // For general queries, try to find specific Wikipedia articles
        const wikiLink = this.findWikipediaArticle(query);
        if (wikiLink) {
          links.push(wikiLink);
        }
        
        // Try to find specific YouTube videos
        const youtubeLink = this.findYouTubeVideo(query);
        if (youtubeLink) {
          links.push(youtubeLink);
        }
      }
      
      // Always include DuckDuckGo as primary source
      if (links.length > 0) {
        links.unshift({
          title: `DuckDuckGo: ${query}`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          snippet: `View comprehensive search results for "${query}"`,
          domain: 'duckduckgo.com',
          type: 'primary_search'
        });
      }
      
      return links;
    } catch (error) {
      console.error('❌ Error finding specific content:', error.message);
      return [];
    }
  }

  /**
   * Generate curated referral links based on query and focus
   */
  generateCuratedReferralLinks(query, focus) {
    const links = [];
    
    // Always include DuckDuckGo search results as primary source
    links.push({
      title: `DuckDuckGo: ${query}`,
      url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      snippet: `View comprehensive search results for "${query}"`,
      domain: 'duckduckgo.com',
      type: 'primary_search'
    });

    // Add 2-3 specific, direct referral links based on focus
    if (focus === 'academic') {
      links.push(
        {
          title: `Research Paper: ${query}`,
          url: `https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all&source=header`,
          snippet: `Latest academic research papers and preprints about "${query}"`,
          domain: 'arxiv.org',
          type: 'academic_paper'
        },
        {
          title: `Academic Discussion: ${query}`,
          url: `https://www.researchgate.net/search/publication?q=${encodeURIComponent(query)}`,
          snippet: `Research publications and academic discussions about "${query}"`,
          domain: 'researchgate.net',
          type: 'academic_discussion'
        }
      );
    } else if (focus === 'news') {
      links.push(
        {
          title: `Latest News: ${query}`,
          url: `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`,
          snippet: `Most recent news articles about "${query}"`,
          domain: 'news.google.com',
          type: 'latest_news'
        },
        {
          title: `Professional Coverage: ${query}`,
          url: `https://www.reuters.com/search/news?blob=${encodeURIComponent(query)}`,
          snippet: `Professional news coverage and analysis about "${query}"`,
          domain: 'reuters.com',
          type: 'professional_news'
        }
      );
    } else if (focus === 'technical') {
      links.push(
        {
          title: `Code Examples: ${query}`,
          url: `https://stackoverflow.com/questions/tagged/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
          snippet: `Practical code examples and solutions for "${query}"`,
          domain: 'stackoverflow.com',
          type: 'code_examples'
        },
        {
          title: `Documentation: ${query}`,
          url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)}`,
          snippet: `Official web development documentation for "${query}"`,
          domain: 'developer.mozilla.org',
          type: 'official_docs'
        }
      );
    } else {
      // General focus - provide specific, useful resources
      links.push(
        {
          title: `Comprehensive Guide: ${query}`,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
          snippet: `In-depth information and comprehensive guide about "${query}"`,
          domain: 'wikipedia.org',
          type: 'comprehensive_guide'
        },
        {
          title: `Video Tutorials: ${query}`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' tutorial')}`,
          snippet: `Video tutorials and educational content about "${query}"`,
          domain: 'youtube.com',
          type: 'video_tutorials'
        }
      );
    }

    return links;
  }

  /**
   * Find specific Stack Overflow question
   */
  findStackOverflowQuestion(query) {
    // Convert query to common programming terms for better Stack Overflow results
    const programmingTerms = this.getProgrammingTerms(query);
    
    if (programmingTerms.length > 0) {
      return {
        title: `Stack Overflow: ${programmingTerms[0]}`,
        url: `https://stackoverflow.com/questions/tagged/${encodeURIComponent(programmingTerms[0])}`,
        snippet: `Find specific questions and answers about "${programmingTerms[0]}"`,
        domain: 'stackoverflow.com',
        type: 'specific_qa'
      };
    }
    return null;
  }

  /**
   * Find specific GitHub repository
   */
  findGitHubRepository(query) {
    // Convert query to GitHub search-friendly format
    const githubQuery = query.toLowerCase().replace(/\s+/g, '-');
    
    return {
      title: `GitHub: ${query}`,
      url: `https://github.com/search?q=${encodeURIComponent(githubQuery)}&type=repositories&s=stars&o=desc`,
      snippet: `Find popular repositories related to "${query}"`,
      domain: 'github.com',
      type: 'specific_repo'
    };
  }

  /**
   * Find specific MDN documentation
   */
  findMDNDocumentation(query) {
    // Convert query to common web development terms
    const webTerms = this.getWebDevelopmentTerms(query);
    
    if (webTerms.length > 0) {
      return {
        title: `MDN Docs: ${webTerms[0]}`,
        url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(webTerms[0])}`,
        snippet: `Find official documentation for "${webTerms[0]}"`,
        domain: 'developer.mozilla.org',
        type: 'specific_docs'
      };
    }
    return null;
  }

  /**
   * Find specific ArXiv paper
   */
  findArxivPaper(query) {
    return {
      title: `ArXiv: ${query}`,
      url: `https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all&source=header`,
      snippet: `Find latest research papers about "${query}"`,
      domain: 'arxiv.org',
      type: 'specific_paper'
    };
  }

  /**
   * Find specific Wikipedia article
   */
  findWikipediaArticle(query) {
    // Try to create a Wikipedia-friendly URL
    const wikiQuery = query.replace(/\s+/g, '_');
    
    return {
      title: `Wikipedia: ${query}`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiQuery)}`,
      snippet: `Read comprehensive information about "${query}"`,
      domain: 'wikipedia.org',
      type: 'specific_article'
    };
  }

  /**
   * Find specific YouTube video
   */
  findYouTubeVideo(query) {
    return {
      title: `YouTube: ${query}`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' tutorial')}`,
      snippet: `Watch tutorials and videos about "${query}"`,
      domain: 'youtube.com',
      type: 'specific_video'
    };
  }

  /**
   * Get common programming terms from query
   */
  getProgrammingTerms(query) {
    const terms = query.toLowerCase().split(/\s+/);
    const programmingKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'vue', 'angular',
      'typescript', 'php', 'ruby', 'go', 'rust', 'c++', 'c#', 'swift',
      'kotlin', 'dart', 'flutter', 'docker', 'kubernetes', 'aws', 'azure',
      'database', 'sql', 'mongodb', 'redis', 'api', 'rest', 'graphql',
      'testing', 'unit', 'integration', 'deployment', 'ci', 'cd'
    ];
    
    return terms.filter(term => programmingKeywords.includes(term));
  }

  /**
   * Get web development terms from query
   */
  getWebDevelopmentTerms(query) {
    const terms = query.toLowerCase().split(/\s+/);
    const webKeywords = [
      'html', 'css', 'javascript', 'react', 'vue', 'angular', 'node',
      'express', 'mongodb', 'sql', 'api', 'rest', 'graphql', 'webpack',
      'babel', 'typescript', 'sass', 'less', 'bootstrap', 'tailwind',
      'responsive', 'accessibility', 'seo', 'performance', 'security'
    ];
    
    return terms.filter(term => webKeywords.includes(term));
  }

  /**
   * Get focus mode description
   */
  getFocusDescription(focus) {
    const descriptions = {
      'general': 'General web search for broad information',
      'academic': 'Academic and educational sources',
      'news': 'Current news and recent information',
      'technical': 'Technical documentation and code examples'
    };
    return descriptions[focus] || 'General information';
  }
}

export default new SearchService();

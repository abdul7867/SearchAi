import { useState, useEffect } from 'react';
import { Search, Bookmark, Clock, ExternalLink, Trash2, Eye, FolderPlus, Tag, Calendar, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import historyStore from '../stores/historyStore';
import collectionsStore from '../stores/collectionsStore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const History = () => {
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'bookmarked'
  const [currentPage, setCurrentPage] = useState(1);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [showCreateCollectionInModal, setShowCreateCollectionInModal] = useState(false);
  const [collectionSearchQuery, setCollectionSearchQuery] = useState('');
  const [newCollectionData, setNewCollectionData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const navigate = useNavigate();
  
  // Get state from stores
  const { 
    searches, 
    bookmarkedSearches, 
    loading, 
    error, 
    pagination, 
    bookmarkedPagination,
    fetchHistory, 
    fetchBookmarked, 
    clearHistory, 
    toggleBookmark,
    clearError 
  } = historyStore((state) => state); // ✅ FIXED: Use proper Zustand selector pattern
  
  const { collections, fetchCollections, addSearchToCollection, createCollection } = collectionsStore((state) => state); // ✅ FIXED: Use proper Zustand selector pattern
  const { success: showSuccess, error: showError } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory(currentPage);
    } else {
      fetchBookmarked(currentPage);
    }
    // Fetch collections for the add to collection functionality
    fetchCollections();
  }, [activeTab, currentPage, fetchHistory, fetchBookmarked, fetchCollections]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all search history? This action cannot be undone.')) {
      const result = await clearHistory();
      if (result.success) {
        setCurrentPage(1);
        showSuccess('History Cleared', 'Your search history has been cleared successfully!');
      } else {
        showError('Clear Failed', result.error || 'Failed to clear history');
      }
    }
  };

  const handleToggleBookmark = async (searchId) => {
    await toggleBookmark(searchId);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddToCollection = (search) => {
    setSelectedSearch(search);
    setShowCollectionModal(true);
    setCollectionSearchQuery('');
    setShowCreateCollectionInModal(false);
  };

  const handleAddToCollectionConfirm = async (collectionId) => {
    if (selectedSearch && collectionId) {
      const result = await addSearchToCollection(collectionId, selectedSearch.id);
      if (result.success) {
        setShowCollectionModal(false);
        setSelectedSearch(null);
        setCollectionSearchQuery('');
        setShowCreateCollectionInModal(false);
        showSuccess('Search Added', 'Search has been added to collection successfully!');
        // Refresh the current tab to show updated data
        if (activeTab === 'history') {
          fetchHistory(currentPage);
        } else {
          fetchBookmarked(currentPage);
        }
      } else {
        showError('Add Failed', result.error || 'Failed to add search to collection');
      }
    }
  };

  const handleCreateNewCollectionInModal = async (e) => {
    e.preventDefault();
    if (!newCollectionData.name.trim()) {
      showError('Validation Error', 'Collection name is required');
      return;
    }

    const result = await createCollection(newCollectionData);
    if (result.success) {
      // Automatically add the search to the newly created collection
      if (selectedSearch && result.collection) {
        const addResult = await addSearchToCollection(result.collection.id, selectedSearch.id);
        if (addResult.success) {
          setShowCollectionModal(false);
          setSelectedSearch(null);
          setShowCreateCollectionInModal(false);
          setNewCollectionData({ name: '', description: '', color: '#3B82F6' });
          setCollectionSearchQuery('');
          showSuccess('Collection Created', 'New collection created and search added successfully!');
          // Refresh collections and current tab
          fetchCollections();
          if (activeTab === 'history') {
            fetchHistory(currentPage);
          } else {
            fetchBookmarked(currentPage);
          }
        } else {
          showError('Add Failed', 'Collection created but failed to add search');
        }
      }
    } else {
      showError('Creation Failed', result.error || 'Failed to create collection');
    }
  };

  const handleCancelCreateCollection = () => {
    setShowCreateCollectionInModal(false);
    setNewCollectionData({ name: '', description: '', color: '#3B82F6' });
  };

  const handleCloseCollectionModal = () => {
    setShowCollectionModal(false);
    setSelectedSearch(null);
    setCollectionSearchQuery('');
    setShowCreateCollectionInModal(false);
    setNewCollectionData({ name: '', description: '', color: '#3B82F6' });
  };

  // Filter collections based on search query
  const filteredCollectionsInModal = collections.filter(collection =>
    collection.name.toLowerCase().includes(collectionSearchQuery.toLowerCase()) ||
    (collection.description && collection.description.toLowerCase().includes(collectionSearchQuery.toLowerCase()))
  );

  const handleViewSearch = (search) => {
    // Navigate to search page with query and focus parameters
    const searchParams = new URLSearchParams();
    searchParams.set('q', search.query);
    searchParams.set('focus', search.focus || 'general');
    navigate(`/search?${searchParams.toString()}`);
  };

  const renderSearchCard = (item) => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
              {item.query}
            </CardTitle>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(item.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {item.focusLabel}
                </span>
              </div>
              {item.sourcesCount > 0 && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>{item.sourcesCount} sources</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleToggleBookmark(item.id)}
              className={`p-2 rounded-lg transition-colors ${
                item.isBookmarked 
                  ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              aria-label={item.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark className={`h-5 w-5 ${item.isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => handleAddToCollection(item)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              aria-label="Add to collection"
            >
              <FolderPlus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {item.answerPreview}
        </p>
        
        {item.sources && item.sources.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Sources:</h4>
            <div className="space-y-2">
              {item.sources.slice(0, 2).map((source, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:text-primary/80 line-clamp-1"
                    >
                      {source.title}
                    </a>
                    {source.snippet && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {source.snippet}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {item.sources.length > 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{item.sources.length - 2} more sources
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewSearch(item)}
              className="h-8"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Search
            </Button>
          </div>
          
          {item.metadata && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {item.metadata.processingTime && (
                <span>Processed in {item.metadata.processingTime}ms</span>
              )}
              {item.metadata.tokensUsed && (
                <span>{item.metadata.tokensUsed} tokens</span>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Search History</h1>
            <p className="text-muted-foreground">Your previous searches and AI-generated answers</p>
          </div>
          <Button
            variant="outline"
            onClick={handleClearHistory}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm font-medium">{error}</p>
            <button 
              onClick={clearError}
              className="mt-2 text-destructive/80 hover:text-destructive text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
          <button
            onClick={() => {
              setActiveTab('history');
              setCurrentPage(1);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Searches ({pagination.total})
          </button>
          <button
            onClick={() => {
              setActiveTab('bookmarked');
              setCurrentPage(1);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'bookmarked'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-foreground'
            }`}
          >
            Bookmarked ({bookmarkedPagination.total})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <LoadingSkeleton type="search-result" />
          <LoadingSkeleton type="search-result" />
          <LoadingSkeleton type="search-result" />
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* No Results */}
          {((activeTab === 'history' && searches.length === 0) || 
            (activeTab === 'bookmarked' && bookmarkedSearches.length === 0)) && (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {activeTab === 'history' ? 'No search history yet' : 'No bookmarked searches'}
              </h3>
              <p className="text-muted-foreground">
                {activeTab === 'history' 
                  ? 'Start searching to see your history here' 
                  : 'Bookmark searches to see them here'
                }
              </p>
            </div>
          )}

          {/* Search Results */}
          {((activeTab === 'history' && searches.length > 0) || 
            (activeTab === 'bookmarked' && bookmarkedSearches.length > 0)) && (
            <div className="space-y-6">
              {(activeTab === 'history' ? searches : bookmarkedSearches).map(renderSearchCard)}
            </div>
          )}

          {/* Pagination */}
          {((activeTab === 'history' && pagination.pages > 1) || 
            (activeTab === 'bookmarked' && bookmarkedPagination.pages > 1)) && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size="sm"
              >
                Previous
              </Button>
              
              <span className="px-3 py-2 text-sm text-muted-foreground">
                Page {currentPage} of {activeTab === 'history' ? pagination.pages : bookmarkedPagination.pages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= (activeTab === 'history' ? pagination.pages : bookmarkedPagination.pages)}
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Collection Modal */}
      {showCollectionModal && selectedSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">Add to Collection</h3>
            <p className="text-muted-foreground mb-4">
              Choose a collection to add "{selectedSearch.query}" to:
            </p>
            
            {!showCreateCollectionInModal ? (
              <>
                {/* Search Collections */}
                {collections.length > 3 && (
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search collections..."
                        value={collectionSearchQuery}
                        onChange={(e) => setCollectionSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
                
                {/* Create New Collection Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowCreateCollectionInModal(true)}
                  className="w-full mb-4 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Collection
                </Button>
                
                {/* Collections List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredCollectionsInModal.length > 0 ? (
                    filteredCollectionsInModal.map((collection) => (
                      <button
                        key={collection.id}
                        onClick={() => handleAddToCollectionConfirm(collection.id)}
                        className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: collection.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{collection.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {collection.searchesCount} searches
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FolderPlus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">
                        {collectionSearchQuery ? 'No collections found' : 'No collections available'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleCloseCollectionModal}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              /* Create Collection Form */
              <form onSubmit={handleCreateNewCollectionInModal} className="space-y-4">
                <div>
                  <label htmlFor="modal-name" className="block text-sm font-medium text-foreground mb-2">
                    Collection Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="modal-name"
                    type="text"
                    value={newCollectionData.name}
                    onChange={(e) => setNewCollectionData({ ...newCollectionData, name: e.target.value })}
                    placeholder="Enter collection name"
                    required
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <label htmlFor="modal-description" className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Input
                    id="modal-description"
                    type="text"
                    value={newCollectionData.description}
                    onChange={(e) => setNewCollectionData({ ...newCollectionData, description: e.target.value })}
                    placeholder="Enter description (optional)"
                    maxLength={500}
                  />
                </div>
                
                <div>
                  <label htmlFor="modal-color" className="block text-sm font-medium text-foreground mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="modal-color"
                      type="color"
                      value={newCollectionData.color}
                      onChange={(e) => setNewCollectionData({ ...newCollectionData, color: e.target.value })}
                      className="w-12 h-10 rounded border border-border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={newCollectionData.color}
                      onChange={(e) => setNewCollectionData({ ...newCollectionData, color: e.target.value })}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelCreateCollection}
                  >
                    Back
                  </Button>
                  <Button type="submit">
                    Create & Add Search
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;

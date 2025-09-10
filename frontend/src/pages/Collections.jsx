import { useState, useEffect } from 'react';
import { Search, Plus, FolderPlus, Trash2, Edit3, Eye, Calendar, Tag, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import collectionsStore from '../stores/collectionsStore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Collections = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const navigate = useNavigate();
  
  // Get state from collections store
  const { 
    collections, 
    loading, 
    error, 
    fetchCollections, 
    createCollection, 
    updateCollection, 
    deleteCollection,
    removeSearchFromCollection,
    clearError 
  } = collectionsStore((state) => state);
  
  const { success: showSuccess, error: showError } = useToast();

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError('Validation Error', 'Collection name is required');
      return;
    }

    try {
      const result = await createCollection(formData);
      if (result.success) {
        setShowCreateForm(false);
        setFormData({ name: '', description: '', color: '#3B82F6' });
        showSuccess('Collection Created', 'Collection has been created successfully!');
      } else {
        showError('Creation Failed', result.error || 'Failed to create collection');
      }
    } catch (err) {
      showError('Creation Failed', 'An unexpected error occurred');
    }
  };

  const handleUpdateCollection = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError('Validation Error', 'Collection name is required');
      return;
    }

    try {
      const result = await updateCollection(editingCollection.id, formData);
      if (result.success) {
        setEditingCollection(null);
        setFormData({ name: '', description: '', color: '#3B82F6' });
        showSuccess('Collection Updated', 'Collection has been updated successfully!');
      } else {
        showError('Update Failed', result.error || 'Failed to update collection');
      }
    } catch (err) {
      showError('Update Failed', 'An unexpected error occurred');
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      try {
        const result = await deleteCollection(collectionId);
        if (result.success) {
          showSuccess('Collection Deleted', 'Collection has been deleted successfully!');
        } else {
          showError('Deletion Failed', result.error || 'Failed to delete collection');
        }
      } catch (err) {
        showError('Deletion Failed', 'An unexpected error occurred');
      }
    }
  };

  const handleRemoveSearch = async (collectionId, searchId) => {
    if (window.confirm('Are you sure you want to remove this search from the collection?')) {
      try {
        const result = await removeSearchFromCollection(collectionId, searchId);
        if (result.success) {
          showSuccess('Search Removed', 'Search has been removed from collection successfully!');
        } else {
          showError('Removal Failed', result.error || 'Failed to remove search from collection');
        }
      } catch (err) {
        showError('Removal Failed', 'An unexpected error occurred');
      }
    }
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      color: collection.color
    });
  };

  const handleCancelEdit = () => {
    setEditingCollection(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
  };

  const handleViewSearch = (search) => {
    // Navigate to search page with query and focus parameters
    const searchParams = new URLSearchParams();
    searchParams.set('q', search.query);
    searchParams.set('focus', search.focus || 'general');
    navigate(`/search?${searchParams.toString()}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Color options for collections
  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ];

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="space-y-6">
          <LoadingSkeleton type="collection-header" />
          <LoadingSkeleton type="collection-card" />
          <LoadingSkeleton type="collection-card" />
        </div>
      </div>
    );
  }

  // Render collection content
  const renderCollectionContent = (collection) => {
    if (!collection.searches || collection.searches.length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No searches in this collection</h3>
          <p className="text-muted-foreground">Start searching to add items to your collection</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {collection.searches.map((search) => (
          <Card key={search.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {search.query}
                  </CardTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(search.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {search.focusLabel}
                      </span>
                    </div>
                    {search.sourcesCount > 0 && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" />
                        <span>{search.sourcesCount} sources</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSearch(collection.id, search.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  aria-label="Remove from collection"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {search.answerPreview}
              </p>
              
              {search.sources && search.sources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Sources:</h4>
                  <div className="space-y-2">
                    {search.sources.slice(0, 2).map((source, index) => (
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
                    {search.sources.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{search.sources.length - 2} more sources
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-0">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSearch(search)}
                  className="h-8"
                >
                  <Search className="h-4 w-4 mr-1" />
                  View Search
                </Button>
                
                {search.metadata && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {search.metadata.processingTime && (
                      <span>Processed in {search.metadata.processingTime}ms</span>
                    )}
                    {search.metadata.tokensUsed && (
                      <span>{search.metadata.tokensUsed} tokens</span>
                    )}
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Collections</h1>
            <p className="text-muted-foreground">Organize and manage your saved searches</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
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
      </div>

      {/* Create Collection Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create New Collection</h3>
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Collection Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter collection name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter collection description"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-md border border-border cursor-pointer"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
              >
                Cancel
                </Button>
                <Button type="submit">
                  Create Collection
                </Button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* Edit Collection Form */}
      {editingCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Collection</h3>
            <form onSubmit={handleUpdateCollection} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-foreground mb-2">
                  Collection Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter collection name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter collection description"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="edit-color" className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <input
                  type="color"
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-md border border-border cursor-pointer"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
              >
                Cancel
                </Button>
                <Button type="submit">
                  Update Collection
                </Button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* Collections List */}
      {!loading && (
        <>
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <FolderPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No collections yet</h3>
              <p className="text-muted-foreground">Create your first collection to organize your searches</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-5 h-5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: collection.color }}
                          />
                          <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
                            {collection.name}
                          </CardTitle>
                    </div>
                        {collection.description && (
                          <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {collection.description}
                          </CardDescription>
                        )}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                      <Search className="h-4 w-4" />
                            <span>{collection.searchesCount} searches</span>
                    </div>
                          <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(collection.createdAt)}</span>
                    </div>
                  </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                  {collection.tags && collection.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {collection.tags.map((tag, index) => (
                        <span
                          key={index}
                            className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="outline"
                        size="sm"
                      onClick={() => handleEditCollection(collection)}
                        className="h-8"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                      onClick={() => handleDeleteCollection(collection.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {/* The pagination state and logic were not provided in the edit_specification,
              so I'm keeping the original pagination structure but noting the potential
              for future implementation. */}
          {/* <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size="sm"
              >
                Previous
              </Button>
              
              <span className="px-3 py-2 text-sm text-muted-foreground">
                Page {currentPage} of {pagination.pages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.pages}
                size="sm"
              >
                Next
              </Button>
            </div> */}
        </>
      )}
    </div>
  );
};

export default Collections;

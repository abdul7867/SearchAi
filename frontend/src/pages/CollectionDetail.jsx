import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import collectionsStore from '../stores/collectionsStore';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { Search, ArrowLeft, Trash2, ExternalLink, Calendar, Tag } from 'lucide-react';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    collections, 
    loading, 
    fetchCollections, 
    removeSearchFromCollection 
  } = collectionsStore((state) => state);
  const { success: showSuccess, error: showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (collections.length === 0) {
      fetchCollections();
    }
  }, [collections.length, fetchCollections]);

  const collection = collections.find((c) => c.id === id);

  const handleRemoveSearch = async (searchId) => {
    if (window.confirm('Are you sure you want to remove this search from the collection?')) {
      try {
        const result = await removeSearchFromCollection(id, searchId);
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

  const handleViewSearch = (search) => {
    const searchParams = new URLSearchParams();
    searchParams.set('q', search.query);
    searchParams.set('focus', search.focus || 'general');
    navigate(`/search?${searchParams.toString()}`);
  };

  const filteredSearches = collection?.searches?.filter(search =>
    search.query.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !collection) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <LoadingSkeleton type="collection-header" />
        <div className="mt-6 space-y-4">
          <LoadingSkeleton type="search-result" />
          <LoadingSkeleton type="search-result" />
          <LoadingSkeleton type="search-result" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-20">
        <FolderQuestion className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Collection not found</h2>
        <p className="mt-2 text-lg text-muted-foreground">The collection you are looking for does not exist or has been deleted.</p>
        <Button onClick={() => navigate('/collections')} className="mt-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collections
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <Button onClick={() => navigate('/collections')} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collections
        </Button>
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                    <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: collection.color }}></span>
                    {collection.name}
                </h1>
                <p className="mt-2 text-muted-foreground">{collection.description}</p>
            </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search within this collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {filteredSearches.length > 0 ? (
        <div className="space-y-4">
          {filteredSearches.map((search) => (
            <Card key={search.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleViewSearch(search); }}
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {search.query}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{search.summary || 'No summary available.'}</p>
                  </div>
                  <div className="flex items-center ml-4 space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewSearch(search)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveSearch(search.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-3 w-3" />
                    <span>{formatDate(search.createdAt)}</span>
                  </div>
                  {search.focus && (
                    <div className="flex items-center">
                      <Tag className="mr-1.5 h-3 w-3" />
                      <span className="capitalize">{search.focus}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No matching searches found</h3>
          <p className="text-muted-foreground">
            {collection.searches?.length > 0 ? 'Try a different search term.' : 'This collection is empty.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CollectionDetail;
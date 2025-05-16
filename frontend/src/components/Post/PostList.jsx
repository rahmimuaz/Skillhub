import { useEffect, useState } from 'react';
import {
  Pencil, Trash2, RefreshCw, Video, Calendar, User, Eye, Plus
} from 'lucide-react';
import { getPosts, deletePost } from '../../services/postApi';
import PostCard from './PostCard';
import toast from 'react-hot-toast';
import './PostList.css';

const PostList = ({ onEdit, onNewPost }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      setError('Failed to fetch posts. Please try again.');
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCw className="animate-spin" size={24} />
        <p className="loading-text">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button 
          onClick={fetchPosts} 
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="post-header">
        <h2 className="post-title">All Posts</h2>
        <div className="post-actions">
          {onNewPost && (
            <button
              onClick={onNewPost}
              className="new-post-button"
            >
              <Plus size={18} />
              New Post
            </button>
          )}
          <button
            onClick={fetchPosts}
            className="refresh-button"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <div className="view-toggle">
            <button 
              className={`view-toggle-button ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
            >
              Card View
            </button>
            <button 
              className={`view-toggle-button ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts found.</p>
          {onNewPost && (
            <button onClick={onNewPost} className="create-post-button">
              Create your first post
            </button>
          )}
        </div>
      ) : viewMode === 'card' ? (
        <div className="post-grid-container">
          <div className="post-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-grid-item">
                <PostCard 
                  post={post}
                  onEdit={() => onEdit(post)}
                  onDelete={() => handleDelete(post.id)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="post-table">
            <thead className="table-header">
              <tr>
                {['Title', 'Description', 'Media', 'Author', 'Date', 'Views', 'Category', 'Actions'].map((col) => (
                  <th
                    key={col}
                    className="table-head"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="table-row">
                  <td className="table-data font-medium">{post.title}</td>
                  <td className="table-data text-gray-600">{post.description}</td>
                  <td className="table-data">
                    <div className="media-grid">
                      {post.images?.slice(0, 2).map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Post ${idx + 1}`}
                          className="media-image"
                        />
                      ))}
                      {post.videos?.length > 0 && (
                        <div className="video-indicator">
                          <Video size={16} />
                          <span>{post.videos.length}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-data">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>User {post.userId}</span>
                    </div>
                  </td>
                  <td className="table-data">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(post.timestamp)}
                    </div>
                  </td>
                  <td className="table-data">
                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      {post.visibilityCount}
                    </div>
                  </td>
                  <td className="table-data">
                    <span className="post-badge">{post.postType}</span>
                  </td>
                  <td className="table-data">
                    <div className="action-buttons">
                      <button 
                        onClick={() => onEdit(post)}
                        className="edit-button"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="delete-button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostList;
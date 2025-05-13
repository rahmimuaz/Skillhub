import { useEffect, useState } from 'react';
import {
  Pencil, Trash2, RefreshCw, Video, Calendar, User, Eye
} from 'lucide-react'; // Importing icons from lucide-react
import { getPosts, deletePost } from '../services/api'; // API service functions
import toast from 'react-hot-toast'; // For showing toast notifications
import './PostList.css'; // Importing CSS styles

const PostList = ({ onEdit }) => {
  // State to hold fetched posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPosts(); // API call
      setPosts(response.data); // Store fetched posts in state
    } catch (error) {
      setError('Failed to fetch posts. Please try again.');
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Handle post deletion
  const handleDelete = async (id) => {
    try {
      await deletePost(id); // API call to delete post
      setPosts(posts.filter(post => post.id !== id)); // Remove post from UI
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Format date for displaying post creation time
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

  // Show loading spinner while fetching posts
  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCw className="animate-spin" size={24} />
        <p className="loading-text">Loading posts...</p>
      </div>
    );
  }

  // Show error message and retry button if fetch failed
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
      {/* Header section with title and refresh button */}
      <div className="post-header">
        <h2 className="post-title">All Posts</h2>
        <button
          onClick={fetchPosts}
          className="refresh-button"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Show empty state message if no posts are available */}
      {posts.length === 0 ? (
        <div className="empty-state">No posts found. Create your first post!</div>
      ) : (
        // Render table of posts
        <div className="table-container">
          <table className="post-table">
            <thead className="table-header">
              <tr>
                {['Title', 'Description', 'Media', 'Author', 'Date', 'Views', 'Category', 'Actions'].map((col) => (
                  <th key={col} className="table-head">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="table-row">
                  <td className="table-data font-medium">{post.title}</td>
                  <td className="table-data text-gray-600">{post.description}</td>

                  {/* Media column: show images and video count */}
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

                  {/* Author/user info */}
                  <td className="table-data">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>User {post.userId}</span>
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="table-data">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(post.timestamp)}
                    </div>
                  </td>

                  {/* Views count */}
                  <td className="table-data">
                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      {post.visibilityCount}
                    </div>
                  </td>

                  {/* Post type/category */}
                  <td className="table-data">
                    <span className="post-badge">{post.postType}</span>
                  </td>

                  {/* Action buttons: edit & delete */}
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

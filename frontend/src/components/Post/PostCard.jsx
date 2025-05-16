import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Calendar, User, Edit, Trash2 } from 'lucide-react';
import ReactionBar from '../Reaction/ReactionBar';
import CommentSection from '../Comment/CommentSection';
import './PostCard.css';

const PostCard = ({ post, currentUser, onEdit, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  
  // Use provided currentUser or default if not provided
  const user = currentUser || { id: "user123", name: "Current User" };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Check if the current user is the author of the post
  const isAuthor = currentUser && post.userId === currentUser.id;

  // Display a user name instead of just an ID
  const getDisplayName = () => {
    // First priority: userName directly from the post object (from API)
    if (post.userName && post.userName.trim() !== '') 
      return post.userName;
    
    // Second priority: authorName if available
    if (post.authorName && post.authorName.trim() !== '') 
      return post.authorName;
    
    // Third priority: use the current user's name if it's the user's own post
    if (currentUser && post.userId === currentUser.id && currentUser.name) 
      return currentUser.name;
    
    // Fourth priority: if post has user object with name
    if (post.user && post.user.name) 
      return post.user.name;
    
    // Fallback: generic name rather than ID
    return "Anonymous User";
  };

  const handleEdit = () => {
    if (onEdit) onEdit(post);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(post.id);
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-card-user">
          <User size={24} />
          <span>{getDisplayName()}</span>
        </div>
        <div className="post-card-meta">
          <span className="post-card-type">{post.postType}</span>
          <span className="post-card-date">
            <Calendar size={16} />
            {formatDate(post.timestamp)}
          </span>
        </div>
      </div>
      
      <Link to={`/posts/${post.id}`} className="post-card-title-link">
        <h3 className="post-card-title">{post.title}</h3>
      </Link>
      
      <div className="post-card-description">{post.description}</div>
      
      {/* Image Display Section */}
      {(post.image || (post.images && post.images.length > 0)) && (
        <div className="post-card-image-container">
          {/* If there's a main image, display it */}
          {post.image && (
            <img 
              src={post.image} 
              alt={post.title} 
              className="post-card-image"
              onError={(e) => {
                console.error('Image failed to load:', post.image);
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
              }} 
            />
          )}
          
          {/* If no main image but has images array, display the first one */}
          {!post.image && post.images && post.images.length > 0 && (
            <img 
              src={post.images[0]} 
              alt={post.title} 
              className="post-card-image"
              onError={(e) => {
                console.error('Image failed to load:', post.images[0]);
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
              }} 
            />
          )}
          
          {/* If there are multiple images, show indicators */}
          {post.images && post.images.length > 1 && (
            <div className="image-count-indicator">
              +{post.images.length - 1} more
            </div>
          )}
        </div>
      )}
      
      <ReactionBar postId={post.id} currentUser={user} />
      
      <div className="post-card-actions">
        <button 
          className="post-card-comment-button"
          onClick={toggleComments}
        >
          <MessageSquare size={18} />
          Comments
        </button>
        
        {/* Show edit/delete buttons only if the user is the author */}
        {isAuthor && (
          <div className="post-card-manage-buttons">
            <button 
              className="post-card-edit-button"
              onClick={handleEdit}
              aria-label="Edit post"
            >
              <Edit size={18} />
              Edit
            </button>
            <button 
              className="post-card-delete-button"
              onClick={handleDelete}
              aria-label="Delete post"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        )}
      </div>
      
      {showComments && (
        <div className="post-card-comments">
          <CommentSection postId={post.id} currentUser={user} />
        </div>
      )}
    </div>
  );
};

export default PostCard; 
import { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import { MessageSquare, Trash2, Send, AlertTriangle } from 'lucide-react';
import './CommentSection.css';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const commentsData = await postService.getCommentsByPostId(postId);
        setComments(commentsData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err.response?.data?.message || 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    if (!currentUser?.id) {
      toast.error('Please log in to add comments');
      return;
    }
    
    try {
      const comment = {
        postId: postId,
        userId: currentUser.id,
        content: newComment,
        // Add the user's name to ensure it's available immediately
        userName: currentUser.name || '',
        authorName: currentUser.name || '',
        // Adding timestamp for immediate display before API response
        timestamp: new Date().toISOString()
      };
      
      const newCommentData = await postService.addComment(comment);
      
      // Combine backend data with additional user info
      const commentWithUser = {
        ...newCommentData,
        userName: currentUser.name || '',
        user: {
          id: currentUser.id,
          name: currentUser.name || ''
        }
      };
      
      setComments([...comments, commentWithUser]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  const initiateDeleteComment = (commentId) => {
    setConfirmDelete(commentId);
  };

  const cancelDeleteComment = () => {
    setConfirmDelete(null);
  };

  const confirmDeleteComment = async (commentId) => {
    try {
      setDeletingCommentId(commentId);
      
      // Wait for animation to complete
      setTimeout(async () => {
        await postService.deleteComment(commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
        toast.success('Comment deleted successfully');
        setDeletingCommentId(null);
        setConfirmDelete(null);
      }, 300);
    } catch (err) {
      setDeletingCommentId(null);
      setConfirmDelete(null);
      toast.error('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

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
  
  // Get display name for a comment author
  const getCommentAuthorName = (comment) => {
    // First priority: userName directly from the comment
    if (comment.userName && comment.userName.trim() !== '') 
      return comment.userName;
    
    // Second priority: authorName if available
    if (comment.authorName && comment.authorName.trim() !== '') 
      return comment.authorName;
    
    // Third priority: if this is the current user's comment, use current user's name
    if (currentUser && comment.userId === currentUser.id && currentUser.name) 
      return currentUser.name;
    
    // Fallback: if comment has a user field with a name property
    if (comment.user && comment.user.name) 
      return comment.user.name;
    
    // Last resort fallback (shouldn't happen with proper data)
    return "Anonymous User";
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  if (error) {
    return <div className="comments-error">{error}</div>;
  }

  return (
    <div className="comments-section">
      <h2 className="comments-title">
        <MessageSquare size={20} />
        Comments ({comments.length})
      </h2>
      
      <div className="comment-input-container">
        <input
          type="text"
          className="comment-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
        />
        <button 
          className="comment-submit" 
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send size={20} />
        </button>
      </div>
      
      {comments.length === 0 ? (
        <div className="no-comments">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`comment-item ${deletingCommentId === comment.id ? 'deleting' : ''}`}
            >
              <div className="comment-header">
                <span className={`comment-author ${getCommentAuthorName(comment) === "Anonymous User" ? "anonymous" : ""}`}>
                  {getCommentAuthorName(comment) !== "Anonymous User" && (
                    <span className="comment-author-avatar">
                      {getCommentAuthorName(comment).charAt(0).toUpperCase()}
                    </span>
                  )}
                  {getCommentAuthorName(comment)}
                </span>
                <span className="comment-date">{formatDate(comment.timestamp)}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
              
              {comment.userId === currentUser?.id && confirmDelete === comment.id ? (
                <div className="delete-confirm">
                  <span className="confirm-message">
                    <AlertTriangle size={14} /> Delete?
                  </span>
                  <button 
                    onClick={() => confirmDeleteComment(comment.id)}
                    className="confirm-yes"
                  >
                    Yes
                  </button>
                  <button 
                    onClick={cancelDeleteComment}
                    className="confirm-no"
                  >
                    No
                  </button>
                </div>
              ) : comment.userId === currentUser?.id && (
                <button 
                  className="delete-comment" 
                  onClick={() => initiateDeleteComment(comment.id)}
                  aria-label="Delete comment"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection; 
import { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import { MessageSquare, Trash2, Send } from 'lucide-react';
import './CommentSection.css';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        content: newComment
      };
      
      const newCommentData = await postService.addComment(comment);
      
      // Add the user's name to the comment for display
      const commentWithUser = {
        ...newCommentData,
        userName: currentUser.name || `User ${currentUser.id.substring(0, 5)}`
      };
      
      setComments([...comments, commentWithUser]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await postService.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (err) {
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
    if (comment.userName) return comment.userName;
    if (comment.authorName) return comment.authorName;
    return `User ${comment.userId.substring(0, 5)}`;
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
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{getCommentAuthorName(comment)}</span>
                <span className="comment-date">{formatDate(comment.timestamp)}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
              {comment.userId === currentUser?.id && (
                <button 
                  className="delete-comment" 
                  onClick={() => handleDeleteComment(comment.id)}
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
import { useState, useEffect } from 'react';
import axios from 'axios';

const Post = ({ post, currentUserId }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [post.id]);

  const fetchLikes = async () => {
    try {
      const response = await axios.get(`http://localhost:9007/api/likes/${post.id}/count`);
      setLikes(response.data);
      // Check if current user has liked the post
      const likedResponse = await axios.get(`http://localhost:9007/api/likes/${post.id}/user/${currentUserId}`);
      setIsLiked(likedResponse.data);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:9007/comments/${post.id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.post(`http://localhost:9007/api/likes/${post.id}/unlike?userId=${currentUserId}`);
        setLikes(prev => prev - 1);
      } else {
        await axios.post(`http://localhost:9007/api/likes/${post.id}/like?userId=${currentUserId}`);
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = {
        text: newComment,
        author: currentUserId,
        postId: post.id
      };

      await axios.post(`http://localhost:9007/comments/${post.id}`, comment);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <h3>{post.title}</h3>
      </div>
      <div className="post-content">
        <p>{post.description}</p>
        {post.image && <img src={post.image} alt={post.title} style={{ maxWidth: '100%', marginTop: '1rem' }} />}
      </div>
      <div className="post-actions">
        <button 
          className={`action-button ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
        >
          <span>👍</span>
          <span>{likes}</span>
        </button>
        <button 
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <span>💬</span>
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form className="comment-input" onSubmit={handleComment}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit">Post</button>
          </form>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span>{comment.author}</span>
                  <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post; 
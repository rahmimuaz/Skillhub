import React, { useState } from 'react';
import '../App.css';

const PostInteraction = () => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      content: "This is a sample comment",
      author: "John Doe",
      timestamp: new Date().toISOString(),
      reactions: { '👍': 2, '❤️': 1 }
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  const reactions = [
    { emoji: '👍', name: 'Thumbs Up' },
    { emoji: '❤️', name: 'Heart' },
    { emoji: '😂', name: 'Laugh' },
    { emoji: '😮', name: 'Wow' },
    { emoji: '😢', name: 'Sad' },
    { emoji: '👏', name: 'Clap' }
  ];

  const handleReaction = (reaction) => {
    setSelectedReaction(reaction);
    setShowReactions(false);
    if (!isLiked) {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleCommentReaction = (commentId, reaction) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const currentReactions = comment.reactions || {};
        const newReactions = {
          ...currentReactions,
          [reaction]: (currentReactions[reaction] || 0) + 1
        };
        return { ...comment, reactions: newReactions };
      }
      return comment;
    }));
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        content: newComment,
        author: "Current User",
        timestamp: new Date().toISOString(),
        reactions: {}
      };
      setComments(prev => [...prev, comment]);
      setNewComment('');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.content);
  };

  const handleUpdateComment = (commentId) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, content: editText }
        : comment
    ));
    setEditingComment(null);
    setEditText('');
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  return (
    <div className="post-card">
      <div className="post-content">
        <h2>Sample Post Title</h2>
        <p>This is a sample post content. You can replace this with actual post content.</p>
      </div>

      <div className="post-actions">
        <div className="reaction-container">
          <button 
            className={`action-button ${isLiked ? 'active' : ''}`}
            onClick={() => setShowReactions(!showReactions)}
          >
            {selectedReaction ? (
              <span>{selectedReaction.emoji}</span>
            ) : (
              <span>👍</span>
            )}
            <span>{likes} Reactions</span>
          </button>
          
          {showReactions && (
            <div className="reaction-popup">
              {reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  className="reaction-button"
                  onClick={() => handleReaction(reaction)}
                  title={reaction.name}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>
        
        <form className="comment-input" onSubmit={handleComment}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Comment</button>
        </form>

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-time">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              {editingComment === comment.id ? (
                <div className="comment-edit-form">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleUpdateComment(comment.id)} className="save-btn">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="comment-text">{comment.content}</div>
                  <div className="comment-reactions">
                    {Object.entries(comment.reactions || {}).map(([emoji, count]) => (
                      <span key={emoji} className="reaction-count">
                        {emoji} {count}
                      </span>
                    ))}
                  </div>
                  <div className="comment-actions">
                    <div className="reaction-buttons">
                      {reactions.map((reaction) => (
                        <button
                          key={reaction.emoji}
                          className="reaction-button"
                          onClick={() => handleCommentReaction(comment.id, reaction.emoji)}
                          title={reaction.name}
                        >
                          {reaction.emoji}
                        </button>
                      ))}
                    </div>
                    <div className="comment-controls">
                      <button 
                        onClick={() => handleEditComment(comment)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostInteraction; 
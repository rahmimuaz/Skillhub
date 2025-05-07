
import { useState } from 'react';
import PostList from '../../components/Post/PostList';
import PostForm from '../../components/Post/PostForm';

const ViewPostPage = () => {
  const [editingPost, setEditingPost] = useState(null);

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleSuccess = () => {
    setEditingPost(null);
  };

  return (
    <div className="view-post-page">
      <h2 className="page-title">
        {editingPost ? 'Edit Post' : 'All Posts'}
      </h2>
      {editingPost ? (
        <div className="edit-post-container">
          <button 
            className="back-button"
            onClick={() => setEditingPost(null)}
          >
            ← Back to Posts
          </button>
          <PostForm postToEdit={editingPost} onSuccess={handleSuccess} />
        </div>
      ) : (
        <PostList onEdit={handleEdit} />
      )}
    </div>
  );
};

export default ViewPostPage;
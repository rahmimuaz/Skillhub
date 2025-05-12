import PostForm from '../components/PostForm';

const CreatePostPage = () => {
  const handleSuccess = () => {
    alert('Post created successfully!');
  };

  return (
    <div>
      <h2>Create new posts</h2>
      <PostForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreatePostPage;
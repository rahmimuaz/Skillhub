import PostForm from '../components/PostForm';

const CreatePostPage = () => {
  const handleSuccess = () => {
    alert('Post created successfully!');
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <PostForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreatePostPage;
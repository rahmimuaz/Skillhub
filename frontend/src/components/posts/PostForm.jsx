import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Upload, X, Image as ImageIcon, Video, Smile } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPost, updatePost } from '../services/api';
import './PostForm.css';

const PostForm = ({ postToEdit, onSuccess }) => {
  // State hooks for form fields
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [category, setCategory] = useState(postToEdit?.postType || 'Programming');
  const [description, setDescription] = useState(postToEdit?.description || '');
  const [images, setImages] = useState(postToEdit?.images || []);
  const [videos, setVideos] = useState(postToEdit?.videos || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for file inputs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Handle image file upload
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  // Handle video file upload
  const handleVideoUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setVideos([...videos, ...newVideos]);
    }
  };

  // Remove image by index
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Remove video by index
  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // Append selected emoji to description
  const onEmojiClick = (emojiData) => {
    setDescription(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data to be sent
      const postData = {
        title,
        postType: category,
        description,
        images,
        videos,
        visibilityCount: 0,
        userId: "user123" // Replace with dynamic user ID in real app
      };

      let response;

      // Call appropriate API depending on whether editing or creating
      if (postToEdit?.id) {
        response = await updatePost(postToEdit.id, postData);
      } else {
        response = await createPost(postData);
      }

      // Notify parent and show success toast
      onSuccess(response.data);
      toast.success(postToEdit ? 'Post updated successfully!' : 'Post created successfully!');

      // Clear form if creating new post
      if (!postToEdit) {
        setTitle('');
        setCategory('Programming');
        setDescription('');
        setImages([]);
        setVideos([]);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2 className="post-form-title">{postToEdit ? 'Edit Post' : 'Create New Post'}</h2>

      {/* Title input */}
      <div className="post-form-group">
        <label htmlFor="title" className="form-label">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          required
        />
      </div>

      {/* Category dropdown */}
      <div className="post-form-group">
        <label htmlFor="category" className="form-label">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          <option value="Programming">Programming</option>
          <option value="Cooking">Cooking</option>
          <option value="Photography">Photography</option>
        </select>
      </div>

      {/* Description with emoji picker */}
      <div className="post-form-group">
        <label htmlFor="description" className="form-label">Description *</label>
        <div className="textarea-container">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            required
          />
          {/* Emoji picker toggle button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="emoji-button"
          >
            <Smile size={20} />
          </button>
        </div>
        {/* Emoji picker component */}
        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      {/* Image uploader */}
      <div className="post-form-group">
        <label className="form-label">Images</label>
        <div className="media-grid">
          {images.map((image, index) => (
            <div key={index} className="media-item">
              <img src={image} alt={`Upload ${index + 1}`} className="preview-image" />
              <button type="button" onClick={() => removeImage(index)} className="remove-button">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="upload-button"
        >
          <ImageIcon size={20} />
          Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden-input"
        />
      </div>

      {/* Video uploader */}
      <div className="post-form-group">
        <label className="form-label">Videos</label>
        <div className="media-grid">
          {videos.map((video, index) => (
            <div key={index} className="media-item">
              <video src={video} controls className="preview-video" />
              <button type="button" onClick={() => removeVideo(index)} className="remove-button">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="upload-button"
        >
          <Video size={20} />
          Upload Videos
        </button>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          className="hidden-input"
        />
      </div>

      {/* Submit button with loading indicator */}
      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? (
          <>
            <Upload className="spinner" size={20} />
            Processing...
          </>
        ) : (
          'Publish Post'
        )}
      </button>
    </form>
  );
};

export default PostForm;

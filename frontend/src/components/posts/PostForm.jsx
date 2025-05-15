import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Upload, X, Image as ImageIcon, Video, Smile } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPost, updatePost } from '../services/api';
import './PostForm.css';

const PostForm = ({ postToEdit, onSuccess }) => {
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [category, setCategory] = useState(postToEdit?.postType || 'Programming');
  const [description, setDescription] = useState(postToEdit?.description || '');
  const [images, setImages] = useState(postToEdit?.images || []);
  const [videos, setVideos] = useState(postToEdit?.videos || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleVideoUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setVideos([...videos, ...newVideos]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const onEmojiClick = (emojiData) => {
    setDescription(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const postData = {
        title,
        postType: category,
        description,
        images,
        videos,
        visibilityCount: 0,
        userId: "user123"
      };

      let response;
      if (postToEdit?.id) {
        response = await updatePost(postToEdit.id, postData);
      } else {
        response = await createPost(postData);
      }

      onSuccess(response.data);
      toast.success(postToEdit ? 'Post updated successfully!' : 'Post created successfully!');

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
        <label htmlFor="title" className="form-label required">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          required
          aria-invalid={!!errors.title}
        />
        {errors.title && <div className="inline-error">{errors.title}</div>}
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
        <label htmlFor="description" className="form-label required">Description</label>
        <div className="textarea-container">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            required
            aria-invalid={!!errors.description}
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="emoji-button"
            aria-label="Add emoji"
          >
            <Smile size={20} />
          </button>
        </div>
        {errors.description && <div className="inline-error">{errors.description}</div>}
        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      {/* Images */}
      <div className="section-heading">Images</div>
      <div className="upload-info">{images.length} image(s) selected</div>
      <div className="media-grid">
        {images.map((image, index) => (
          <div key={index} className="media-item">
            <img src={image} alt={`Upload ${index + 1}`} className="preview-image" />
            <button type="button" onClick={() => removeImage(index)} className="remove-button" aria-label="Remove image">
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

      {/* Videos */}
      <div className="section-heading">Videos</div>
      <div className="upload-info">{videos.length} video(s) selected</div>
      <div className="media-grid">
        {videos.map((video, index) => (
          <div key={index} className="media-item">
            <video src={video} controls className="preview-video" />
            <button type="button" onClick={() => removeVideo(index)} className="remove-button" aria-label="Remove video">
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

      {/* Submit button */}
      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? (
          <>
            <Upload className="spinner" size={20} />
            Processing...
          </>
        ) : (
          postToEdit ? 'Update Post' : 'Publish Post'
        )}
      </button>
    </form>
  );
};

export default PostForm;

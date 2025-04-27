// PostForm.js
import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Upload, X, Image as ImageIcon, Video, Smile } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPost, updatePost } from '../services/api';
import './PostForm.css';

const PostForm = ({ postToEdit, onSuccess }) => {
  // Keep all existing state and logic unchanged
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [category, setCategory] = useState(postToEdit?.postType || 'Programming');
  const [description, setDescription] = useState(postToEdit?.description || '');
  const [images, setImages] = useState(postToEdit?.images || []);
  const [videos, setVideos] = useState(postToEdit?.videos || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Keep all handler functions unchanged
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
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

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
    <form onSubmit={handleSubmit} className="neon-form">
      <h2 className="neon-form-title">{postToEdit ? 'EDIT POST' : 'CREATE NEW POST'}</h2>

      <div className="neon-form-group">
        <label htmlFor="title" className="neon-label">
          TITLE *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="neon-input"
          required
        />
      </div>

      <div className="neon-form-group">
        <label htmlFor="category" className="neon-label">
          CATEGORY
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="neon-select"
        >
          <option value="Programming">PROGRAMMING</option>
          <option value="Cooking">COOKING</option>
          <option value="Photography">PHOTOGRAPHY</option>
        </select>
      </div>

      <div className="neon-form-group">
        <label htmlFor="description" className="neon-label">
          DESCRIPTION *
        </label>
        <div className="neon-textarea-container">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="neon-textarea"
            required
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="neon-emoji-button"
          >
            <Smile size={20} />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="neon-emoji-picker">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      <div className="neon-form-group">
        <label className="neon-label">IMAGES</label>
        <div className="neon-media-grid">
          {images.map((image, index) => (
            <div key={index} className="neon-media-item">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="neon-preview-image"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="neon-remove-button"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="neon-upload-button"
        >
          <ImageIcon size={20} />
          UPLOAD IMAGES
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="neon-hidden-input"
        />
      </div>

      <div className="neon-form-group">
        <label className="neon-label">VIDEOS</label>
        <div className="neon-media-grid">
          {videos.map((video, index) => (
            <div key={index} className="neon-media-item">
              <video
                src={video}
                controls
                className="neon-preview-video"
              />
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="neon-remove-button"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="neon-upload-button"
        >
          <Video size={20} />
          UPLOAD VIDEOS
        </button>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          className="neon-hidden-input"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="neon-submit-button"
      >
        {isSubmitting ? (
          <>
            <Upload className="neon-spinner" size={20} />
            PROCESSING...
          </>
        ) : (
          'PUBLISH POST'
        )}
      </button>
    </form>
  );
};

export default PostForm;
import React, { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import '../styles/Feed.css';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await postService.getAllPosts();
                setPosts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load posts');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div className="loading">Loading posts...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="feed-container">
            <h1>Feed</h1>
            <div className="posts-grid">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <h2>{post.title}</h2>
                        <p className="post-description">{post.description}</p>
                        <div className="post-media">
                            {post.images && post.images.map((image, index) => (
                                <img key={index} src={image} alt={`Post ${index + 1}`} />
                            ))}
                        </div>
                        <div className="post-footer">
                            <span className="post-type">{post.postType}</span>
                            <span className="post-date">
                                {new Date(post.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feed; 
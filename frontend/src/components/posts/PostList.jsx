// import { useEffect, useState } from 'react';
// import {
//   Pencil, Trash2, RefreshCw, Video, Calendar, User, Eye
// } from 'lucide-react';
// import { getPosts, deletePost } from '../services/api';
// import toast from 'react-hot-toast';
// import './PostList.css'; // Assuming you have some CSS for styling

// const PostList = ({ onEdit }) => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchPosts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getPosts();
//       setPosts(response.data);
//     } catch (error) {
//       setError('Failed to fetch posts. Please try again.');
//       toast.error('Failed to fetch posts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deletePost(id);
//       setPosts(posts.filter(post => post.id !== id));
//       toast.success('Post deleted successfully');
//     } catch (error) {
//       toast.error('Failed to delete post');
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 animate-pulse text-gray-500">
//         <RefreshCw className="animate-spin" size={24} />
//         <p className="ml-3">Loading posts...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 text-center">
//         <p className="text-red-500 mb-4 font-medium">{error}</p>
//         <button 
//           onClick={fetchPosts} 
//           className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-10 bg-gray-900 text-white rounded-lg shadow-lg">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-bold text-cyan-400 neon-text">📌 All Posts</h2>
//         <button
//           onClick={fetchPosts}
//           className="flex items-center bg-cyan-700 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md transition duration-300"
//         >
//           <RefreshCw size={16} className="mr-2" />
//           Refresh
//         </button>
//       </div>

//       {posts.length === 0 ? (
//         <div className="text-center py-12 text-gray-400 text-lg">No posts found. Create your first post!</div>
//       ) : (
//         <div className="overflow-x-auto rounded-lg shadow border border-cyan-700">
//           <table className="min-w-full bg-gray-800 text-gray-200">
//             <thead className="bg-cyan-700">
//               <tr>
//                 {['Title', 'Description', 'Images', 'Videos', 'Author', 'Date', 'Views', 'Category', 'Actions'].map((col) => (
//                   <th
//                     key={col}
//                     className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-cyan-200"
//                   >
//                     {col}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-cyan-800">
//               {posts.map((post) => (
//                 <tr key={post.id} className="hover:bg-cyan-800 transition">
//                   <td className="px-6 py-4 font-medium text-cyan-300">{post.title}</td>
//                   <td className="px-6 py-4 text-gray-400 max-w-xs line-clamp-2">{post.description}</td>
//                   <td className="px-6 py-4">
//                     {post.images?.length ? (
//                       <div className="grid grid-cols-2 gap-2">
//                         {post.images.map((image, idx) => (
//                           <img
//                             key={idx}
//                             src={image}
//                             alt={`Post image ${idx + 1}`}
//                             className="w-14 h-14 object-cover rounded-md shadow-md border border-cyan-500"
//                           />
//                         ))}
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-500">No images</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     {post.videos?.length ? (
//                       <div className="flex items-center text-sm text-cyan-300">
//                         <Video size={16} className="mr-1 text-cyan-400" />
//                         {post.videos.length} videos
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-500">No videos</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center text-sm text-cyan-300">
//                       <User size={16} className="mr-2 text-cyan-400" />
//                       User {post.userId}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-cyan-300">
//                     <div className="flex items-center">
//                       <Calendar size={16} className="mr-2 text-cyan-400" />
//                       {formatDate(post.timestamp)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-cyan-300">
//                     <div className="flex items-center">
//                       <Eye size={16} className="mr-2 text-cyan-400" />
//                       {post.visibilityCount}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className="inline-block px-3 py-1 text-xs font-semibold bg-cyan-700 text-cyan-100 rounded-full">
//                       {post.postType}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-right">
//                     <div className="flex space-x-3 justify-end">
//                       <button
//                         onClick={() => onEdit(post)}
//                         className="text-cyan-400 hover:text-cyan-200 transition"
//                         title="Edit"
//                       >
//                         <Pencil size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(post.id)}
//                         className="text-red-500 hover:text-red-300 transition"
//                         title="Delete"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostList;
// PostList.js
import { useEffect, useState } from 'react';
import {
  Pencil, Trash2, RefreshCw, Video, Calendar, User, Eye
} from 'lucide-react';
import { getPosts, deletePost } from '../services/api';
import toast from 'react-hot-toast';
import './PostList.css';

const PostList = ({ onEdit }) => {
  // Keep all the existing state and logic the same
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      setError('Failed to fetch posts. Please try again.');
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  if (loading) {
    return (
      <div className="neon-loading-container">
        <RefreshCw className="animate-spin" size={24} />
        <p className="neon-loading-text">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neon-error-container">
        <p className="neon-error-text">{error}</p>
        <button 
          onClick={fetchPosts} 
          className="neon-retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="neon-container">
      <div className="neon-header">
        <h2 className="neon-title">📌 ALL POSTS</h2>
        <button
          onClick={fetchPosts}
          className="neon-button-refresh"
        >
          <RefreshCw size={16} className="mr-2" />
          REFRESH
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="neon-empty">NO POSTS FOUND. CREATE YOUR FIRST POST!</div>
      ) : (
        <div className="neon-table-container">
          <table className="neon-table">
            <thead className="neon-thead">
              <tr>
                {['TITLE', 'DESCRIPTION', 'MEDIA', 'AUTHOR', 'DATE', 'VIEWS', 'CATEGORY', 'ACTIONS'].map((col) => (
                  <th
                    key={col}
                    className="neon-th"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="neon-tbody">
              {posts.map((post) => (
                <tr key={post.id} className="neon-tr hover:neon-row">
                  <td className="neon-td neon-accent">{post.title}</td>
                  <td className="neon-td neon-description">{post.description}</td>
                  <td className="neon-td">
                    <div className="neon-media-container">
                      {post.images?.slice(0, 2).map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Post ${idx + 1}`}
                          className="neon-image"
                        />
                      ))}
                      {post.videos?.length > 0 && (
                        <div className="neon-video-indicator">
                          <Video size={16} />
                          <span>{post.videos.length}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="neon-td">
                    <div className="neon-user">
                      <User size={16} />
                      <span>USER_{post.userId}</span>
                    </div>
                  </td>
                  <td className="neon-td">
                    <div className="neon-date">
                      <Calendar size={16} />
                      {formatDate(post.timestamp)}
                    </div>
                  </td>
                  <td className="neon-td">
                    <div className="neon-views">
                      <Eye size={16} />
                      {post.visibilityCount}
                    </div>
                  </td>
                  <td className="neon-td">
                    <span className="neon-badge">{post.postType}</span>
                  </td>
                  <td className="neon-td">
                    <div className="neon-actions">
                      <button onClick={() => onEdit(post)}>
                        <Pencil size={18} className="neon-edit" />
                      </button>
                      <button onClick={() => handleDelete(post.id)}>
                        <Trash2 size={18} className="neon-delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostList;
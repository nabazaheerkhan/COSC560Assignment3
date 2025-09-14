import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch posts if user is logged in
    if (user) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll();
      setPosts(response.posts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(id);
        // Update local state without re-fetching
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      } catch (err) {
        setError('Failed to delete post');
        console.error('Error deleting post:', err);
      }
    }
  };

  // If no user is logged in, show login message
  if (!user) {
    return (
      <div className="text-center py-5">
        <h2>Welcome to the Blog</h2>
        <p className="lead text-muted mb-4">
          Please login to see and manage blog posts
        </p>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert variant="danger" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Blog Posts</h1>
        <Button variant="primary" onClick={() => navigate('/post/create')}>
          Create New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <Alert variant="info">
          No posts available. Create your first post!
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <strong>{post.title}</strong>
                  </td>
                  <td>
                    {post.content && post.content.length > 100
                      ? `${post.content.substring(0, 100)}...`
                      : post.content || 'No content'}
                  </td>
                  <td>{post.user.name}</td>
                  <td>{post.category.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        post.is_active === 'Yes' ? 'bg-success' : 'bg-secondary'
                      }`}
                    >
                      {post.is_active === 'Yes' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/post/${post.id}`)}
                      >
                        View
                      </Button>
                      {(user.id === post.user_id || user.is_admin) && (
                        <>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => navigate(`/post/edit/${post.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PostsList;

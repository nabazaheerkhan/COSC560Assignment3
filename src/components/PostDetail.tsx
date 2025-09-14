import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Badge } from 'react-bootstrap';
import { Post } from '../types';
import { postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      setLoading(true);
      const response = await postsAPI.getById(postId);
      setPost(response.post);
      setError(null);
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(post.id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete post');
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return (
      <Alert variant="danger">
        {error || 'Post not found'}
        <div className="mt-3">
          <Button variant="primary" className="me-2" onClick={() => navigate('/')}>
            Back to Posts
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-3">
                  <Button variant="outline-secondary" onClick={() => navigate('/')}>
            ← Back to Posts
          </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <Card.Title className="h2">{post.title}</Card.Title>
              <div className="text-muted mb-2">
                <span>By {post.user.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <Badge bg={post.is_active === 'Yes' ? 'success' : 'secondary'}>
              {post.is_active}
            </Badge>
          </div>

          <div className="mb-3">
            <Badge bg="info" className="me-2">
              {post.category.name}
            </Badge>
          </div>

          <Card.Text className="lead">
            {post.content || 'No content available'}
          </Card.Text>

          {user && (user.id === post.user_id || user.is_admin) && (
            <div className="mt-4 pt-3 border-top">
              <h5>Actions</h5>
              <div className="d-flex gap-2">
                                          <Button
                            variant="warning"
                            onClick={() => navigate(`/post/edit/${post.id}`)}
                          >
                            Edit Post
                          </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  Delete Post
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PostDetail;

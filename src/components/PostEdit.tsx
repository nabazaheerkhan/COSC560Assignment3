import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Post, Category, UpdatePostData } from '../types';
import { postsAPI, categoriesAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const PostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<UpdatePostData>({
    title: '',
    content: '',
    category_id: 0,
    is_active: 'Yes',
  });
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
      fetchCategories();
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      setPostLoading(true);
      const response = await postsAPI.getById(postId);
      const postData = response.post;
      setPost(postData);
      setFormData({
        title: postData.title,
        content: postData.content || '',
        category_id: postData.category_id,
        is_active: postData.is_active,
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setPostLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.categories);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category_id' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !formData.title.trim() || !formData.category_id) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await postsAPI.update(parseInt(id), formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update post');
      console.error('Error updating post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (postLoading || categoriesLoading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return (
      <Alert variant="danger">
        {error || 'Post not found'}
        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Posts
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit Post</h1>
        <Button variant="outline-secondary" onClick={() => navigate('/')}>
          Back to Posts
        </Button>
      </div>

      <Card>
        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                maxLength={50}
                required
              />
              <Form.Text className="text-muted">
                Maximum 50 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter post content"
                rows={6}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="is_active"
                value={formData.is_active}
                onChange={handleInputChange}
              >
                <option value="Yes">Active</option>
                <option value="No">Inactive</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Post'}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PostEdit;

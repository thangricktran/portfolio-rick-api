const express = require('express');
const router = express.Router();

const { checkJwt, checkRole } = require('../controllers/auth');

const { 
  getBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  getBlogsByUser
} = require('../controllers/blogs');

router.get('/api/v1/blogs', getBlogs);
router.get('/api/v1/blogs/me', checkJwt, checkRole('admin'), getBlogsByUser);
router.get('/api/v1/blogs/:id', getBlogById);
router.get('/api/v1/blogs/s/:slug', getBlogBySlug);

router.post('/api/v1/blogs', checkJwt, checkRole('admin'), createBlog);
router.patch('/api/v1/blogs/:id', checkJwt, checkRole('admin'), updateBlog);

module.exports = router;
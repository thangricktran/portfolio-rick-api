const slugify = require('slugify');
const uniqueSlug = require('unique-slug');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const { getAccessToken, getAuth0User } = require('./auth');

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find({status: 'published'}).sort({createdAt: -1});
  const { access_token: accessToken } = await getAccessToken();

  const blogsWithUsers = [];
  const authors = {};
  for (let blog of blogs) {
    const author = authors[blog.userId] || await getAuth0User(accessToken)(blog.userId);
    authors[author.user_id] = author;
    blogsWithUsers.push({blog, author});
  }
  // console.log("blogs controller getBlogs() authors object: \n", authors);
  return res.json(blogsWithUsers);
};

exports.getBlogsByUser = async (req, res) => {
  const userId = req.user.sub;
  try {
    const blogs = await Blog.find({
      userId,
      status: { $in: ['draft', 'published'] }
    });
    return res.json(blogs);    
  } catch (error) {
    return res.status(404).json({error: { message: error.message} });    
  }
};

exports.getBlogById = async (req, res) => {
  // console.log("getBlogById: ", req.params.id);
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({error: { message: 'Not Found'} });
    }
    return res.json(blog); 
  } catch (error) {
    // DO NOT use this error message: error.message
    return res.status(400).json({error: { message: 'API Error'} });
  }
};

exports.getBlogBySlug = async (req, res) => {
  // console.log("getBlogBySlug(): req.params.slug:\n", req.params.slug);
  try {
    const blog = await Blog.findOne({slug: req.params.slug});

    if (!blog) {
      return res.status(404).json({error: { message: 'Not Found'} });
    }

    const { access_token: accessToken } = await getAccessToken();
    const author = await getAuth0User(accessToken)(blog.userId);

    // blog.user = user;
    return res.json({blog, author}); 

  } catch (error) {
    // DO NOT use this error message: error.message
    return res.status(400).json({error: { message: 'API Error'} });
  }
};

exports.createBlog = async (req, res) => {
  const blogData = req.body;
  const userId = req.user.sub;
  const blog = new Blog(blogData);
  blog.userId = userId;
  
  try {
    const newBlog = await blog.save();
    // console.log("Data after saved: ", newBlog);
    return res.json(newBlog);
  } catch (error) {
    // return res.status(422).json({error: { message: 'API Error'} });
    console.log("createBlog error.message: \n", error.message);
    return res.status(422).send(error.message);
  }
}

const _saveBlog = async blog => {
  try {
    const createdBlog = await blog.save();
    return createdBlog;
  } catch (e) {
    if (e.code === 11000 && e.keyPattern && e.keyPattern.slug) {
       blog.slug += `-${uniqueSlug()}`;
       return _saveBlog(blog);
    }

    throw(e);
  }
}

exports.updateBlog = async (req, res) => {
  const { body, params: {id} } = req;

  Blog.findById(id, async (error, blog) => {
    if (error) {
      return res.status(422).send(error.message);
    }

    if (body.status && body.status === 'published' && !blog.slug) {
      blog.slug = slugify(blog.title, {
        replacement: '-', 
        lower: true,
        locale: 'en'
      });
    }

    blog.set(body); // This DOES NOT saving to database.
    blog.updatedAt = new Date();

    try {
      const updatedBlog = await _saveBlog(blog);

      // console.log("In Node API, Data Blog after updated: \n", updatedBlog);

      return res.json(updatedBlog);
    } catch (err) {
      return res.status(422).send(err.message);
    }  
  });
}
/*
exports.deleteBlog = async (req, res) => {

  try {
    const blog = 
      await Blog.findOneAndRemove({_id: req.params.id});
    console.log("In Node API, Data after deletion: \n", blog);
    return res.status(200).json({_id: blog._id});
  } catch (error) {
    return res.status(422).send(error.message);
  }
}
*/

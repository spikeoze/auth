const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      where: {
        user_id: parseInt(req.user.id),
      },
    });

    res.status(200).json( posts );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get posts" });
  }
};

async function createPost(req, res) {
  try {
    // Get the title and content from the request body
    const { title, content } = req.body;

    // Create a new post with the authenticated user as the author
    const post = await prisma.posts.create({
      data: {
        title,
        content,
        author: { connect: { id: req.user.id } },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
}

async function updatePost(req, res) {
  try {
    // Get the post id from the request params
    const id = parseInt(req.params.id);
    // Get the title and content from the request body
    const { title, content } = req.body;

    // Find the post by id
    let post = await prisma.posts.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Make sure only the author can update the post
    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update the post
    post = await prisma.posts.update({
      where: { id },
      data: { title, content },
    });

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
}

async function deletePost(req, res) {
  try {
    // Get the post id from the request params
    const id = parseInt(req.params.id);

    // Get the title and content from the request body
    const { title, content } = req.body;

    // Find the post by id
    let post = await prisma.posts.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Make sure only the author can update the post
    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update the post
    post = await prisma.posts.delete({
      where: { id },
    });

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
}

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};

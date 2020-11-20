const database = require('../database');

module.exports = async () => {
  try {
    const posts = await database.Post.find();
    return {
      data: posts,
      error: null,
      isError: false,
    }
  } catch (error) {
    return {
      data: null,
      error,
      isError: true,
    }
  }
};

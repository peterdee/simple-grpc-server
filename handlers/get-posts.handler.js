const database = require('../database');

module.exports = async () => {
  try {
    const posts = await database.Post.find().sort({ _id: -1 });
    return {
      data: posts,
      error: null,
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      error,
      isError: true,
    };
  }
};

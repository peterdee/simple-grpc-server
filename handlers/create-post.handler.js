const database = require('../database');

module.exports = async (data) => {
  try {
    const records = await database.Post.find().sort({ _id: 1 });
    if (records.length >= 10) {
      await database.Post.deleteOne({ _id: records[0]._id });
    }

    const now = String(Date.now());
    const record = new database.Post({
      text: data.text,
      title: data.title,
      created: now,
      updated: now,
    });
    await record.save();

    return {
      data: record,
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

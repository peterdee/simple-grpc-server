const database = require('../database');

module.exports = async (data) => {
  try {
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

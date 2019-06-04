// const moment = require("moment");

const formatTimestampedData = data => {
  if (data.length === 0) return [];
  let dateFormattedData = [];

  for (let i = 0; i < data.length; i++) {
    dateFormattedData[i] = {};
    for (key in data[i]) {
      dateFormattedData[i][key] = data[i][key];
      let dateToFormat = new Date(data[i]["created_at"]);
      let dateString = dateToFormat.toISOString();
      // let dateString = moment(dateToFormat).format("YYYY-MM-DD");
      data[i]["created_at"] = dateString;
    }
  }
  return dateFormattedData;
};

const createArticleRef = articles => {
  if (!articles.length) return {};
  const ref = {};
  for (let i = 0; i < articles.length; i++) {
    ref[articles[i].title] = articles[i].article_id;
  }
  return ref;
};

const formatComments = (comments, articleIdRef) => {
  let timeFormattedComments = formatTimestampedData(comments);
  if (!timeFormattedComments.length) return [];
  let result = [];
  timeFormattedComments.map(comment => {
    const { belongs_to, created_by, ...restOfComment } = comment;
    const article_id = articleIdRef[belongs_to];
    const author = comment.created_by;
    result.push({ ...restOfComment, article_id, author });
  });
  return result;
};

module.exports = { formatTimestampedData, createArticleRef, formatComments };

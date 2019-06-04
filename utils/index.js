// const moment = require("moment");

exports.formatArticles = articles => {
  if (articles.length === 0) return [];
  let formattedArticles = [];

  for (let i = 0; i < articles.length; i++) {
    formattedArticles[i] = {};
    for (key in articles[i]) {
      formattedArticles[i][key] = articles[i][key];
      // formattedArticles[i]["article_id"] = i + 1;
      // formattedArticles[i]["votes"] = 0;
      let dateToFormat = new Date(articles[i]["created_at"]);
      let dateString = dateToFormat.toISOString().slice(0, 10);
      // let dateString = moment(dateToFormat).format("YYYY-MM-DD");
      articles[i]["created_at"] = dateString;
    }
  }
  return formattedArticles;
};

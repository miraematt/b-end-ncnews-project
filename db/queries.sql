\c ncnews_test

-- SELECT articles.*, COUNT(title) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id;

;

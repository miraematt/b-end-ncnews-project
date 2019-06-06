\c ncnews_test

SELECT articles.*, COUNT(title) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id;

-- "article_id": 1,
--     "title": "Running a Node App",
--     "body": "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
--     "votes": 0,
--     "topic": "coding",
--     "author": "jessjelly",
--     "created_at": "2016-08-18T12:07:52.389Z"
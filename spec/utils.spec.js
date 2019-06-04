const {
  formatTimestampedData,
  createArticleRef,
  formatComments
} = require("../utils/index");
const { expect } = require("chai");

describe("formatTimestampedData", () => {
  it("returns an empty array when passed an empty array", () => {
    const articles = [];
    const actualResult = formatTimestampedData(articles);
    const expectedResult = [];
    expect(actualResult).to.eql(expectedResult);
  });
  it("each new article is a new object", () => {
    const articles = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: "2016-08-18T12:07:52.389Z"
      }
    ];
    const actualResult = formatTimestampedData(articles);
    expect(actualResult[0]).to.not.equal(articles[0]);
  });
  it("returns an array containing an object with the required keys when given an array of one object", () => {
    const articles = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: "2016-08-18T12:07:52.389Z"
      }
    ];
    const actualResult = formatTimestampedData(articles);

    expect(actualResult[0]).to.contain.keys(
      "title",
      "topic",
      "author",
      "body",
      "created_at"
    );
  });
  it("returns an array containing an object with the required keys when given an array of two objects", () => {
    const articles = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 1500584273256
      }
    ];
    const actualResult = formatTimestampedData(articles);

    expect(actualResult[0]).to.contain.keys(
      "title",
      "topic",
      "author",
      "body",
      "created_at"
    );
    expect(actualResult[1]).to.contain.keys(
      "title",
      "topic",
      "author",
      "body",
      "created_at"
    );
  });
  it("returns an array containing an object with the required keys and the date converted to YYY-MM-DD", () => {
    const articles = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1471522072389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: 1500584273256
      }
    ];
    const actualResult = formatTimestampedData(articles);
    const expectedResult = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: "2016-08-18T12:07:52.389Z"
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        created_at: "2017-07-20T20:57:53.256Z"
      }
    ];
    expect(actualResult).to.eql(expectedResult);
  });
});

describe("createArticleRef", () => {
  it("returns and empty object when passed and empty array", () => {
    const articles = [];
    const actualResult = createArticleRef(articles);
    const expectedResult = {};
    expect(actualResult).to.eql(expectedResult);
  });
  it("creates an object containing title as a key and article_id as its value", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actualResult = createArticleRef(articles);
    const expectedResult = { "Living in the shadow of a great man": 1 };
    expect(actualResult).to.eql(expectedResult);
  });
  it("creates an object containing multiple titles as a key and the article_ids as their values", () => {
    const articles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const actualResult = createArticleRef(articles);
    const expectedResult = {
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 2
    };
    expect(actualResult).to.eql(expectedResult);
  });
});

describe.only("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    const comments = [];
    const ref = {};
    const actualResult = formatComments(comments, ref);
    const expectedResult = [];
    expect(actualResult).to.eql(expectedResult);
  });
  it("each new comment is a new object", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const actualResult = formatComments(comments, ref);
    expect(actualResult[0]).to.not.equal(comments[0]);
  });
  it("returns an array containing an object with the date converted to YYY-MM-DD by formatTimestampData function", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const actualResult = formatComments(comments, ref);
    const expectedResult = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: "2017-11-22T12:36:03.389Z"
      }
    ];
    expect(actualResult).to.eql(expectedResult);
  });

  it("each new comment contains all correct keys", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const actualResult = formatComments(comments, ref);
    expect(actualResult[0]).to.contain.keys(
      "author",
      "article_id",
      "votes",
      "created_at",
      "body"
    );
  });
  it("replaces belongs_to key with article_id in one comment", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const actualResult = formatComments(comments, ref);
    const expectedResult = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: "2017-11-22T12:36:03.389Z"
      }
    ];
    expect(actualResult).to.eql(expectedResult);
  });
  // it("replaces owner key with owner_id in multiple shops", () => {
  //   const shops = [
  //     { shop_name: "antshop", owner: "ant", slogan: "behappy" },
  //     { shop_name: "mitchshop", owner: "mitch", slogan: "havefun" }
  //   ];
  //   const ref = { ant: 1, mitch: 2 };
  //   const actualResult = formatShops(shops, ref);
  //   const expectedResult = [
  //     { shop_name: "antshop", owner_id: 1, slogan: "behappy" },
  //     { shop_name: "mitchshop", owner_id: 2, slogan: "havefun" }
  //   ];
  //   reasure[shop];
  //   expect(actualResult).to.eql(expectedResult);
  // });
});

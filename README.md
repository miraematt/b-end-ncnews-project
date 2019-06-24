# NorthCoders News API Project

The aim of this project is to build the API to use in the Northcoders News Sprint during the subsequent Front-End block of the NorthCoders course. The database is in PSQL and I have interacted with it using Knex. The seeding of the database was achieved using full TDD with mocha and chai and the endpoints were created using test-driven error handling with the aid of supertest.

## Getting Started (for testing purposes)

What you will need to do to get this project to run on your computer:

Fork or clone the repository from github.

Install npm from the terminal when within the ncnews folder.

```
npm install
```

You will need to set up your own knexfile.js file.

```
npm install knex pg --save
```

Then create the file with the following contents:

```
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfigs = {
  development: {
    connection: {
      database: "ncnews"
      // username: "",
      // password: "",
    }
  },
  test: {
    connection: {
      database: "ncnews_test"
      // username: "",
      // password: "",
    }
  }
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
```

Open the project on local host which can be viewed using Insomnia while not yet hosted.

```
npm start
```

or by using nodemon:

```
npm install nodemon
npm run dev
```

View the JSON outputs of all possible endpoints of the api using the '/api' route.

## Running the tests

You will need to install mocha, chai and supertest to run all of the tests available.

```
npm install mocha chai -D
npm install chai-sorted -D
npm install supertest
```

Then to run all of the tests in the spec files type:

```
npm test
```

The tests in the app.spec.js file are to ensure that each endpoint of the API returns the correct JSON data and gives appropriate errors when incorrect input is received. The tests in the utils.spec.js file are to ensure that the functions involved in the seeding process that populates the database are running correctly.

## Deployment

This project is deployed on the heroku platform.

https://mattsncnewsproject.herokuapp.com/api/

/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-const */
const qs = require('qs');

class APIFeatures {
  constructor(query, queryString, rawQueryString) {
    this.query = query; // Mongoose query object
    this.queryString = queryString; // Usually req.query
    this.rawQueryString = rawQueryString; // Usually req._parsedUrl.query
  }

  filter() {
    // 1) Basic Filtering
    let queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    queryObj = qs.parse(this.rawQueryString);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let queryObject = JSON.parse(queryStr);
    // Convert numeric strings to numbers, especially for operator values
    function convertValuesToNumbers(obj) {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // If it's an object (like {"$gte": "5"}), recurse
          convertValuesToNumbers(obj[key]);
        } else if (
          typeof obj[key] === 'string' &&
          !Number.isNaN(Number(obj[key]))//is key is a string and not a number 
        ) {
          // If it's a string that can be converted to a number, convert it
          obj[key] = Number(obj[key]);
        }
      });
    }
    convertValuesToNumbers(queryObject);

    console.log(queryObject);
    this.query = this.query.find(queryObject);

    return this; // Enable chaining
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this; // Enable chaining
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this; // Enable chaining
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this; // Enable chaining
  }
}

module.exports = { APIFeatures };

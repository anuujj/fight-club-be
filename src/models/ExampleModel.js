const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const ExampleModel = mongoose.model('Example', exampleSchema);

module.exports = ExampleModel;

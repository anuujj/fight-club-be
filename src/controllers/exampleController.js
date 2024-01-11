const ExampleModel = require('../models/ExampleModel');

const exampleController = {
  getAllExamples: async (req, res) => {
    try {
      const examples = await ExampleModel.find();
      res.json(examples);
    } catch (error) {
      console.error('Error fetching examples:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createExample: async (req, res) => {
    const { name, description } = req.body;

    try {
      const newExample = new ExampleModel({ name, description });
      const savedExample = await newExample.save();
      res.status(201).json(savedExample);
    } catch (error) {
      console.error('Error creating example:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = exampleController;

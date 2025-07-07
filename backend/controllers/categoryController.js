const Category = require('../models/Category');

const categoryController = {
  // Get all categories for a user
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({ userId: req.user.userId });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new category
  createCategory: async (req, res) => {
    try {
      const { name, type, color } = req.body;
      const category = new Category({
        userId: req.user.userId,
        name,
        type,
        color
      });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update category
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete category
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
      });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json({ message: 'Category deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = categoryController; 
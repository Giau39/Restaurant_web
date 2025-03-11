const fs = require("fs");
const path = require("path");
const Category = require("../models/Category");

const addCategory = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  if (!req.body.name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  let imagePath = req.file.path.substring(req.file.path.lastIndexOf("\\images") + 1);
  //let imagePath = req.file.path.replace(/^uploads[\\/]/, "");

  console.log("File path:", req.file.path);

  let name = req.body.name;

  try {
    const category = await Category.create({
      name: name,
      image: imagePath,
    });
    console.log(category);
    res.status(201).json({
      category: category,
      message: "Category Added Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Could not add category, try again" });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json({ categories: cats });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not get all categories, try again later" });
  }
};

const updateCategory = async (req, res) => {
  try {
    let path;
    let name = req.body.name;
    let cat;
    if (req.file) {
      path = req.file.path.substring(req.file.path.lastIndexOf("\\images") + 1);

      cat = await Category.findByIdAndUpdate(req.params.id, {
        name,
        image: path,
      });
    } else {
      cat = await Category.findByIdAndUpdate(req.params.id, {
        name,
      });
    }

    if (cat) {
      res
        .status(200)
        .json({ category: cat, message: "Category updated successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong when updating category" });
  }
};

const getCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (cat) {
      res.status(200).json({ category: cat });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    res.status(500).json({
      errors: err,
      message: "Something went wrong when getting category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (cat) {
      const imageName = cat.image.substring(7);

      fs.unlinkSync(path.join(__dirname, "../uploads/images/" + imageName));
      res
        .status(200)
        .json({ category: cat, message: "Category Deleted Successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors: err,
      message: "Something went wrong when deleting category",
    });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory,
  getCategory,
  deleteCategory,
};

const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const { requireAdmin } = require("../middleware/AuthMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: storage });

/*
    --> POST requests
*/
router.post("/", requireAdmin, upload.single("image"), CategoryController.addCategory);

/*
    --> GET requests
*/
router.get("/", requireAdmin, CategoryController.getAllCategories);
router.get("/:id", requireAdmin, CategoryController.getCategory);

/*
    --> PUT requests
*/

router.put("/:id", requireAdmin, upload.single("image"), CategoryController.updateCategory);

/*
    --> DELETE requests
*/

router.delete("/:id", requireAdmin, CategoryController.deleteCategory);

module.exports = router;

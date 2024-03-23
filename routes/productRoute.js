const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  createProduct,
} = require("../controllers/productController");
const { getAllReviewsByProduct } = require("../controllers/reviewController");

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions("admin"), createProduct);
router.route("/uploadImage").post(authenticateUser, authorizePermissions('admin'), uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermissions("admin"), deleteProduct);

  router.route('/:id/reviews').get(getAllReviewsByProduct); //duplicated in the reviewsroute

module.exports = router;

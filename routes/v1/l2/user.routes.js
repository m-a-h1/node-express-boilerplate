const express = require("express");
const userController = require("../../../controllers/userController");
const authController = require("../../../controllers/authController");
const { signUp, signIn, forgotPassword, resetPassword, updatePassword, updateMe } = require("../../../validations/user.validation");
const { validate } = require("../../../middlewares/validate");
const { uploader } = require("../../../middlewares/uploadFile");

const router = express.Router();

router.post("/signup", validate(signUp), authController.signup);
router.post("/login", validate(signIn), authController.login);

router.post("/forgotPassword", validate(forgotPassword), authController.forgotPassword);
router.patch("/resetPassword/:token", validate(resetPassword), authController.resetPassword);

router.use(authController.protect, authController.restrictTo(["admin"]));

router.patch("/updateMyPassword", validate(updatePassword), authController.updatePassword);

router.patch("/updateMe", validate(updateMe), uploader, userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);
router.get("/getMe", userController.getMe);

module.exports = router;

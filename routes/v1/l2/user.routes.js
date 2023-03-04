const express = require("express");
const j2s = require("joi-to-swagger");
const userController = require("../../../controllers/userController");
const authController = require("../../../controllers/authController");
const { signUp, signIn, forgotPassword, resetPassword, updatePassword, updateMe } = require("../../../validations/user.validation");
const { validate } = require("../../../middlewares/validate");
const { uploader } = require("../../../middlewares/uploadFile");

const router = express.Router();

const { swagger, components } = j2s(signUp);
console.log(">>>>> swagger: ", swagger);

/**
 * @swagger
 * /api/v1/l2/user/signup:
 *   post:
 *     summary: signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signup'
 *     responses:
 *       '200':
 *         description: signup.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/signup'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     signup:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - password
 *         - confirmPassword
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         password:
 *           type: string
 *         confirmPassword:
 *           type: string
 */

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

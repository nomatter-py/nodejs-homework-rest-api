const express = require("express");

const validateBody = require("../../middlewares/contactValidation");
const upload = require("../../middlewares/upload");
const auth = require("../../middlewares/auth");

const { ctrlWrapper } = require("../../helpers");

const {
  registerSchema,
  loginSchema,
  updateSubcriptionSchema,
  verifyEmailSchema,
} = require("../../validation/schema");

const ctrl = require("../../controllers/auth");

const router = express.Router();

// signup
router.post(
  "/signup",
  validateBody(registerSchema),
  ctrlWrapper(ctrl.register)
);

router.get("/verify/:verificationToken", ctrlWrapper(ctrl.verify));

router.post("/verify", validateBody(verifyEmailSchema), ctrlWrapper(ctrl.resendVerify))

// signin
router.post("/login", validateBody(loginSchema), ctrlWrapper(ctrl.login));

router.get("/current", auth, ctrlWrapper(ctrl.getCurrent));

router.get("/logout", auth, ctrlWrapper(ctrl.logout));

router.patch(
  "/subscription",
  auth,
  validateBody(updateSubcriptionSchema),
  ctrlWrapper(ctrl.updateSubscription)
);

router.patch("/avatars", auth, upload.single("avatar"), ctrlWrapper(ctrl.updateAvatar));

module.exports = router;

const express = require("express");
const {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateFavorite,
} = require("../../controllers/contacts");
const validateBody = require("../../middlewares/contactValidation");
const auth = require("../../middlewares/auth");
const { ctrlWrapper } = require("../../helpers");
const {
  contactSchema,
  contactUpdateFavoriteSchema,
} = require("../../validation/schema");
const router = express.Router();

router.get("/", auth, ctrlWrapper(getContacts));

router.get("/:contactId", auth, ctrlWrapper(getContactById));

router.post("/", auth, validateBody(contactSchema), ctrlWrapper(createContact));

router.delete("/:contactId", auth, ctrlWrapper(deleteContact));

router.put(
  "/:contactId",
  auth,
  validateBody(contactSchema),
  ctrlWrapper(updateContact)
);

router.patch(
  "/:contactId/favorite",
  auth,
  validateBody(contactUpdateFavoriteSchema),
  ctrlWrapper(updateFavorite)
);

module.exports = router;

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
const { ctrlWrapper } = require("../../helpers");
const {
  contactSchema,
  contactUpdateFavoriteSchema,
} = require("../../validation/schema");
const router = express.Router();

router.get("/", ctrlWrapper(getContacts));

router.get("/:contactId", ctrlWrapper(getContactById));

router.post("/", validateBody(contactSchema), ctrlWrapper(createContact));

router.delete("/:contactId", ctrlWrapper(deleteContact));

router.put(
  "/:contactId",
  validateBody(contactSchema),
  ctrlWrapper(updateContact)
);

router.patch(
  "/:contactId/favorite",
  validateBody(contactUpdateFavoriteSchema),
  ctrlWrapper(updateFavorite)
);

module.exports = router;

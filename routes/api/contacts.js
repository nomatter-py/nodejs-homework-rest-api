const express = require('express');
const {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} = require("../../controllers/contacts");
const validateBody = require("../../middlewares/contactValidation");
const { ctrlWrapper } = require("../../helpers");
const contactSchema = require("../../validation/schema");
const router = express.Router();

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId', ctrlWrapper(getContactById));

router.post('/', validateBody(contactSchema), ctrlWrapper(createContact));

router.delete('/:contactId', ctrlWrapper(deleteContact));

router.put('/:contactId', validateBody(contactSchema), ctrlWrapper(updateContact));


module.exports = router

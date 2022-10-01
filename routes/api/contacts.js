const express = require('express');
const {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} = require("../../controllers/contacts");
const { contactValidation } = require("../../middlewares/contactValidation");
const router = express.Router();

router.get('/', getContacts)

router.get('/:contactId', getContactById);

router.post('/', contactValidation, createContact);

router.delete('/:contactId', deleteContact);

router.put('/:contactId', contactValidation, updateContact);


module.exports = router

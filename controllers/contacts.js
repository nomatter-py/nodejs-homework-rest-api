const contactsAction = require("../models/contacts");
const { RequestError } = require("../helpers");

const getContacts = async (_, res, next) => {
  try {
    const contacts = await contactsAction.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId: id } = req.params;
    const contact = await contactsAction.getContactById(id);
    if (!contact) {
      throw new RequestError(404, "Not found");
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId: id } = req.params;
    const result = await contactsAction.removeContact(id);
    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsAction.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId: id } = req.params;
    const result = await contactsAction.updateContact(id, req.body);
    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.status(201).json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};

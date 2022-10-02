const contactsAction = require("../models/contacts");
const { RequestError } = require("../helpers");

const getContacts = async (_, res,) => {
    const contacts = await contactsAction.listContacts();
    res.status(200).json(contacts);
};

const getContactById = async (req, res) => {
    const { contactId: id } = req.params;
    const contact = await contactsAction.getContactById(id);
    if (!contact) {
      throw new RequestError(404, "Not found");
    }
    return res.status(200).json(contact);
};

const deleteContact = async (req, res) => {
    const { contactId: id } = req.params;
    const result = await contactsAction.removeContact(id);
    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
};

const createContact = async (req, res) => {
    const newContact = await contactsAction.addContact(req.body);
    res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
    const { contactId: id } = req.params;
    const result = await contactsAction.updateContact(id, req.body);
    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.status(201).json({
      result,
    });
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};

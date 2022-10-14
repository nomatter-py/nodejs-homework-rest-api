const Contact = require("../models/contact");
const { RequestError } = require("../helpers");

const getContacts = async (_, res) => {
  const contacts = await Contact.find({}, "-createdAt -updatedAt");
  res.status(200).json(contacts);
};

const getContactById = async (req, res) => {
  const { contactId: id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new RequestError(404, "Not found");
  }
  return res.status(200).json(contact);
};

const deleteContact = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw RequestError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const createContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw RequestError(404, "Not found");
  }
  res.status(201).json({
    result,
  });
};

const updateFavorite = async (req, res) => {
  const { contactId: id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
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
  updateFavorite,
};

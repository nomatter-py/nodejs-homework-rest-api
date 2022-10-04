const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const updateContacts = async (contacts) =>
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  contactId = String(contactId);
  const contact = contacts.find((c) => c.id === contactId);

  return contact || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((c) => c.id === String(contactId));
  if (contactIndex === -1) {
    return null;
  }

  const [result] = contacts.splice(contactIndex, 1);
  await updateContacts(contacts);
  return result;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(4),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    return null;
  }

  contacts[contactIndex] = { id: contactId, ...body };
  await updateContacts(contacts);
  return contacts[contactIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

const addContactSchema = require("../validation/schema");
const { RequestError } = require("../helpers");

module.exports = {
  contactValidation: (req, _, next) => {
    const { error } = addContactSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    next();
  },
};

const types = require('../utils').validation.types;

const login = {
    username: types.string.isRequired,
    password: types.string.isRequired
};

module.exports = { login };
const Customer = require("../models/customerModel");

const customerService = {

    getAllCustomers: (callback) => {
        Customer.getAll(callback);
    },

    getCustomerById: (id, callback) => {
        Customer.getById(id, callback);
    },

    createCustomer: (customer, callback) => {
        Customer.create(customer, callback);
    },

    updateCustomer: (id, customer, callback) => {
        Customer.update(id, customer, callback);
    },

    deleteCustomer: (id, callback) => {
        Customer.delete(id, callback);
    }

};

module.exports = customerService;
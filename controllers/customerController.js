const customerService = require("../services/customerService");

const customerController = {

    // Get all customers
    getAllCustomers: (req, res) => {
        customerService.getAllCustomers((err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Error fetching customers",
                    error: err.message
                });
            }

            res.status(200).json(results);
        });
    },

    // Get customer by ID
    getCustomerById: (req, res) => {
        const id = req.params.id;

        customerService.getCustomerById(id, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Error fetching customer",
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Customer not found"
                });
            }

            res.status(200).json(result[0]);
        });
    },

    // Create customer
    createCustomer: (req, res) => {
        const customer = req.body;

        customerService.createCustomer(customer, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Error creating customer",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Customer created successfully",
                customerId: result.insertId
            });
        });
    },

    // Update customer
    updateCustomer: (req, res) => {
        const id = req.params.id;
        const customer = req.body;

        customerService.updateCustomer(id, customer, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Error updating customer",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Customer not found"
                });
            }

            res.status(200).json({
                message: "Customer updated successfully"
            });
        });
    },

    // Delete customer
    deleteCustomer: (req, res) => {
        const id = req.params.id;

        customerService.deleteCustomer(id, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Error deleting customer",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Customer not found"
                });
            }

            res.status(200).json({
                message: "Customer deleted successfully"
            });
        });
    }

};

module.exports = customerController;
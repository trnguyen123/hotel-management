const db = require('./db');

class Customer {
    constructor(customer_id, full_name, gender, address, phone_number, id_card, email) {
        this.customer_id = customer_id;
        this.full_name = full_name;
        this.gender = gender;
        this.address = address;
        this.phone_number = phone_number;
        this.id_card = id_card;
        this.email = email;
    }

    static getAll(callback) {
        db.query('SELECT * FROM customers', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM customers WHERE customer_id = ?', [id], callback);
    }

    static create(customer, callback) {
        db.query('INSERT INTO customers SET ?', customer, callback);
    }

    static update(id, customer, callback) {
        db.query('UPDATE customers SET ? WHERE customer_id = ?', [customer, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM customers WHERE customer_id = ?', [id], callback);
    }
}

module.exports = Customer;

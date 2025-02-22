const db = require('../config/db'); 

class Payment {
    constructor(payment_id, booking_id, amount, payment_date, payment_method, status) {
        this.payment_id = payment_id;
        this.booking_id = booking_id;
        this.amount = amount;
        this.payment_date = payment_date;
        this.payment_method = payment_method;
        this.status = status;
    }

    static getAll(callback) {
        db.query('SELECT * FROM payments', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM payments WHERE payment_id = ?', [id], callback);
    }

    static create(payment, callback) {
        db.query('INSERT INTO payments SET ?', payment, callback);
    }

    static update(id, payment, callback) {
        db.query('UPDATE payments SET ? WHERE payment_id = ?', [payment, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM payments WHERE payment_id = ?', [id], callback);
    }
}

module.exports = Payment;

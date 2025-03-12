const db = require('../config/db'); 

class Voucher {
    constructor(voucher_code, discount_percentage, expiry_date, minimum_order_value) {
        this.voucher_code = voucher_code;
        this.discount_percentage = discount_percentage;
        this.expiry_date = expiry_date;
        this.minimum_order_value = minimum_order_value;
    }

    static getAll(callback) {
        db.query('SELECT * FROM vouchers', callback);
    }

    static getByCode(code, callback) {
        db.query('SELECT * FROM vouchers WHERE voucher_code = ?', [code], callback);
    }

    static create(voucher, callback) {
        db.query('INSERT INTO vouchers SET ?', voucher, callback);
    }

    static update(code, voucher, callback) {
        db.query('UPDATE vouchers SET ? WHERE voucher_code = ?', [voucher, code], callback);
    }

    static delete(code, callback) {
        db.query('DELETE FROM vouchers WHERE voucher_code = ?', [code], callback);
    }
}

module.exports = Voucher;

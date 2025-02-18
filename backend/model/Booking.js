const db = require('./db');

class Booking {
    constructor(booking_id, customer_id, room_id, check_in_date, check_out_date, status, payment_status, total_price, cancellation_date) {
        this.booking_id = booking_id;
        this.customer_id = customer_id;
        this.room_id = room_id;
        this.check_in_date = check_in_date;
        this.check_out_date = check_out_date;
        this.status = status;
        this.payment_status = payment_status;
        this.total_price = total_price;
        this.cancellation_date = cancellation_date;
    }

    static getAll(callback) {
        db.query('SELECT * FROM bookings', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM bookings WHERE booking_id = ?', [id], callback);
    }

    static create(booking, callback) {
        db.query('INSERT INTO bookings SET ?', booking, callback);
    }

    static update(id, booking, callback) {
        db.query('UPDATE bookings SET ? WHERE booking_id = ?', [booking, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM bookings WHERE booking_id = ?', [id], callback);
    }
}

module.exports = Booking;

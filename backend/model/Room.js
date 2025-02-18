const db = require('./db');

class Room {
    constructor(room_id, room_number, room_type, status, price, max_occupancy, area) {
        this.room_id = room_id;
        this.room_number = room_number;
        this.room_type = room_type;
        this.status = status;
        this.price = price;
        this.max_occupancy = max_occupancy;
        this.area = area;
    }

    static getAll(callback) {
        db.query('SELECT * FROM rooms', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM rooms WHERE room_id = ?', [id], callback);
    }

    static create(room, callback) {
        db.query('INSERT INTO rooms SET ?', room, callback);
    }

    static update(id, room, callback) {
        db.query('UPDATE rooms SET ? WHERE room_id = ?', [room, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM rooms WHERE room_id = ?', [id], callback);
    }
}

module.exports = Room;

const db = require('./db');

class RoomService {
    constructor(service_id, room_id, service_date, status) {
        this.service_id = service_id;
        this.room_id = room_id;
        this.service_date = service_date;
        this.status = status;
    }

    static getAll(callback) {
        db.query('SELECT * FROM room_services', callback);
    }

    static getById(service_id, room_id, callback) {
        db.query('SELECT * FROM room_services WHERE service_id = ? AND room_id = ?', [service_id, room_id], callback);
    }

    static create(roomService, callback) {
        db.query('INSERT INTO room_services SET ?', roomService, callback);
    }

    static update(service_id, room_id, roomService, callback) {
        db.query('UPDATE room_services SET ? WHERE service_id = ? AND room_id = ?', [roomService, service_id, room_id], callback);
    }

    static delete(service_id, room_id, callback) {
        db.query('DELETE FROM room_services WHERE service_id = ? AND room_id = ?', [service_id, room_id], callback);
    }
}

module.exports = RoomService;

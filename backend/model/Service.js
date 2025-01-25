const db = require('./db');

class Service {
    constructor(service_id, service_name, price, unit, status) {
        this.service_id = service_id;
        this.service_name = service_name;
        this.price = price;
        this.unit = unit;
        this.status = status;
    }

    static getAll(callback) {
        db.query('SELECT * FROM services', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM services WHERE service_id = ?', [id], callback);
    }

    static create(service, callback) {
        db.query('INSERT INTO services SET ?', service, callback);
    }

    static update(id, service, callback) {
        db.query('UPDATE services SET ? WHERE service_id = ?', [service, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM services WHERE service_id = ?', [id], callback);
    }
}

module.exports = Service;

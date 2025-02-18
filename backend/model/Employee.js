const db = require('./db');

class Employee {
    constructor(employee_id, full_name, password, phone_number, email, role) {
        this.employee_id = employee_id;
        this.full_name = full_name;
        this.password = password;
        this.phone_number = phone_number;
        this.email = email;
        this.role = role;
    }

    static getAll(callback) {
        db.query('SELECT * FROM employees', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM employees WHERE employee_id = ?', [id], callback);
    }

    static create(employee, callback) {
        db.query('INSERT INTO employees SET ?', employee, callback);
    }

    static update(id, employee, callback) {
        db.query('UPDATE employees SET ? WHERE employee_id = ?', [employee, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM employees WHERE employee_id = ?', [id], callback);
    }
}

module.exports = Employee;

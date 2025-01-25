const db = require('./db');

class Notification {
    constructor(notification_id, customer_id, email_subject, email_content, send_at) {
        this.notification_id = notification_id;
        this.customer_id = customer_id;
        this.email_subject = email_subject;
        this.email_content = email_content;
        this.send_at = send_at;
    }

    static getAll(callback) {
        db.query('SELECT * FROM notifications', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM notifications WHERE notification_id = ?', [id], callback);
    }

    static create(notification, callback) {
        db.query('INSERT INTO notifications SET ?', notification, callback);
    }

    static update(id, notification, callback) {
        db.query('UPDATE notifications SET ? WHERE notification_id = ?', [notification, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM notifications WHERE notification_id = ?', [id], callback);
    }
}

module.exports = Notification;

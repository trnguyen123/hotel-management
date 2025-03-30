import pymysql
import pandas as pd
import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

# Kết nối MySQL bằng thông tin từ .env

def get_booking_data():
    print("Bắt đầu kết nối DB...")
    db = pymysql.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    print("Đã kết nối DB thành công!")
    cursor = db.cursor()

    # Truy vấn dữ liệu booking
    query = """
    SELECT room_id, 
           COUNT(*) AS num_bookings, 
           SUM(total_price) AS total_revenue,
           AVG(DATEDIFF(check_out_date, check_in_date)) AS avg_stay_duration
    FROM bookings
    WHERE status = 'checked_out'
    GROUP BY room_id;
    """
    cursor.execute(query)
    data = cursor.fetchall()
    print("Dữ liệu truy vấn:", data)

    # Chuyển thành DataFrame
    df = pd.DataFrame(data, columns=['room_id', 'num_bookings', 'total_revenue', 'avg_stay_duration'])

    db.close()
    return df
if __name__ == "__main__":
    df = get_booking_data()
    print("Dữ liệu lấy được:\n", df)



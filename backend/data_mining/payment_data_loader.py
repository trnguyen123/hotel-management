import pymysql
import pandas as pd
import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

def get_payment_data():
    print("Bắt đầu kết nối DB...")
    db = pymysql.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    print("Đã kết nối DB thành công!")
    cursor = db.cursor()

    # Truy vấn dữ liệu theo phương thức thanh toán
    query = """
    SELECT payment_method, 
           COUNT(*) AS num_transactions, 
           SUM(total_price) AS total_revenue
    FROM bookings
    WHERE status = 'checked_out'
    GROUP BY payment_method;
    """
    cursor.execute(query)
    data = cursor.fetchall()
    print("Dữ liệu truy vấn:", data)

    # Chuyển thành DataFrame
    df = pd.DataFrame(data, columns=['payment_method', 'num_transactions', 'total_revenue'])

    db.close()
    return df

if __name__ == "__main__":
    df = get_payment_data()
    print("Dữ liệu lấy được:\n", df)
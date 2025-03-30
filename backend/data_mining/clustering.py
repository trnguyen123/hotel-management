import pandas as pd
from sklearn.cluster import KMeans
import json
from decimal import Decimal
from data_loader import get_booking_data

def perform_clustering():
    # Lấy dữ liệu booking
    df = get_booking_data()

    if df.empty:
        print("Không có dữ liệu để phân cụm.")
        return None

    # Chuyển đổi kiểu dữ liệu Decimal -> float để tránh lỗi JSON
    df['total_revenue'] = df['total_revenue'].astype(float)
    df['avg_stay_duration'] = df['avg_stay_duration'].astype(float)

    # Áp dụng K-Means clustering (3 cụm)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(df[['num_bookings', 'total_revenue', 'avg_stay_duration']])

    # Chuyển kết quả thành JSON
    result = df.to_dict(orient='records')

    # Lưu vào file JSON
    with open("backend/data_mining/cluster_result.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=4)

    print("✅ Phân cụm hoàn tất! Kết quả đã lưu vào cluster_result.json.")

if __name__ == "__main__":
    perform_clustering()

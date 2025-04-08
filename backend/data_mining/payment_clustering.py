import pandas as pd
from sklearn.cluster import KMeans
import json
from decimal import Decimal
from payment_data_loader import get_payment_data

def perform_payment_clustering():
    # Lấy dữ liệu phương thức thanh toán
    df = get_payment_data()

    if df.empty:
        print("Không có dữ liệu để phân cụm.")
        return None

    # Chuyển đổi kiểu dữ liệu Decimal -> float để tránh lỗi JSON
    df['total_revenue'] = df['total_revenue'].astype(float)

    # Áp dụng K-Means clustering (2 cụm)
    kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(df[['num_transactions', 'total_revenue']])

    # Chuyển kết quả thành JSON
    result = df.to_dict(orient='records')

    # Lưu vào file JSON
    with open("payment_cluster_result.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=4)

    print("Phân cụm phương thức thanh toán hoàn tất! Kết quả đã lưu vào payment_cluster_result.json.")
    return result

if __name__ == "__main__":
    perform_payment_clustering()
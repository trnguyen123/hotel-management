import React, { useState } from "react";
import "../Style/Reports.css";

const ReportsPage = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenReportModal = () => setIsReportModalOpen(true);
  const handleCloseReportModal = () => setIsReportModalOpen(false);

  const handleCreateReport = async () => {
    if (!roomNumber.trim() || !reportContent.trim()) {
      alert("Vui lòng nhập đầy đủ số phòng và nội dung báo cáo!");
      return;
    }
    if (isNaN(roomNumber) || parseInt(roomNumber) <= 0) {
      alert("Số phòng phải là số dương!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/report/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_number: parseInt(roomNumber),
          report_content: reportContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tạo báo cáo");
      }

      alert("Báo cáo đã được tạo thành công!");
      setRoomNumber("");
      setReportContent("");
      handleCloseReportModal();
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Báo Cáo</h2>
        <button className="add-reservation" onClick={handleOpenReportModal}>
          + Tạo Báo Cáo Mới
        </button>
      </div>

      {isReportModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tạo Báo Cáo Mới</h2>
            <div className="form-group">
              <label>Số phòng:</label>
              <input
                type="number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Nội dung báo cáo:</label>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                rows="4"
              />
            </div>
            <button
              className="save-report-button"
              onClick={handleCreateReport}
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu Báo Cáo"}
            </button>
            <button
              className="cancel-report-button"
              onClick={handleCloseReportModal}
              disabled={isLoading}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
import React, { useState } from "react";
import "../Style/Calendar.css";
import "../Style/Head.css";
import "../Style/Reports.css";

const ReportsPage = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [reportContent, setReportContent] = useState("");

  const handleOpenReportModal = () => setIsReportModalOpen(true);
  const handleCloseReportModal = () => setIsReportModalOpen(false);

  const handleCreateReport = async () => {
    if (!roomNumber || !reportContent) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/report/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_number: parseInt(roomNumber), report_content: reportContent }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tạo báo cáo");
      }

      alert("Báo cáo đã được tạo thành công!");
      setReports([...reports, { room_number: roomNumber, report_content: reportContent }]);
      setRoomNumber("");
      setReportContent("");
      handleCloseReportModal();
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      alert(error.message);
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

      <div className="reports-list">
        {reports.map((report, index) => (
          <div key={index} className="report-item">
            <div className="report-header">
              <span>Phòng {report.room_number}</span>
              <span>{report.report_content}</span>
            </div>
          </div>
        ))}
      </div>

      {isReportModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tạo Báo Cáo Mới</h2>
            <label>Số phòng:</label>
            <input type="number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
            <label>Nội dung báo cáo:</label>
            <textarea value={reportContent} onChange={(e) => setReportContent(e.target.value)} />
            <button onClick={handleCreateReport}>Lưu Báo Cáo</button>
            <button onClick={handleCloseReportModal}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

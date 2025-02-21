import React, { useState } from "react";
import "../Style/Calender.css";
import "../Style/Head.css";
import "../Style/Reports.css";
const ReportsPage = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reports, setReports] = useState([]);

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleCreateReport = (newReport) => {
    setReports([...reports, newReport]);
    handleCloseReportModal();
  };

  return (
    <div className='calendar-container'>
      <div className='calendar-header'>
        <h2>Báo Cáo</h2>
        <div className='right-controls'>
          <button className='add-reservation' onClick={handleOpenReportModal}>
            + Tạo Báo Cáo Mới
          </button>
        </div>
      </div>

      <div className='reports-list'>
        {reports.map((report, index) => (
          <div key={index} className='report-item'>
            <div className='report-header'>
              <span>{report.customerName}</span>
              <span>{report.reportDate}</span>
            </div>
            <div className='report-content'>{report.reportContent}</div>
          </div>
        ))}
      </div>

      {isReportModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Tạo Báo Cáo Mới</h2>
              <span className='close-button' onClick={handleCloseReportModal}>
                x
              </span>
            </div>
            <div className='modal-body'>
              <div className='form-group'>
                <label>Tên Khách Hàng</label>
                <input type='text' />
              </div>
              <div className='form-group'>
                <label>Ngày Tạo Báo Cáo</label>
                <input type='date' />
              </div>
              <div className='form-group'>
                <label>Nội Dung Báo Cáo</label>
                <textarea />
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-primary'>Lưu Báo Cáo</button>
              <button
                className='btn btn-secondary'
                onClick={handleCloseReportModal}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

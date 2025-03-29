import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../Style/Management.css';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState({ 
    voucher_code: '', 
    discount_percentage: '', 
    start_date: '', 
    expiration_date: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVouchers, setFilteredVouchers] = useState([]);

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = vouchers.filter(voucher => 
        (voucher.voucher_code?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
      setFilteredVouchers(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, vouchers]);

  const fetchVouchers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/voucher/getAll');
      if (!response.ok) {
        throw new Error('Failed to fetch vouchers');
      }
      const data = await response.json();
      setVouchers(data);
      setFilteredVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      setVouchers([]);
      setFilteredVouchers([]);
    }
  };

  const addRecentActivity = (activity) => {
    try {
      const savedActivities = localStorage.getItem('recentActivities');
      let activities = savedActivities ? JSON.parse(savedActivities) : [];
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
      activities = [{ time: formattedTime, content: activity }, ...activities.slice(0, 3)];
      localStorage.setItem('recentActivities', JSON.stringify(activities));
      window.dispatchEvent(new Event('activityAdded'));
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleAddVoucher = () => {
    setCurrentVoucher({ 
      voucher_code: '', 
      discount_percentage: '', 
      start_date: '', 
      expiration_date: ''
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditVoucher = (voucher) => {
    // Chuyển đổi ngày từ định dạng ISO sang YYYY-MM-DD, cộng thêm 1 ngày để khớp với database
    const startDate = new Date(voucher.start_date);
    startDate.setUTCDate(startDate.getUTCDate() + 1); // Cộng 1 ngày
    const expirationDate = new Date(voucher.expiration_date);
    expirationDate.setUTCDate(expirationDate.getUTCDate() + 1); // Cộng 1 ngày

    const formatDateToString = (date) => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setCurrentVoucher({
      voucher_code: voucher.voucher_code,
      discount_percentage: voucher.discount_percentage,
      start_date: formatDateToString(startDate),
      expiration_date: formatDateToString(expirationDate)
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDeleteVoucher = async (voucher_code) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
        const response = await fetch(`http://localhost:5000/api/voucher/delete/${voucher_code}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const deletedVoucher = vouchers.find(v => v.voucher_code === voucher_code);
          addRecentActivity(`Đã xóa voucher ${deletedVoucher.voucher_code}`);
          fetchVouchers();
        } else {
          const errorData = await response.json();
          console.error('Failed to delete voucher:', errorData);
          alert(`Xóa thất bại: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
      alert('Đã xảy ra lỗi khi xóa voucher!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuẩn hóa ngày trước khi gửi lên server, không cần trừ 1 ngày
      const formatDateForServer = (dateString) => {
        // Tách chuỗi YYYY-MM-DD để tránh lệch múi giờ
        const [year, month, day] = dateString.split('-');
        // Trả về định dạng YYYY-MM-DD
        return `${year}-${month}-${day}`;
      };

      const payload = {
        voucher_code: currentVoucher.voucher_code,
        discount_percentage: currentVoucher.discount_percentage,
        start_date: formatDateForServer(currentVoucher.start_date),
        expiration_date: formatDateForServer(currentVoucher.expiration_date)
      };
      let activityMessage = '';

      if (isEdit) {
        const response = await fetch(`http://localhost:5000/api/voucher/update/${currentVoucher.voucher_code}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          activityMessage = `Đã cập nhật voucher ${currentVoucher.voucher_code}`;
          addRecentActivity(activityMessage);
          setShowModal(false);
          fetchVouchers();
        } else {
          const errorData = await response.json();
          console.error('Lỗi khi cập nhật voucher:', errorData);
          alert(`Cập nhật thất bại: ${errorData.message}`);
          return;
        }
      } else {
        const response = await fetch('http://localhost:5000/api/voucher/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          activityMessage = `Đã thêm voucher mới ${currentVoucher.voucher_code}`;
          addRecentActivity(activityMessage);
          setShowModal(false);
          fetchVouchers();
        } else {
          const errorData = await response.json();
          console.error('Lỗi khi thêm voucher:', errorData);
          alert(`Thêm voucher thất bại: ${errorData.message}`);
          return;
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu voucher:', error);
      alert('Đã xảy ra lỗi khi lưu thông tin!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentVoucher({ ...currentVoucher, [name]: value });
  };

  // Hàm định dạng ngày để hiển thị trong bảng, cộng 1 ngày để khớp với database
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    date.setUTCDate(date.getUTCDate() + 1); // Cộng 1 ngày
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${day}/${month}/${year}`; // Định dạng DD/MM/YYYY
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Quản lý voucher</h1>
        <button className="btn btn-primary" onClick={handleAddVoucher}>
          <FaPlus /> Thêm voucher
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm voucher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="btn" 
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã voucher</th>
                <th>Giảm giá (%)</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.length > 0 ? (
                filteredVouchers.map((voucher, index) => (
                  <tr key={voucher.voucher_code}>
                    <td>{index + 1}</td>
                    <td>{voucher.voucher_code}</td>
                    <td>{voucher.discount_percentage}%</td>
                    <td>{formatDateForDisplay(voucher.start_date)}</td>
                    <td>{formatDateForDisplay(voucher.expiration_date)}</td>
                    <td className="actions">
                      <button className="btn btn-edit" onClick={() => handleEditVoucher(voucher)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteVoucher(voucher.voucher_code)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Không có voucher nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEdit ? 'Cập nhật voucher' : 'Thêm voucher mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Mã voucher</label>
                  <input 
                    type="text" 
                    name="voucher_code" 
                    value={currentVoucher.voucher_code} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Giảm giá (%)</label>
                  <input 
                    type="number" 
                    name="discount_percentage" 
                    value={currentVoucher.discount_percentage} 
                    onChange={handleChange} 
                    required 
                    min="0" 
                    max="100"
                    step="0.01"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Ngày bắt đầu</label>
                  <input 
                    type="date" 
                    name="start_date" 
                    value={currentVoucher.start_date} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <input 
                    type="date" 
                    name="expiration_date" 
                    value={currentVoucher.expiration_date} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">{isEdit ? 'Cập nhật' : 'Thêm'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './Management.css';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState({ 
    id: '', 
    code: '', 
    discount: '', 
    discountType: 'percent', 
    minPurchase: '', 
    startDate: '', 
    endDate: '', 
    status: 'active' 
  });
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Chỉ gọi một lần khi component mount
  useEffect(() => {
    fetchVouchers();
  }, []);

  // Hàm lấy vouchers từ localStorage hoặc tạo dữ liệu mẫu nếu không có
  const fetchVouchers = () => {
    try {
      // Kiểm tra xem có vouchers trong localStorage chưa
      const savedVouchers = localStorage.getItem('vouchers');
      
      if (savedVouchers && JSON.parse(savedVouchers).length > 0) {
        // Đảm bảo dữ liệu không phải là null hoặc mảng rỗng
        setVouchers(JSON.parse(savedVouchers));
        console.log('Loaded vouchers from localStorage:', JSON.parse(savedVouchers));
      } else {
        // Sử dụng dữ liệu mẫu nếu không có
        const sampleVouchers = [
          { 
            id: 1, 
            code: 'WELCOME20', 
            discount: '20', 
            discountType: 'percent', 
            minPurchase: '200000', 
            startDate: '2023-01-01', 
            endDate: '2023-12-31', 
            status: 'active' 
          },
          { 
            id: 2, 
            code: 'SUMMER50', 
            discount: '50000', 
            discountType: 'fixed', 
            minPurchase: '500000', 
            startDate: '2023-06-01', 
            endDate: '2023-08-31', 
            status: 'active' 
          },
          { 
            id: 3, 
            code: 'BIRTHDAY25', 
            discount: '25', 
            discountType: 'percent', 
            minPurchase: '300000', 
            startDate: '2023-01-01', 
            endDate: '2023-12-31', 
            status: 'active' 
          },
          { 
            id: 4, 
            code: 'WINTER15', 
            discount: '15', 
            discountType: 'percent', 
            minPurchase: '150000', 
            startDate: '2022-12-01', 
            endDate: '2023-02-28', 
            status: 'expired' 
          },
        ];
        // Lưu dữ liệu mẫu vào localStorage và state
        localStorage.setItem('vouchers', JSON.stringify(sampleVouchers));
        setVouchers(sampleVouchers);
        console.log('Set sample vouchers to localStorage:', sampleVouchers);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      // Trong trường hợp lỗi, set một mảng rỗng để tránh lỗi
      setVouchers([]);
    }
  };

  // Hàm thêm hoạt động gần đây
  const addRecentActivity = (activity) => {
    try {
      // Lấy các hoạt động gần đây từ localStorage
      const savedActivities = localStorage.getItem('recentActivities');
      let activities = savedActivities ? JSON.parse(savedActivities) : [];
      
      // Lấy thời gian hiện tại
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
      
      // Thêm hoạt động mới vào đầu danh sách
      activities = [{ time: formattedTime, content: activity }, ...activities.slice(0, 3)];
      
      // Lưu vào localStorage
      localStorage.setItem('recentActivities', JSON.stringify(activities));
      
      // Kích hoạt sự kiện để Dashboard cập nhật
      const event = new Event('activityAdded');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleAddVoucher = () => {
    setCurrentVoucher({ 
      id: '', 
      code: '', 
      discount: '', 
      discountType: 'percent', 
      minPurchase: '', 
      startDate: '', 
      endDate: '', 
      status: 'active' 
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditVoucher = (voucher) => {
    setCurrentVoucher({...voucher});
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDeleteVoucher = (id) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
        // Tìm thông tin voucher trước khi xóa
        const deletedVoucher = vouchers.find(voucher => voucher.id === id);
        
        if (!deletedVoucher) {
          console.error('Không tìm thấy voucher cần xóa với ID:', id);
          return;
        }
        
        // Xóa voucher khỏi state
        const updatedVouchers = vouchers.filter(voucher => voucher.id !== id);
        setVouchers(updatedVouchers);
        
        // Cập nhật localStorage ngay lập tức 
        localStorage.setItem('vouchers', JSON.stringify(updatedVouchers));
        console.log('Đã xóa voucher với ID:', id);
        console.log('Vouchers sau khi xóa:', updatedVouchers);
        
        // Thêm hoạt động
        addRecentActivity(`Đã xóa voucher ${deletedVoucher.code}`);
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let updatedVouchers;
      
      // Đảm bảo ID luôn là số
      const voucherToSave = {
        ...currentVoucher,
        id: currentVoucher.id ? Number(currentVoucher.id) : Date.now()
      };
      
      if (isEdit) {
        // Cập nhật voucher
        updatedVouchers = vouchers.map(voucher => 
          voucher.id === voucherToSave.id ? voucherToSave : voucher
        );
        console.log('Đã cập nhật voucher:', voucherToSave);
      } else {
        // Thêm voucher mới
        updatedVouchers = [...vouchers, voucherToSave];
        console.log('Đã thêm voucher mới:', voucherToSave);
      }
      
      // Cập nhật state
      setVouchers(updatedVouchers);
      
      // Cập nhật localStorage ngay lập tức
      localStorage.setItem('vouchers', JSON.stringify(updatedVouchers));
      console.log('Đã lưu vouchers vào localStorage:', updatedVouchers);
      
      // Thêm hoạt động
      addRecentActivity(isEdit 
        ? `Đã cập nhật voucher ${voucherToSave.code}` 
        : `Đã thêm voucher mới ${voucherToSave.code}`
      );
      
      // Đóng modal
      setShowModal(false);
    } catch (error) {
      console.error('Error saving voucher:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentVoucher({ ...currentVoucher, [name]: value });
  };

  const filteredVouchers = vouchers.filter(voucher => 
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã voucher</th>
                <th>Giảm giá</th>
                <th>Mua tối thiểu</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.length > 0 ? (
                filteredVouchers.map(voucher => (
                  <tr key={voucher.id}>
                    <td>{voucher.id}</td>
                    <td>{voucher.code}</td>
                    <td>
                      {voucher.discountType === 'percent' 
                        ? `${voucher.discount}%` 
                        : `${parseInt(voucher.discount).toLocaleString()} VND`}
                    </td>
                    <td>{parseInt(voucher.minPurchase).toLocaleString()} VND</td>
                    <td>{new Date(voucher.startDate).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(voucher.endDate).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`status-badge ${voucher.status}`}>
                        {voucher.status === 'active' ? 'Còn hạn' : 'Hết hạn'}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn btn-edit" onClick={() => handleEditVoucher(voucher)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteVoucher(voucher.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">Không có voucher nào</td>
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
                    name="code" 
                    value={currentVoucher.code} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Giảm giá</label>
                    <input 
                      type="number" 
                      name="discount" 
                      value={currentVoucher.discount} 
                      onChange={handleChange} 
                      required 
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Loại giảm giá</label>
                    <select 
                      name="discountType" 
                      value={currentVoucher.discountType} 
                      onChange={handleChange} 
                      className="form-control"
                    >
                      <option value="percent">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định (VND)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Mua tối thiểu (VND)</label>
                  <input 
                    type="number" 
                    name="minPurchase" 
                    value={currentVoucher.minPurchase} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày bắt đầu</label>
                    <input 
                      type="date" 
                      name="startDate" 
                      value={currentVoucher.startDate} 
                      onChange={handleChange} 
                      required 
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày kết thúc</label>
                    <input 
                      type="date" 
                      name="endDate" 
                      value={currentVoucher.endDate} 
                      onChange={handleChange} 
                      required 
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select 
                    name="status" 
                    value={currentVoucher.status} 
                    onChange={handleChange} 
                    className="form-control"
                  >
                    <option value="active">Còn hạn</option>
                    <option value="expired">Hết hạn</option>
                  </select>
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
}

export default VoucherManagement;
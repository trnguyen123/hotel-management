import React from "react";

const EditReservationModal = ({ onClose }) => {
  return (
    <div className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Chỉnh sửa đơn đặt phòng</h2>
          <span className='close-button' onClick={onClose}>
            x
          </span>
        </div>
        <div className='modal-body'>
          <div className='form-group'>
            <label htmlFor='check-in'>Check in:</label>
            <input type='text' id='check-in' placeholder='31 Aug 2021' />
          </div>
          <div className='form-group'>
            <label htmlFor='check-out'>Check out:</label>
            <input type='text' id='check-out' placeholder='02 Sep 2021' />
          </div>
          <div className='form-group'>
            <label>
              <input type='checkbox' checked readOnly />
              Keep rates for existing dates
            </label>
          </div>
          <div className='form-group'>
            <label>Length of stay:</label>
            <span>2 Nights</span>
          </div>
          <div className='form-group'>
            <label>Booking status:</label>
            <span>Confirmed</span>
          </div>
          <div className='form-group'>
            <label htmlFor='room-type'>Room type:</label>
            <select id='room-type'>
              <option value='family-room'>Family Room</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='rate-plan'>Rate plan:</label>
            <select id='rate-plan'>
              <option value='bed-and-breakfast-f'>Bed and Breakfast - F</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='room-number'>Room #:</label>
            <select id='room-number'>
              <option value='room1'>Room 1</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='adults'>Adults:</label>
            <input type='number' id='adults' defaultValue='1' />
          </div>
          <div className='form-group'>
            <label htmlFor='children'>Children:</label>
            <input type='number' id='children' defaultValue='0' />
          </div>
          <div className='form-group'>
            <label htmlFor='infants'>Infants:</label>
            <input type='number' id='infants' defaultValue='0' />
          </div>
          <div className='form-group'>
            <label htmlFor='room-price'>Room price:</label>
            <input type='text' id='room-price' defaultValue='$ 214' disabled />
          </div>
          <div className='form-group'>
            <label htmlFor='extra-person'>Extra Person:</label>
            <input type='text' id='extra-person' defaultValue='$ 0' disabled />
          </div>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-primary'>Lưu thay đổi</button>
          <button className='btn btn-secondary' onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReservationModal;


export const formatMessageTime = (time) => {
    // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date
  const date = new Date(time);

  // Lấy ngày hiện tại
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Đặt lại giờ, phút, giây, mili giây về 0 để so sánh ngày

  // Tính toán số ngày khác biệt
  const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));

  // Mảng chứa tên các ngày trong tuần
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Định dạng kết quả
  if (diffDays === 0) {
    // Trong ngày hôm nay
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); // Định dạng giờ:phút theo tiếng Việt
  } else if (diffDays >= -6 && diffDays <= 6) {
    // Trong tuần này
    return daysOfWeek[date.getDay()];
  } else {
    // Các trường hợp còn lại
    return date.getDay() + ' thg ' + date.getMonth(); // Định dạng ngày/tháng theo tiếng Việt
  }
}
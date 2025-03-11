
function PatientCard() {
  return (
    <div className="patient-card doctor-dashboard-card">
      <div className="patient-card-header">
        <img src="your-avatar-placeholder.png" alt="Avatar" />
          <div className="dashboard-patient-info">
            <h2 className="patient-name">Nguyễn Văn A</h2>
            <p className="patient-details">Nam - 30 tuổi</p>
          </div>
      </div>
      <div className="patient-notes">
        <p>Ghi chú của bệnh nhân:</p>
        <ul>
          <li>Triệu chứng ho, nghẹt mũi</li>
        </ul>
      </div>
      <div className="previous-visit">
        <p>Lần khám trước: Với bác sĩ Phúc vào 20 thg 11, 2024</p>
        <p>Triệu chứng: nhứt đầu nhẹ, hoa mắt</p>
        <p>Kết luận: cảm cúm</p>
        <p>Kê đơn: paracetamol - 2 lần một ngày</p>
      </div>
      <div className="status-buttons">
        <button className="absent-button">Vắng</button>
        <button className="examined-button">Đã khám</button>
      </div>
    </div>
  );
}

export default PatientCard;
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DefaultLayoutRegisterMedicalExaminationPage from "../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage";
import "./CreatePatientRecordPage.css";
import { RecordPatientAPI } from "../../../../API/RecordPatientAPI";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL = "https://provinces.open-api.vn/api";
const JOBS = [
    { id: 1, name: "Bác sĩ" },
    { id: 2, name: "Y tá" },
    { id: 3, name: "Kỹ sư" },
    { id: 4, name: "Giáo viên" },
    { id: 5, name: "Học sinh" },
    { id: 6, name: "Sinh viên" },
    { id: 7, name: "Nhân viên văn phòng" },
];
const GENDERS = [
    { id: 1, name: "Nam" },
    { id: 0, name: "Nữ" },
];
const CreatePatientRecordPage = () => {
    
    const user = JSON.parse(localStorage.getItem("user"));
    const [hasPreviousRecord, setHasPreviousRecord] = useState(true);
    const location = useLocation();

    const [currentRecord, setCurrentRecord] = useState(location.state ? location.state.record : null);
    const [hasUpdate, setHasUpdate] = useState(location.state ? location.state.statusUpdate : undefined);
    console.log("currentRecord", currentRecord);
    console.log("hasUpdate", hasUpdate);

    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();

    // Tạo danh sách ngày
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Tạo danh sách tháng
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Tạo danh sách năm (1900 - hiện tại)
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i);

    // State quản lý dữ liệu nghề nghiệp
    const [jobs, setJobs] = useState(JOBS);

    // State quản lý dữ liệu giới tính
    const [genders, setGenders] = useState(GENDERS);

    // State lưu giá trị ngày, tháng, năm được chọn
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    // State quản lý dữ liệu tỉnh, huyện, xã
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [namePatient, setNamePatient] = useState("");
    const [phonePatient, setPhonePatient] = useState("");
    const [addressPatient, setAddressPatient] = useState("");


    // State lưu giá trị người dùng chọn
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [selectedJob, setSelectedJob] = useState("");
    const [selectedGender, setSelectedGender] = useState("");

    // Hàm tính số ngày tối đa của tháng
    const getDaysInMonth = (month, year) => {
        if (!month || !year) return days; // Mặc định 31 ngày nếu chưa chọn
        if (month === 2) return Array.from({ length: year % 4 === 0 ? 29 : 28 }, (_, i) => i + 1);
        if ([4, 6, 9, 11].includes(month)) return Array.from({ length: 30 }, (_, i) => i + 1);
        return days; // Các tháng còn lại có 31 ngày
    };

    // Danh sách ngày hợp lệ theo tháng/năm đã chọn
    const availableDays = getDaysInMonth(Number(selectedMonth), Number(selectedYear));

    // Nếu ngày đã chọn không hợp lệ khi đổi tháng, tự động reset
    useEffect(() => {
        if (selectedDay && !availableDays.includes(Number(selectedDay))) {
            setSelectedDay("");
        }
    }, [selectedMonth, selectedYear]);


    // Lấy danh sách tỉnh/thành khi component mount
    useEffect(() => {
        axios.get(`${API_BASE_URL}/p/`)
            .then(response => {
                setProvinces(response.data);
            })
            .catch(error => console.error("Lỗi khi lấy danh sách tỉnh:", error));
    }, []);

    // Khi chọn tỉnh, lấy danh sách quận/huyện
    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        setSelectedDistrict(""); // Reset huyện
        setSelectedWard(""); // Reset xã
        setDistricts([]); // Xóa danh sách cũ

        if (provinceCode) {
            axios.get(`${API_BASE_URL}/p/${provinceCode}?depth=2`)
                .then(response => {
                    setDistricts(response.data.districts);
                })
                .catch(error => console.error("Lỗi khi lấy danh sách quận/huyện:", error));
        }
    };

    // Khi chọn quận/huyện, lấy danh sách phường/xã
    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);
        setSelectedWard(""); // Reset xã
        setWards([]); // Xóa danh sách cũ

        if (districtCode) {
            axios.get(`${API_BASE_URL}/d/${districtCode}?depth=2`)
                .then(response => {
                    setWards(response.data.wards);
                })
                .catch(error => console.error("Lỗi khi lấy danh sách phường/xã:", error));
        }
    };

    const handleSubmit = () => {
        if (!namePatient) {
            toast.error("Vui lòng nhập họ tên bệnh nhân");
            return;
        }
        if (!selectedDay || !selectedMonth || !selectedYear) {
            toast.error("Vui lòng chọn ngày sinh");
            return;
        }
        if (!selectedGender) {
            toast.error("Vui lòng chọn giới tính");
            return;
        }
        if (!selectedJob) {
            toast.error("Vui lòng chọn nghề nghiệp");
            return;
        }
        if (!phonePatient || !/0\d{9}/.test(phonePatient)) {
            toast.error("Vui lòng nhập số điện thoại hợp lệ");
            return;
        }
        if (!selectedProvince) {
            toast.error("Vui lòng chọn tỉnh/thành");
            return;
        }
        if (!selectedDistrict) {
            toast.error("Vui lòng chọn quận/huyện");
            return;
        }
        if (!selectedWard) {
            toast.error("Vui lòng chọn phường/xã");
            return;
        }

        if (hasUpdate === undefined) {
            const dataCreate = {
                name: namePatient,
                dob: `${selectedYear}-${selectedMonth}-${selectedDay}`,
                job: selectedJob,
                phoneNumber: phonePatient,
                gender: Number(selectedGender),
                address: `${addressPatient}`,
                provinceCode: selectedProvince,
                districtCode: selectedDistrict,
                wardCode: selectedWard,
                createdBy: user._id
            }
            

            wards.map((ward) => {
                if (ward.code == selectedWard) {
                    dataCreate.ward = ward.name;
                }
            });

            districts.map((district) => {
                if (district.code == selectedDistrict) {
                    dataCreate.district = district.name;
                }
            });

            provinces.map((province) => {
                if (province.code == selectedProvince) {
                    dataCreate.province = province.name;
                }
            });


            RecordPatientAPI.createRecordPatient(dataCreate)
                .then((response) => {
                    setSelectedDay("");
                    setSelectedMonth("");
                    setSelectedYear("");
                    setSelectedGender("");
                    setSelectedJob("");
                    setAddressPatient("");
                    setSelectedProvince("");
                    setSelectedDistrict("");
                    setNamePatient("");
                    setPhonePatient("");
                    toast.success("Tạo hồ sơ bệnh nhân thành công");
                }).catch((error) => {
                    toast.error("Tạo hồ sơ bệnh nhân thất bại");
                });

        }
    };

    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="create-patient-record">
                <h2 className="title">
                    {hasUpdate ? "CẬP NHẬT HỒ SƠ" : "TẠO MỚI HỒ SƠ"}
                </h2>

                {/* Kiểm tra nếu tạo mới thì hiển thị lựa chọn */}
                {!hasUpdate && (
                    <div className="toggle-group">
                        <span
                            className={`toggle-option ${hasPreviousRecord === true ? "active" : ""}`}
                            onClick={() => setHasPreviousRecord(true)}
                        >
                            Đã từng khám
                        </span>
                        <span
                            className={`toggle-option ${hasPreviousRecord === false ? "active" : ""}`}
                            onClick={() => setHasPreviousRecord(false)}
                        >
                            Chưa từng khám
                        </span>
                    </div>
                )}

                {/* Nếu đã từng khám thì hiển thị ô nhập mã bệnh nhân */}
                {hasPreviousRecord === true && !hasUpdate && (
                    <>
                        <div className="form-medical-container-2">
                            <div className="form-medical-group-2">
                                <label>Mã bệnh nhân</label>
                                <input type="text" placeholder="Vui lòng nhập mã bệnh nhân ..." />
                            </div>

                        </div>
                        <button className="submit-button">Tìm kiếm</button>
                    </>
                )}


                {/* Form nhập thông tin bệnh nhân */}
                {hasPreviousRecord ===false && !hasUpdate && (
                    <>
                        <div className="form-medical-container">
                            <div className="form-medical-group">
                                <label>Họ và tên (có dấu)</label>
                                <input type="text" placeholder="VD: Nguyễn Văn A" onChange={(e) => setNamePatient(e.target.value)} value={namePatient} />
                            </div>

                            <div className="form-medical-group">
                                <label>Ngày sinh (ngày/tháng/năm)</label>
                                <div className="date-inputs">
                                    <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                                        <option value="" disabled hidden>Ngày</option>
                                        {availableDays.map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>

                                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                        <option value="" disabled hidden>Tháng</option>
                                        {months.map((month) => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>

                                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                        <option value="" disabled hidden>Năm</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-medical-group">
                                <label>Số điện thoại</label>
                                <input type="text" placeholder="Vui lòng nhập số điện thoại ..." onChange={(e) => setPhonePatient(e.target.value)} value={phonePatient} />
                            </div>

                            <div className="form-medical-group">
                                <label>Giới tính</label>
                                <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                                    <option value="" disabled hidden>Chọn giới tính</option>
                                    {genders.map((gender) => (
                                        <option key={gender.id} value={gender.id}>
                                            {gender.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-medical-group">
                                <label>Nghề nghiệp</label>
                                <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
                                    <option value="" disabled hidden>Chọn nghề nghiệp</option>
                                    {jobs.map((job) => (
                                        <option key={job.id} value={job.name}>
                                            {job.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-medical-group">
                                <label>Địa chỉ</label>
                                <input type="text" placeholder="Nhập số nhà, tên đường, ấp xóm, ..." onChange={(e) => setAddressPatient(e.target.value)} value={addressPatient} />
                            </div>

                            <div className="form-medical-group">
                                <label>Tỉnh / Thành</label>
                                <select value={selectedProvince} onChange={handleProvinceChange}>
                                    <option value="" disabled hidden>Chọn tỉnh thành</option>
                                    {provinces.map((province) => (
                                        <option key={province.code} value={province.code}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-medical-group">
                                <label>Quận / Huyện</label>
                                <select
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedProvince}
                                >
                                    <option value="" disabled hidden>Chọn quận huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-medical-group">
                                <label>Phường / Xã</label>
                                <select
                                    value={selectedWard}
                                    onChange={(e) => setSelectedWard(e.target.value)}
                                    disabled={!selectedDistrict}
                                >
                                    <option value="" disabled hidden>Chọn phường xã</option>
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button className="submit-button" onClick={() => handleSubmit()}>
                            {hasUpdate ? "Cập nhật" : "Tạo mới"}
                        </button>
                    </>
                )}
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
};

export default CreatePatientRecordPage;

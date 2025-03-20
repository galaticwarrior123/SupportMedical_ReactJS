import { useState, useEffect } from "react";
import "./ShiftAssignment.css";
import DefaultLayoutAdmin from "../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin";
import { SidebarProvider } from "../../../../Layouts/DefaultLayoutAdmin/SidebarContext";
import ShiftAPI from "../../../../API/ShiftAPI";
import { DepartmentAPI } from "../../../../API/DepartmentAPI";
import { DoctorAPI } from "../../../../API/DoctorAPI";
import { ShiftAssignmentAPI } from "../../../../API/ShiftAssignmentAPI";
import { set } from "date-fns";
import YesNoDialog from "../../../../Components/YesNoDialog/YesNoDialog";
import { toast } from "react-toastify";
import { to } from "react-spring";
const ShiftAssignment = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [days, setDays] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [shifts, setShifts] = useState([]);
    const [listDoctor, setListDoctor] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    const [excludedDays, setExcludedDays] = useState([]);
    const [excludedDoctors, setExcludedDoctors] = useState([]);
    const [excludedShifts, setExcludedShifts] = useState([]);

    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();


    useEffect(() => {

        ShiftAssignmentAPI.getShiftAssignments({
            startDate: `${year}-${month.toString().padStart(2, "0")}-01`,
            endDate: `${year}-${month.toString().padStart(2, "0")}-31`
        })
            .then((res) => {
                const newAssignments = {};
                res.data.forEach((assignment) => {
                    newAssignments[`${new Date(assignment.date).getDate()}-${assignment.shift.name}`] = assignment.user._id;
                });
                setAssignments(newAssignments);
            })
            .catch(() => {
                toast.error("Lấy dữ liệu ca trực thất bại!");
            });
    }, [month, year]);


    useEffect(() => {
        DoctorAPI.getDoctors()
            .then(res => {
                const allDoctors = res.data;
                const filtered = selectedSpecialty
                    ? allDoctors.filter(doctor => doctor.doctorInfo.specialities[0]._id === selectedSpecialty)
                    : allDoctors;
                setListDoctor(allDoctors);
                setFilteredDoctors(filtered);
            })
            .catch(() => {
                toast.error("Lấy dữ liệu bác sĩ thất bại!");
            });
    }, [selectedSpecialty]);

    const handleSpecialtyChange = (e) => {
        setSelectedSpecialty(e.target.value);
    };


    useEffect(() => {
        DepartmentAPI.getAll()
            .then(res => {
                setSpecialties(res.data);
                setSelectedSpecialty(res.data[0]._id);
            })
            .catch(err => {
                toast.error("Lấy dữ liệu chuyên khoa thất bại!");
            });
    }, []);

    useEffect(() => {
        ShiftAPI.getAllShift()
            .then(res => {
                setShifts(res.data);
            })
            .catch(err => {
                toast.error("Lấy dữ liệu ca làm việc thất bại!");
            });

    }, []);

    useEffect(() => {
        const daysInMonth = new Date(year, month, 0).getDate();
        setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    }, [month, year]);


    const autoAssignShifts = () => {

        // kiểm tra xem có bác sĩ nào không được phân công không
        if (filteredDoctors.length === 0) {
            toast.error("Không có bác sĩ nào để phân công!");
            return;
        }

        const newAssignments = { ...assignments };

        days.forEach((day) => {
            if (excludedDays.includes(day)) return; // Bỏ qua những ngày bị loại trừ

            const dayDate = new Date(year, month - 1, day);
            if (dayDate >= today) {
                let availableEmployees = filteredDoctors.filter(
                    (doctor) => !excludedDoctors.includes(doctor._id) // Bỏ qua những bác sĩ bị loại trừ
                );

                shifts.forEach((shift) => {
                    if (excludedShifts.includes(shift._id)) return; // Bỏ qua những ca bị loại trừ

                    if (availableEmployees.length > 0) {
                        const randomIndex = Math.floor(Math.random() * availableEmployees.length);
                        newAssignments[`${day}-${shift.name}`] = availableEmployees[randomIndex]._id;
                        availableEmployees.splice(randomIndex, 1);
                    } else {
                        newAssignments[`${day}-${shift.name}`] = "Trống";
                    }
                });
            }
        });

        setAssignments(newAssignments);
    };


    const handleChangeAssignment = (day, shift, newEmployeeId) => {
        // Tìm khóa hiện tại của nhân viên mới được chọn (nếu đã tồn tại trong ngày đó)
        const currentEmployeeKey = Object.keys(assignments).find(
            (key) => key.startsWith(`${day}-`) && assignments[key] === newEmployeeId
        );

      

        // Tìm nhân viên hiện tại trong ca đang được thay đổi
        const currentEmployeeId = assignments[`${day}-${shift}`];

        if (currentEmployeeKey) {
            // Nếu nhân viên mới đã được phân công trong một ca khác, thì hoán đổi vị trí
            setAssignments({
                ...assignments,
                [currentEmployeeKey]: currentEmployeeId || "Trống", // Đổi nhân viên hiện tại lên ca cũ của nhân viên mới
                [`${day}-${shift}`]: newEmployeeId // Gán nhân viên mới vào ca hiện tại
            });
        } else {
            // Nếu không tìm thấy, chỉ cần cập nhật như bình thường
            setAssignments({
                ...assignments,
                [`${day}-${shift}`]: newEmployeeId
            });
        }
    };

    const handleSaveAssignment = () => {
        
        const shiftAssignments = Object.entries(assignments).map(([key, value]) => {
            const [day, shift] = key.split("-");
            return {
                // date định dạng theo kiểm 2021-09-01
                date: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
                shiftId: shifts.find((s) => s.name === shift)._id,
                doctorId: value === "Trống" ? null : value
            };
        });

        ShiftAssignmentAPI.createShiftAssignment(shiftAssignments)
            .then(() => {
                toast.success("Lưu ca trực thành công!");
            })
            .catch(() => {
                toast.error("Lưu ca trực thất bại!");
            });
    }

    const handleDeleteAssignment = () => {
        // Lọc ra những ca trực cần xóa của khoa hiện tại và tháng hiện tại
        const deleteShiftAssignment = Object.entries(assignments)
            .filter(([key]) => {
                const [day, shift] = key.split("-");
                const speciality = listDoctor.find((doctor) => doctor._id === assignments[key])?.doctorInfo.specialities[0]._id;
                return !excludedDays.includes(Number(day)) && !excludedShifts.includes(shift) && speciality === selectedSpecialty;
                
            })
            .map(([key]) => {
                const [day, shift] = key.split("-");
                return {
                    date: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
                    shiftId: shifts.find((s) => s.name === shift)._id
                };
            });
        
        ShiftAssignmentAPI.deleteShiftAssignment(deleteShiftAssignment)
            .then(() => {
                setAssignments({});
                setIsOpenDialog(false);
                toast.success("Xóa ca trực thành công!");
            })
            .catch(() => {
                setIsOpenDialog(false);
                toast.error("Xóa ca trực thất bại!");
            });

    }

    

    const handleExcludedDaysChange = (day) => {
        if (excludedDays.includes(day)) {
            setExcludedDays(excludedDays.filter((d) => d !== day));
        } else {
            setExcludedDays([...excludedDays, day]);
        }
    }

    const handleExcludedDoctorsChange = (doctorId) => {
        if (excludedDoctors.includes(doctorId)) {
            setExcludedDoctors(excludedDoctors.filter((id) => id !== doctorId));
        } else {
            setExcludedDoctors([...excludedDoctors, doctorId]);
        }
    }

    const handleExcludedShiftsChange = (shiftId) => {
        if (excludedShifts.includes(shiftId)) {
            setExcludedShifts(excludedShifts.filter((id) => id !== shiftId));
        } else {
            setExcludedShifts([...excludedShifts, shiftId]);
        }
    }


    return (
        <SidebarProvider>
            <YesNoDialog
                isOpen={isOpenDialog}
                title={"Xác nhận"}
                message={"Bạn có chắc chắn muốn xóa tất cả ca trực không?"}
                yesText={"Có"}
                noText={"Không"}
                onConfirm={handleDeleteAssignment}
                onCancel={() => setIsOpenDialog(false)}
                key={"delete-shift-assignment"}
            />
            <DefaultLayoutAdmin>
                <div className="shift-assignment">
                    {/* Bộ lọc chuyên khoa, tháng, năm */}
                    <div className="filters">
                        <label>Chuyên khoa
                            {specialties.length > 0 && (
                                <select value={selectedSpecialty} onChange={handleSpecialtyChange}>
                                    {specialties.map((specialty) => (
                                        <option key={specialty._id} value={specialty._id}>{specialty.name}</option>
                                    ))}
                                </select>
                            )}
                        </label>
                        <label>Tháng
                            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </label>
                        <label>Năm
                            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 10 + i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </label>
                        <div className="buttons">
                            <button className="btn delete" onClick={()=>setIsOpenDialog(true)}>Xóa</button>
                            <button className="btn save" onClick={handleSaveAssignment}>Lưu</button>
                        </div>
                    </div>
                    <div className="exclusion-filters-box">
                        <h3>Chọn lọc phân công</h3>
                        <div className="exclusion-filters">
                            <div className="exclude-days">
                                <h3>Chọn các ngày </h3>
                                <div>
                                    {days.map(day => (
                                        <label key={day}>
                                            <input
                                                type="checkbox"
                                                checked={excludedDays.includes(day)}
                                                onChange={() => handleExcludedDaysChange(day)}
                                            />
                                            Ngày {day}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="exclude-doctors">
                                <h3>Chọn bác sĩ</h3>
                                <div>
                                    {listDoctor.map(doctor => (
                                        doctor.doctorInfo.specialities[0]._id === selectedSpecialty && (    
                                            <label key={doctor._id}>
                                                <input
                                                    type="checkbox"
                                                    checked={excludedDoctors.includes(doctor._id)}
                                                    onChange={() => handleExcludedDoctorsChange(doctor._id)}
                                                />
                                                {doctor.firstName} {doctor.lastName}
                                            </label>
                                        )
                                        
                                    ))}
                                </div>
                            </div>
                            <div className="exclude-shifts">
                                <h3>Chọn ca trực</h3>
                                <div>
                                    {shifts.map(shift => (
                                        <label key={shift._id}>
                                            <input
                                                type="checkbox"
                                                checked={excludedShifts.includes(shift._id)}
                                                onChange={() => handleExcludedShiftsChange(shift._id)}
                                            />
                                            {shift.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button className="btn auto" onClick={autoAssignShifts}>Phân công tự động</button>
                    </div>


                    {/* Hiển thị lịch trực theo nhóm 4 ngày */}
                    {days.length > 0 && days.map((_, index) => index % 4 === 0 && (
                        <table key={index} className="shift-table-assignment">
                            <thead>
                                <tr>
                                    <th>Ca trực</th>
                                    {days.slice(index, index + 4).map(day => (
                                        <th key={day}>{`Ngày ${day}/${month}`}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.map((shift) => (
                                    <tr key={shift._id}>
                                        <td>{shift.name}</td>
                                        {days.slice(index, index + 4).map((day) => (
                                            <td key={`${shift.name}-${day}`}>
                                                <select
                                                    value={assignments[`${day}-${shift.name}`] || ""}
                                                    onChange={(e) => handleChangeAssignment(day, shift.name, e.target.value)}
                                                    disabled={
                                                        (year < currentYear) ||
                                                        (year === currentYear && month < currentMonth) ||
                                                        (year === currentYear && month === currentMonth && day <= currentDay)
                                                    }

                                                    
                                                >
                                                    <option value="">Trống</option>
                                                    {filteredDoctors.map((emp) => (
                                                        <option key={emp._id} value={emp._id}>
                                                            {emp.firstName} {emp.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ))}
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default ShiftAssignment;

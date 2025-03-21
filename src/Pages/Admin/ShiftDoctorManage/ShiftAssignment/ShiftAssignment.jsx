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
    const [numberOfWorkingDoctors, setNumberOfWorkingDoctors] = useState(1);

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
                    const day = new Date(assignment.date).getDate();
                    const key = `${day}-${assignment.shift.name}`;
                    if (!newAssignments[key]) {
                        newAssignments[key] = []; // Nếu chưa tồn tại, khởi tạo mảng rỗng
                    }

                    // Thêm ID người dùng vào mảng của key hiện tại
                    newAssignments[key].push(assignment.user._id);

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
        const MAX_EMPLOYEES_PER_SHIFT = Number(numberOfWorkingDoctors);
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
    
        if (filteredDoctors.length === 0) {
            toast.error("Không có bác sĩ nào để phân công!");
            return;
        }
    
        const newAssignments = { ...assignments };
    
        days.forEach((day) => {
            const assignedDoctorsPerDay = new Set();
            
            if (
                (year < currentYear) ||
                (year === currentYear && month < currentMonth) ||
                (year === currentYear && month === currentMonth && day < currentDay) ||
                excludedDays.includes(day)
            ) {
                return;
            }
    
            shifts.forEach((shift) => {
                if (excludedShifts.includes(shift._id)) {
                    return;
                }
    
                const key = `${day}-${shift.name}`;
                const assignedDoctors = newAssignments[key] || [];  // Lấy danh sách bác sĩ đã được phân công trong ngày và ca này
                
                const availableDoctors = filteredDoctors.filter(
                    (doctor) =>
                        !assignedDoctors.includes(doctor._id) && 
                        !assignedDoctorsPerDay.has(doctor._id) &&
                        !excludedDoctors.includes(doctor._id)
                );
    
                const randomDoctors = availableDoctors
                    .sort(() => Math.random() - 0.5)
                    .slice(0, MAX_EMPLOYEES_PER_SHIFT);
    
                if (randomDoctors.length === MAX_EMPLOYEES_PER_SHIFT) {
                    randomDoctors.forEach((doctor) => assignedDoctorsPerDay.add(doctor._id));
                    newAssignments[key] = randomDoctors.map((doctor) => doctor._id);
                }
            });
        });
    
        setAssignments(newAssignments);
    };


    const handleChangeAssignment = (day, shift, newEmployeeId, isChecked) => {
        const key = `${day}-${shift}`;
        const currentDoctors = assignments[key] || [];

        let updatedDoctors;

        if (isChecked) {
            // Nếu đang chọn, thêm bác sĩ mới vào mảng nếu chưa tồn tại
            if (!currentDoctors.includes(newEmployeeId)) {
                updatedDoctors = [...currentDoctors, newEmployeeId];
            } else {
                updatedDoctors = currentDoctors;
            }
        } else {
            // Nếu bỏ chọn, loại bỏ bác sĩ khỏi mảng
            updatedDoctors = currentDoctors.filter((id) => id !== newEmployeeId);
        }

        // Cập nhật trạng thái với mảng đã chỉnh sửa (có thể là mảng rỗng nếu không còn bác sĩ nào)
        setAssignments({
            ...assignments,
            [key]: updatedDoctors
        });
    };


    const handleSaveAssignment = () => {
        const shiftAssignments = Object.entries(assignments).flatMap(([key, doctorIds]) => {
            const [day, shift] = key.split("-");
            return doctorIds.map(doctorId => ({
                date: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
                shiftId: shifts.find((s) => s.name === shift)._id,
                doctorId
            }));
        });

        ShiftAssignmentAPI.createShiftAssignment(shiftAssignments)
            .then(() => {
                toast.success("Lưu ca trực thành công!");
            })
            .catch(() => {
                toast.error("Lưu ca trực thất bại!");
            });
    };

    const handleDeleteAssignment = () => {

        // chuyển assignments thành mảng các đối tượng để xóa
        const shiftAssignments = Object.entries(assignments).flatMap(([key, doctorIds]) => {
            const [day, shift] = key.split("-");
            return doctorIds.map(doctorId => ({
                date: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`, // Format ngày tháng
                shiftId: shifts.find((s) => s.name === shift)._id, // Lấy ra ID của ca trực
                doctorId
            }));
        });

        ShiftAssignmentAPI.deleteShiftAssignment(shiftAssignments)
            .then(() => {
                setAssignments({});
                setIsOpenDialog(false);
                setNumberOfWorkingDoctors(1);
                toast.success("Xóa ca trực thành công!");
            })
            .catch(() => {
                setIsOpenDialog(false);
                setNumberOfWorkingDoctors(1);
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
                            <button className="btn delete" onClick={() => setIsOpenDialog(true)}>Xóa</button>
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

                            <div className="number-doctor">
                                <h3>Số bác sĩ cần phân công</h3>
                                <input type="number" min="1" max={filteredDoctors.length} value={numberOfWorkingDoctors} onChange={(e) => setNumberOfWorkingDoctors(e.target.value)} />
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
                                        {days.slice(index, index + 4).map((day) => {
                                            const key = `${day}-${shift.name}`;
                                            const assignedDoctors = assignments[key] || []; // Lấy ra mảng các bác sĩ được phân công

                                            return (
                                                <td key={key}>
                                                    <div className="doctor-assignment">
                                                        {filteredDoctors.map((emp) => {
                                                            const isAssigned = assignedDoctors.includes(emp._id);

                                                            return (
                                                                <div key={emp._id} style={{ marginBottom: "5px" }}>
                                                                    <label>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isAssigned} // Tích chọn nếu bác sĩ đã được phân công
                                                                            onChange={(e) =>
                                                                                handleChangeAssignment(day, shift.name, emp._id, e.target.checked)
                                                                            }
                                                                            disabled={
                                                                                (year < currentYear) ||
                                                                                (year === currentYear && month < currentMonth) ||
                                                                                (year === currentYear && month === currentMonth && day < currentDay)
                                                                            }
                                                                        />
                                                                        {emp.firstName} {emp.lastName}
                                                                    </label>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                            );
                                        })}
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






{/* <select
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
                                                </select> */}
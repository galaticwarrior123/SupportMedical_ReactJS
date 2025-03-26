import { useState, useEffect } from "react";
import "./ShiftAssignment.css";
import DefaultLayoutAdmin from "../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin";
import { SidebarProvider } from "../../../../Layouts/DefaultLayoutAdmin/SidebarContext";
import ShiftAPI from "../../../../API/ShiftAPI";
import { DepartmentAPI } from "../../../../API/DepartmentAPI";
import { DoctorAPI } from "../../../../API/DoctorAPI";
import { ShiftAssignmentAPI } from "../../../../API/ShiftAssignmentAPI";
import { faEllipsisH, faClose, faArrowsUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import YesNoDialog from "../../../../Components/YesNoDialog/YesNoDialog";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


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
    const [assignmentsData, setAssignmentsData] = useState({});


    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const [expandedCells, setExpandedCells] = useState({});

    useEffect(() => {
        const key = `${year}-${month}`;
    
        if (assignmentsData[key]?.[selectedSpecialty]) {
            // Nếu đã có dữ liệu, hiển thị lại
            setAssignments(assignmentsData[key][selectedSpecialty]);
        } else {
            ShiftAssignmentAPI.getShiftAssignments({
                startDate: `${year}-${month.toString().padStart(2, "0")}-01`,
                endDate: `${year}-${month.toString().padStart(2, "0")}-31`,
                specialtyId: selectedSpecialty 
            })
                .then((res) => {
                    const newAssignments = {};
                    res.data.forEach((assignment) => {
                        const day = new Date(assignment.date).getDate();
                        const key = `${day}-${assignment.shift.name}`;
                        if (!newAssignments[key]) {
                            newAssignments[key] = [];
                        }
                        newAssignments[key].push(assignment.user._id);
                    });
    
                    setAssignmentsData(prev => ({
                        ...prev,
                        [key]: {
                            ...(prev[key] || {}), // Giữ lại dữ liệu cũ của tháng khác
                            [selectedSpecialty]: newAssignments
                        }
                    }));
    
                    setAssignments(newAssignments);
                })
                .catch(() => {
                    toast.error("Lấy dữ liệu ca trực thất bại!");
                });
        }
    }, [month, year, selectedSpecialty]);


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
        const key = `${year}-${month}`;
    
        if (filteredDoctors.length === 0) {
            toast.error("Không có bác sĩ nào để phân công!");
            return;
        }
    
        // Lấy dữ liệu cũ của tháng và chuyên khoa hiện tại
        let newAssignments = { ...assignmentsData[key]?.[selectedSpecialty] } || {};
    
        days.forEach((day) => {
            // Nếu ngày bị loại trừ, xóa toàn bộ ca của ngày đó
            if (excludedDays.includes(day)) {
                shifts.forEach((shift) => {
                    delete newAssignments[`${day}-${shift.name}`];
                });
                return;
            }
    
            shifts.forEach((shift) => {
                // Nếu ca bị loại trừ, xóa dữ liệu ca đó
                if (excludedShifts.includes(shift._id)) {
                    delete newAssignments[`${day}-${shift.name}`];
                    return;
                }
    
                const shiftKey = `${day}-${shift.name}`;
                let assignedDoctors = [];
    
                let availableDoctors = filteredDoctors
                    .filter((doctor) => !excludedDoctors.includes(doctor._id)) // Loại trừ bác sĩ
                    .sort(() => Math.random() - 0.5);
    
                assignedDoctors = availableDoctors
                    .slice(0, MAX_EMPLOYEES_PER_SHIFT)
                    .map((doctor) => doctor._id);
    
                newAssignments[shiftKey] = assignedDoctors;
            });
        });
    
        // Cập nhật state assignmentsData theo cả tháng, năm và chuyên khoa
        setAssignmentsData((prev) => ({
            ...prev,
            [key]: {
                ...(prev[key] || {}),
                [selectedSpecialty]: newAssignments
            }
        }));
    
        // Cập nhật state assignments để hiển thị ngay
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


        setAssignmentsData((prev) => ({
            ...prev,
            [`${year}-${month}`]: {
                ...(prev[`${year}-${month}`] || {}),
                [selectedSpecialty]: {
                    ...(prev[`${year}-${month}`]?.[selectedSpecialty] || {}),
                    [key]: updatedDoctors
                }
            }
        }));

        // Cập nhật trạng thái với mảng đã chỉnh sửa (có thể là mảng rỗng nếu không còn bác sĩ nào)
        setAssignments({
            ...assignments,
            [key]: updatedDoctors
        });
    };


    const handleSaveAssignment = () => {
        const today = new Date();
        const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        
        let allShiftAssignments = [];
        let updatedAssignmentsData = { ...assignmentsData };
    
        Object.keys(assignmentsData).forEach((monthYearKey) => {
            Object.keys(assignmentsData[monthYearKey]).forEach((specialtyId) => {
                const assignmentsForSpecialty = assignmentsData[monthYearKey][specialtyId];
                
                Object.entries(assignmentsForSpecialty).forEach(([shiftKey, doctorIds]) => {
                    const [day, shiftName] = shiftKey.split("-");
                    const [assignYear, assignMonth] = monthYearKey.split("-");
                    const assignmentDate = `${assignYear}-${assignMonth.padStart(2, "0")}-${day.padStart(2, "0")}`;
                    
                    if (assignmentDate >= todayString) {
                        const filteredDoctorIds = doctorIds.filter(doctorId =>
                            listDoctor.find(doc => doc._id === doctorId)?.doctorInfo.specialities[0]._id === specialtyId
                        );
    
                        if (filteredDoctorIds.length > 0) {
                            allShiftAssignments.push(...filteredDoctorIds.map(doctorId => ({
                                date: assignmentDate,
                                shiftId: shifts.find(s => s.name === shiftName)._id,
                                doctorId
                            })));
                        }
                    }
                });
            });
        });
    
        if (allShiftAssignments.length === 0) {
            toast.info("Không có ca trực hợp lệ để lưu.");
            return;
        }
    
        ShiftAssignmentAPI.createShiftAssignment(allShiftAssignments)
            .then(() => {
                setAssignmentsData(updatedAssignmentsData);
                toast.success("Lưu ca trực thành công!");
            })
            .catch(() => {
                toast.error("Lưu ca trực thất bại!");
            });
    };
    
    const handleDeleteAssignment = () => {
        const today = new Date();
        const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        const key = `${year}-${month}`;

        const newAssignments = { ...assignments }; // Sao chép state để không ảnh hưởng trực tiếp

        const shiftAssignments = Object.entries(assignments).flatMap(([shiftKey, doctorIds]) => {
            const [day, shift] = shiftKey.split("-");
            const assignmentDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            if (assignmentDate < todayString) {
                return [];
            }

            const filteredDoctorIds = doctorIds.filter(doctorId =>
                listDoctor.find(doc => doc._id === doctorId)?.doctorInfo.specialities[0]._id === selectedSpecialty
            );

            if (filteredDoctorIds.length > 0) {
                // Chỉ xóa bác sĩ thuộc chuyên khoa đang chọn
                newAssignments[shiftKey] = newAssignments[shiftKey].filter(id => !filteredDoctorIds.includes(id));
            }

            return filteredDoctorIds.map(doctorId => ({
                date: assignmentDate,
                shiftId: shifts.find((s) => s.name === shift)._id,
                doctorId
            }));
        });

        if (shiftAssignments.length === 0) {
            toast.info("Không có ca trực hợp lệ để xóa.");
            return;
        }

        ShiftAssignmentAPI.deleteShiftAssignment(shiftAssignments)
            .then(() => {
                // Cập nhật state, chỉ xóa ca của chuyên khoa đang chọn, giữ nguyên các chuyên khoa khác
                setAssignments(newAssignments);
                setAssignmentsData(prev => ({
                    ...prev,
                    [key]: newAssignments
                }));
                setIsOpenDialog(false);
                setNumberOfWorkingDoctors(1);
                toast.success("Xóa ca trực thành công!");
            })
            .catch(() => {
                setIsOpenDialog(false);
                setNumberOfWorkingDoctors(1);
                toast.error("Xóa ca trực thất bại!");
            });
    };


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



    const handleExtendDisplay = (key) => {
        setExpandedCells((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleCloseExtendDisplay = (key) => {
        setExpandedCells((prev) => ({
            ...prev,
            [key]: false,
        }));
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
                            <button className="btn delete" onClick={() => setIsOpenDialog(true)}>Xóa tất cả</button>
                            <button className="btn save" onClick={handleSaveAssignment}>Lưu</button>
                        </div>
                    </div>
                    <div className="exclusion-filters-box">
                        <h3>Tùy chỉnh phân công ca trực</h3>
                        <div className="exclusion-filters">
                            <div className="exclude-days">
                                <h3>Loại trừ ngày trực </h3>
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
                                <h3>Loại trừ bác sĩ</h3>
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
                                <h3>Loại trừ ca làm việc</h3>
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
                                <h3>Số bác sĩ mong muốn mỗi ca</h3>
                                <input type="number" min="1" max={filteredDoctors.length} value={numberOfWorkingDoctors} onChange={(e) => setNumberOfWorkingDoctors(e.target.value)} />
                            </div>
                        </div>

                        <div className="auto-assign-button">
                            <button className="btn auto" onClick={autoAssignShifts}>Phân công tự động</button>
                        </div>
                    </div>

                    {/* Hiển thị lịch trực theo nhóm 4 ngày */}
                    {days.length > 0 && days.map((_, index) => index % 4 === 0 && (
                        <table key={index} className="shift-table-assignment">
                            <thead>
                                <tr>
                                    <th>Ca trực</th>
                                    {days.slice(index, index + 4).map(day => {
                                        const date = new Date(year, month - 1, day); // Tạo đối tượng Date
                                        const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                                        const weekday = weekdays[date.getDay()]; // Lấy ra thứ tương ứng
                                        return (
                                            <th key={day}>{`${weekday} - Ngày ${day}/${month}`}</th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.map((shift) => (
                                    <tr key={shift._id}>
                                        <td>{shift.name}</td>
                                        {days.slice(index, index + 4).map((day) => {
                                            const key = `${day}-${shift.name}`;
                                            const assignedDoctors = assignments[key] || []; // Lấy ra mảng các bác sĩ được phân công
                                            const isExpanded = expandedCells[key];

                                            return (
                                                <td key={key} style={{ position: "relative" }}>
                                                    <button
                                                        style={{
                                                            position: 'absolute',
                                                            top: '0px',
                                                            right: '0px',
                                                            fontSize: '10px',
                                                            padding: '2px 4px',
                                                            border: 'none',
                                                        }}
                                                        onClick={() => handleExtendDisplay(key)}
                                                    >
                                                        <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
                                                    </button>

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

                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <div className="expanded-view">
                                                                <motion.div className="expanded-view-box"
                                                                    initial={{
                                                                        scale: 0.3,
                                                                        opacity: 0,
                                                                        x: 0,
                                                                        y: 0
                                                                    }}
                                                                    animate={{
                                                                        scale: 1,
                                                                        opacity: 1,
                                                                        x: "0",
                                                                        y: "0"
                                                                    }}
                                                                    exit={{
                                                                        scale: 0.3,
                                                                        opacity: 0
                                                                    }}
                                                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}


                                                                >
                                                                    <button className="close-expanded-view" onClick={() => handleCloseExtendDisplay(key)}>
                                                                        <FontAwesomeIcon icon={faClose} />
                                                                    </button>
                                                                    {filteredDoctors.map((emp) => {
                                                                        const isAssigned = assignedDoctors.includes(emp._id);
                                                                        return (
                                                                            <div key={emp._id} className="expanded-item">
                                                                                <label>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={isAssigned}
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
                                                                </motion.div>
                                                            </div>
                                                        )}
                                                    </AnimatePresence>
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
import { useState, useEffect } from "react";
import "./ShiftAssignment.css";
import DefaultLayoutAdmin from "../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin";
import { SidebarProvider } from "../../../../Layouts/DefaultLayoutAdmin/SidebarContext";

const ShiftAssignment = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [specialty, setSpecialty] = useState("Nội tiết");
    const [days, setDays] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [shifts, setShifts] = useState(["Sáng", "Chiều"]);
    const employees = ["Nguyễn Văn A", "Nguyễn Văn B", "Trần Thị C", "Lê Văn D", "Phạm Thị E", "Nguyễn Văn F"];


    useEffect(() => {
        const daysInMonth = new Date(year, month, 0).getDate();
        setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    }, [month, year]);


    const autoAssignShifts = () => {
        const newAssignments = {};

        days.forEach((day) => {
            let availableEmployees = [...employees]; // Copy danh sách nhân viên
            shifts.forEach((shift) => {
                if (availableEmployees.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableEmployees.length);
                    newAssignments[`${day}-${shift}`] = availableEmployees[randomIndex];
                    availableEmployees.splice(randomIndex, 1); // Loại bỏ nhân viên đã được phân công
                } else {
                    newAssignments[`${day}-${shift}`] = "Trống"; // Nếu không còn nhân viên, để trống
                }
            });
        });

        setAssignments(newAssignments);
    };


    const handleChangeAssignment = (day, shift, newEmployee) => {
        const shiftsOfDay = shifts.map(s => `${day}-${s}`);
        const assignedEmployees = shiftsOfDay.map(s => assignments[s]).filter(Boolean);

        if (assignedEmployees.includes(newEmployee)) {
            alert("Nhân viên này đã có ca khác trong ngày!");
            return;
        }

        setAssignments(prev => ({
            ...prev,
            [`${day}-${shift}`]: newEmployee
        }));
    };

    const handleDeleteAssignment = () => {
        if (assignments.length === 0) {
            alert("Không có ca trực nào để xóa!");
            return;
        }
        else {
            if (window.confirm("Bạn có chắc chắn muốn xóa tất cả ca trực không?")) {
                setAssignments({});
            }
        }
    }


    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="shift-assignment">
                    {/* Bộ lọc chuyên khoa, tháng, năm */}
                    <div className="filters">
                        <label>Chuyên khoa
                            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                                <option value="Nội tiết">Nội tiết</option>
                                <option value="Tim mạch">Tim mạch</option>
                                <option value="Hô hấp">Hô hấp</option>
                            </select>
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
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </label>
                        <div className="buttons">
                            <button className="btn delete" onClick={handleDeleteAssignment}>Xóa tất cả</button>
                            <button className="btn save">Lưu</button>
                            <button className="btn auto" onClick={autoAssignShifts}>Phân công tự động</button>
                        </div>
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
                                    <tr key={shift}>
                                        <td>{shift}</td>
                                        {days.slice(index, index + 4).map((day) => (
                                            <td key={`${shift}-${day}`}>
                                                <select
                                                    value={assignments[`${day}-${shift}`] || ""}
                                                    onChange={(e) => handleChangeAssignment(day, shift, e.target.value)}
                                                >
                                                    <option value="" disabled hidden>Chọn nhân viên</option>
                                                    {employees.map((emp) => (
                                                        <option key={emp} value={emp}>
                                                            {emp}
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

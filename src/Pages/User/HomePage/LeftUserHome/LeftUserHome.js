import './LeftUserHome.css';
import { DepartmentAPI } from '../../../../API/DepartmentAPI';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const LeftUserHome = () => {
    const navigate = useNavigate();
    const [allDepartment, setAllDepartment] = useState([]);

    useEffect(() => {
        fetchAllDepartment();
    }, []);

    const fetchAllDepartment = async () => {
        try {
            const response = await DepartmentAPI.getAll();
            if (response.status === 200) {
                setAllDepartment(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="left-user-home">
            <div className="left-user-home-topic">
                <div className="left-user-home-topic-header">
                    <span>Chủ đề nổi bật</span>
                </div>
                <div className="left-user-home-topic-listBox">
                    <ul>
                        {allDepartment && allDepartment.length > 0 ? allDepartment.map((department) => (
                            <li key={department._id}>
                                <button onClick={
                                    () => navigate(`/search?tagId=${department._id}&tab=posts`)
                                }>
                                    {department.name}
                                </button>
                            </li>
                        )) : (
                           <div>Không có chủ đề nào</div>
                        )}
                    </ul>
                </div>
            </div>
            <div className="left-user-home-footer">
                <div className="left-user-home-footer-header">
                    <span>Liên hệ</span>
                </div>
                <div className="left-user-home-footer-content">
                    <div className="left-user-home-footer-content-item">
                        <span>Hotline: 1900 1234</span>
                        <span>Email: Clinic@imail.edu.vn</span>
                        <span>Địa chỉ: 1 Võ Văn Ngân, Thủ Đức, TP.HCM</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftUserHome;
import './LeftUserHome.css';
import { DepartmentAPI } from '../../../../API/DepartmentAPI';
import { useEffect, useState } from 'react';
const LeftUserHome = () => {
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
                                <button>
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

            </div>
        </div>
    )
}

export default LeftUserHome;
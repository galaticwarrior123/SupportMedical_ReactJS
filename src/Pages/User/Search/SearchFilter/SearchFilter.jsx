import { useEffect, useState } from "react";
import { DepartmentAPI } from "../../../../API/DepartmentAPI";
import { useDispatch, useSelector } from "react-redux";
import './SearchFilter.css';
import { setPostFilter, setUserFilter } from "../../../../redux/slices/searchSlice";

const SearchFilter = () => {
    const dispatch = useDispatch();
    const { activeTab, postFilter, userFilter } = useSelector((state) => state.search);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        async function fetchDepartments() {
            const response = await DepartmentAPI.getAll();
            setDepartments(response.data);
        }

        if (activeTab === 'posts') {
            fetchDepartments();
        }
    }, [activeTab]);

    const handleDepartmentChange = (e) => {
        const departmentId = e.target.value;
        dispatch(setPostFilter({ tagId: departmentId }));
    }

    const handleIsDoctorChange = (e) => {
        const isDoctor = e.target.checked;
        dispatch(setUserFilter({ isDoctor }));
    }

    return (
        <div className="search-filter-container">
            {
                activeTab === 'posts' ? (
                    <div className="search-filter-criterion">
                        <p>Chọn chuyên khoa:</p>
                        <select value={postFilter.tagId} onChange={handleDepartmentChange} className="select-box">
                            <option value=''>Tất cả</option>
                            {
                                departments.map((department) => (
                                    <option key={department._id} value={department._id}>
                                        {department.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                ) : (
                    <div className="search-filter-criterion">
                        {/* checkbox chỉ bác sĩ */}
                        <input 
                            type="checkbox" id="isDoctor" name="isDoctor" 
                            value={userFilter.isDoctor} 
                            onChange={handleIsDoctorChange} />
                        <label htmlFor="isDoctor">Chỉ bác sĩ</label>
                    </div>
                )
            }
        </div>
    );
};

export default SearchFilter;
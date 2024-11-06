import React, { useState, useEffect } from 'react';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import './CategoryManage.css';
import { faEdit, faTrash, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DepartmentAPI } from '../../../API/DepartmentAPI';
const CategoryManage = () => {
    // Sample data for demonstration
    const [allData, setAllData] = useState([]);
    const [newDepartment, setNewDepartment] = useState('');
    // State management
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchAllSpeciality();
    }, []);
    // Calculate data to display based on pagination
    useEffect(() => {
        const filteredData = allData.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedData(filteredData.slice(startIndex, endIndex));
    }, [currentPage, itemsPerPage, allData, searchTerm]);

    const fetchAllSpeciality = async () => {
        try {
            const response = await DepartmentAPI.getAll();
            if (response.status === 200) {
                setAllData(response.data);
            }
        } catch (error) {
            toast.error('Lỗi tải dữ liệu');
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleAddNewDeparment = () => {
        if (newDepartment === '') {
            toast.error('Vui lòng nhập tên khoa');
            return;
        }
        const newCategory = {
            name: newDepartment
        };
        DepartmentAPI.createDepartment(newCategory).then((response) => {
            setNewDepartment('');
            fetchAllSpeciality();
            toast.success('Thêm mới khoa thành công');
        }).catch((error) => {
            toast.error('Lỗi thêm mới khoa');
        });
    };

    // Handle items per page change
    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page when items per page change
    };

    // Generate pagination buttons with ellipses
    const generatePaginationButtons = () => {
        const totalPages = Math.ceil(allData.length / itemsPerPage);
        const pages = [];
        const maxButtons = 5; // Maximum number of page buttons to show
        const halfRange = Math.floor(maxButtons / 2);

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const leftDots = currentPage > halfRange + 1;
            const rightDots = currentPage < totalPages - halfRange;

            if (leftDots) {
                pages.push(1);
                pages.push('...');
            }

            const start = Math.max(2, currentPage - halfRange);
            const end = Math.min(totalPages - 1, currentPage + halfRange);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (rightDots) {
                pages.push('...');
                pages.push(totalPages);
            }
        }

        // Always include '1' and the last page if they're not already included
        if (!pages.includes(1)) {
            pages.unshift(1);
        }
        if (!pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages.map((page, index) => (
            <button
                key={index}
                className={currentPage === page ? 'active' : ''}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={typeof page === 'string'}
            >
                {page}
            </button>
        ));
    };
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditName(item.name);
    };

    const handleUpdateDeparment = (id) => {
        const updatedCategory = {
            name: editName
        };
        DepartmentAPI.updateDepartment(id, updatedCategory).then((response) => {
            setEditId(null);
            fetchAllSpeciality();
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleCancelEdit = () => {
        setEditId(null);
    };

    const handleDeleteDeparment = (id) => {
        DepartmentAPI.deleteDepartment(id).then((response) => {
            if(response.data.error){
                toast.error('Không thể xóa khoa này');
            }else{
                fetchAllSpeciality();
                toast.success('Xóa khoa thành công');
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="category-manage">
                    <div className="top-section">
                        <div className="search-section">
                            <div className="input-group">
                                <input type="text" className="input-field" placeholder="Nhập tên khoa" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} />
                                <button className="add-button" onClick={handleAddNewDeparment}>+ Thêm mới</button>
                            </div>
                            <div className="input-group">
                                <div className='input-group-body'>
                                    <input
                                        type="text"
                                        className="input-search"
                                        placeholder="Tìm kiếm tên khoa"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
                                    />
                                    {/* <div className="input-group-item-icon">
                                        <button className="search-button">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên khoa</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length>0 ? (paginatedData.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {editId === item._id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}

                                            />
                                        ) : (
                                            item.name
                                        )}
                                    </td>
                                    <td>
                                        {editId === item._id ? (
                                            <>
                                                <button className="edit-button" onClick={() => handleUpdateDeparment(item._id)}>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                                <button className="delete-button" onClick={handleCancelEdit}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="edit-button" onClick={() => handleEdit(item)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button className="delete-button-category" onClick={() => handleDeleteDeparment(item._id)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </>
                                        )}
                                        {/* <button className="edit-button">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="delete-button" onClick={() => handleDeleteDeparment(item._id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button> */}
                                    </td>
                                </tr>
                            ))) : (
                                <tr>
                                    <td colSpan="3">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <span>Hiển thị</span>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, allData.length)} của {allData.length}</span>
                        <div className="page-controls">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                &lt;
                            </button>
                            {generatePaginationButtons()}
                            <button
                                disabled={currentPage === Math.ceil(allData.length / itemsPerPage)}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>

    );
};

export default CategoryManage;

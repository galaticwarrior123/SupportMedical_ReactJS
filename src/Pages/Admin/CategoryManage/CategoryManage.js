import React, { useState, useEffect } from 'react';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import './CategoryManage.css';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';

const CategoryManage = () => {
    // Sample data for demonstration
    const allData = Array.from({ length: 150 }, (_, index) => ({
        id: `DPT ${index + 1}`,
        name: `Khoa ${index + 1}`
    }));

    // State management
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState([]);
    const [newCategrory, setNewCategory] = useState('');

    // Calculate data to display based on pagination
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedData(allData.slice(startIndex, endIndex));
    }, [currentPage, itemsPerPage]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleAddNewCategory = () => {
        if (newCategrory) {
            const newCategory = {
                id: `DPT ${allData.length + 1}`,
                name: newCategrory
            };
            allData.push(newCategory);
            setNewCategory('');
        }
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

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="category-manage">
                    <div className="top-section">
                        <div className="search-section">
                            <div className="input-group">
                                <input type="text" className="input-field" placeholder="Nhập tên khoa" value={newCategrory} onChange={(e) => setNewCategory(e.target.value)} />
                                <button className="add-button" onClick={handleAddNewCategory}>+ Thêm mới</button>
                            </div>
                            <div className="input-group">
                                <div className='input-group-body'>
                                    <div className="input-group-item">
                                        <input type="text" className="input-search" placeholder="Tìm kiếm" />
                                    </div>
                                    <div className="input-group-item-icon">
                                        <button className="search-button">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã tên</th>
                                <th>Tên khoa</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <button className="edit-button">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="delete-button">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
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

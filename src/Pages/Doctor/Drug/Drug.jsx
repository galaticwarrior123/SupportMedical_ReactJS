import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DoctorLayout from '../../../Layouts/Doctor/DoctorLayout';
import { TypeDrugAPI } from '../../../API/TypeDrugAPI';
import { DrugAPI } from '../../../API/DrugAPI';

const Drug = () => {
    const [drug, setDrug] = useState([]);
    const [typeDrug, setTypeDrug] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('');

    useEffect(() => {
        const fetchTypeDrug = async () => {
            try {
                const response = await TypeDrugAPI.getAll();
                setTypeDrug(response.data);
            } catch (error) {
                toast.error('Lỗi khi tải danh sách loại thuốc!');
            }
        };
        const fetchDrug = async () => {
            try {
                const response = await DrugAPI.getAll();
                setDrug(response.data);
            } catch (error) {
                toast.error('Lỗi khi tải danh sách thuốc!');
            }
        };
        fetchDrug();
        fetchTypeDrug();
    }, []);

    const filteredDrugs = drug.filter((med) => {
        const matchName = med.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = searchType === '' || med.type._id === searchType;
        return matchName && matchType;
    });

    const paginatedData = filteredDrugs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset về trang 1 khi thay đổi số item/trang
    };


    const generatePaginationButtons = () => {
        let buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };




    return (
        <DoctorLayout>
            <div className="drug-manage-page">

                <div className="drug-manage-page-search">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên thuốc..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="search-select-type"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="">Tất cả loại thuốc</option>
                        {typeDrug.map(type => (
                            <option key={type._id} value={type._id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                <table className="med-table">
                    <colgroup>
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '55%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Tên thuốc</th>
                            <th>Liều lượng {`(đơn vị/mg)`}</th>
                            <th>Nhà sản xuất</th>
                            <th>Loại thuốc</th>
                            <th>Mô tả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(med => (
                            <tr key={med._id}>
                                <td>{med.name}</td>
                                <td>{med.dosage}</td>
                                <td>{med.brand}</td>
                                <td>{med.type.name}</td>
                                <td><pre>{med.description || 'Không có'}</pre></td>
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
                    <span>
                        {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredDrugs.length)} của {totalPages}
                    </span>
                    <div className="page-controls">
                        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                            &lt;
                        </button>
                        {generatePaginationButtons()}
                        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default Drug;

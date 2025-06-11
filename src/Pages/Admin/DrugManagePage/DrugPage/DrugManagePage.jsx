import React, { useEffect, useState } from 'react';
import DefaultLayoutAdmin from '../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import './DrugManagePage.css';
import { DrugAPI } from '../../../../API/DrugAPI';
import { TypeDrugAPI } from '../../../../API/TypeDrugAPI';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import YesNoDialog from '../../../../Components/YesNoDialog/YesNoDialog';
import { motion, AnimatePresence } from 'framer-motion';
const DrugManagePage = () => {
    const [drug, setDrug] = useState([]);
    const [typeDrug, setTypeDrug] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [formData, setFormData] = useState({ name: '', dosage: '', type: '', brand: '', description: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('');
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [idDrugDelete, setIdDrugDelete] = useState(null);

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

    const openModal = (med = null) => {
        setEditingMed(med);
        setFormData(med ? { name: med.name, dosage: med.dosage, type: med.type._id, brand: med.brand, description: med.description } : { name: '', dosage: '', type: '', brand: '', description: '' });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingMed(null);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.dosage || !formData.type || !formData.brand) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }


        if (editingMed) {
            const updatedMed = {
                ...formData,
            };
            DrugAPI.update(editingMed._id, updatedMed).then((response) => {
                const typeObj = typeDrug.find(t => t._id === response.data.type);
                // Gắn object type vào dữ liệu thuốc đã cập nhật
                response.data.type = typeObj;
                setDrug(prev => prev.map(med => med._id === response.data._id ? response.data : med));
                setEditingMed(null);
                setFormData({ name: '', dosage: '', type: '', brand: '', description: '' });
                toast.success('Cập nhật thuốc thành công!');
            }).catch(() => {
                toast.error('Lỗi khi cập nhật thuốc!');
            });
        } else {
            const newMed = {
                ...formData,
            };
            DrugAPI.create(newMed).then((response) => {
                // Tìm object type tương ứng từ danh sách typeDrug
                const typeObj = typeDrug.find(t => t._id === response.data.type);

                // Gắn object type vào dữ liệu thuốc mới
                const newDrugWithType = { ...response.data, type: typeObj };

                setDrug(prev => [...prev, newDrugWithType]);
                setFormData({ name: '', dosage: '', type: '', brand: '', description: '' });
                toast.success('Thêm thuốc thành công!');
            }).catch(() => {
                toast.error('Lỗi khi thêm thuốc!');
            });
        }
        closeModal();
    };

    const handleDeleteClick = (id) => {
        setIdDrugDelete(id);
        setIsOpenDialog(true);
    }

    const handleDelete = (id) => {
        DrugAPI.delete(id).then(() => {
            setDrug(prev => prev.filter(med => med._id !== id));
            setIsOpenDialog(false);
            toast.success('Xóa thuốc thành công!');
        }).catch(() => {
            toast.error('Lỗi khi xóa thuốc!');
        });
    };


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
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <YesNoDialog
                    isOpen={isOpenDialog}
                    title={"Xác nhận"}
                    message={"Bạn có chắc chắn muốn xóa thuốc này không?"}
                    yesText={"Có"}
                    noText={"Không"}
                    onConfirm={() => handleDelete(idDrugDelete)}
                    onCancel={() => setIsOpenDialog(false)}
                    key={"delete-drug-dialog"}
                />
                <div className="drug-manage-page">
                    <div className="drug-manage-page-header">
                        <button className="add-btn" onClick={() => openModal()}>+ Thêm thuốc</button>
                    </div>

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
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '10%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Tên thuốc</th>
                                <th>Liều lượng {`(đơn vị/mg)`}</th>
                                <th>Nhà sản xuất</th>
                                <th>Loại thuốc</th>
                                <th>Mô tả</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(med => (
                                <tr key={med._id}>
                                    <td>{med.name}</td>
                                    <td>{med.dosage}</td>
                                    <td>{med.brand}</td>
                                    <td>{med.type.name}</td>
                                    <td>{med.description || 'Không có'}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => openModal(med)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteClick(med._id)}>
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

                    <AnimatePresence>
                        {modalOpen && (
                            <div className="modal-overlay">
                                <motion.div className="modal"
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
                                    <h3>{editingMed ? 'Cập nhật thuốc' : 'Thêm thuốc'}</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="inputGroupDrugModal">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder=""
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label>Tên thuốc</label>
                                        </div>
                                        <div className="inputGroupDrugModal">
                                            <input
                                                type="number"
                                                name="dosage"
                                                placeholder=""
                                                value={formData.dosage}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label>Liều lượng {`(đơn vị/mg)`} </label>
                                        </div>
                                        <div className="inputGroupDrugModal">
                                            <input
                                                type="text"
                                                name="brand"
                                                placeholder=""
                                                value={formData.brand}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label>Nhà sản xuất</label>
                                        </div>
                                        <select name="type" onChange={handleChange} required value={formData.type}>
                                            <option value="" hidden>Chọn loại thuốc</option>
                                            {typeDrug.map(type => (
                                                <option key={type._id} value={type._id}>{type.name}</option>
                                            ))}
                                        </select>
                                        <div className="inputGroupDrugModal">
                                            <textarea
                                                name="description"
                                                placeholder=""
                                                value={formData.description}
                                                onChange={handleChange}
                                            ></textarea>
                                            <label>Mô tả {`(nếu có)`}</label>
                                        </div>
                                        <div className="modal-actions">
                                            <button type="submit">{editingMed ? 'Cập nhật' : 'Thêm'}</button>
                                            <button type="button" onClick={closeModal}>Hủy</button>
                                        </div>
                                    </form>
                                </motion.div >
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default DrugManagePage;

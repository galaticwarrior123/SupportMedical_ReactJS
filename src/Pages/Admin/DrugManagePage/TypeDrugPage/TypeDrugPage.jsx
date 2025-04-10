import DefaultLayoutAdmin from '../../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import './TypeDrugPage.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TypeDrugAPI } from '../../../../API/TypeDrugAPI';
import { toast } from 'react-toastify';
import YesNoDialog from '../../../../Components/YesNoDialog/YesNoDialog';
import { motion, AnimatePresence } from 'framer-motion';
const TypeDrugPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [drugTypes, setDrugTypes] = useState([]);

    const [formData, setFormData] = useState({ name: '', description: '' });

    const [editingType, setEditingType] = useState(null); // Lưu loại đang được chỉnh sửa
    const [editForm, setEditForm] = useState({ name: '', description: '' });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TypeDrugAPI.getAll();
                setDrugTypes(response.data);
            } catch (error) {
                toast.error('Lỗi khi tải danh sách loại thuốc!');
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = () => {
        if (formData.name.trim() === '') {
            toast.error('Tên danh mục thuốc không được để trống!');
            return;
        }

        const newType = {
            ...formData,
        };

        TypeDrugAPI.create(newType).then((response) => {
            setDrugTypes(prev => [...prev, response.data]);
            setFormData({ name: '', description: '' });
            toast.success('Thêm danh mục thuốc thành công!');
        }).catch((error) => {
            toast.error('Lỗi khi thêm danh mục thuốc!');
        });
    };

    const handleDelete = (id) => {
        TypeDrugAPI.delete(id).then(() => {
            setDrugTypes(prev => prev.filter(item => item._id !== id));
            toast.success('Xóa danh mục thuốc thành công!');
        }).catch((error) => {
            toast.error('Lỗi khi xóa danh mục thuốc!');
        });
    };

    const openEditModal = (type) => {
        setEditingType(type);
        setEditForm({ name: type.name, description: type.description || '' });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = () => {
        TypeDrugAPI.update(editingType._id, editForm).then((response) => {
            setDrugTypes(prev =>
                prev.map(item =>
                    item._id === editingType._id
                        ? { ...item, name: editForm.name, description: editForm.description }
                        : item
                )
            );
            setEditingType(null);
            toast.success('Cập nhật danh mục thuốc thành công!');
        }
        ).catch((error) => {
            toast.error('Lỗi khi cập nhật danh mục thuốc!');
        });
        setEditingType(null);
    };

    const filteredTypes = drugTypes.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset về trang 1 khi thay đổi số item/trang
    };

    const paginatedData = filteredTypes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredTypes.length / itemsPerPage);

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

    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [idTypeDelete, setIdTypeDelete] = useState(null);

    const handleClickDelete = (id) => {
        setIdTypeDelete(id);
        setIsOpenDialog(true);
    }

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <YesNoDialog
                    isOpen={isOpenDialog}
                    title={"Xác nhận"}
                    message={"Bạn có chắc chắn muốn xóa loại thuốc này không?"}
                    yesText={"Có"}
                    noText={"Không"}
                    onConfirm={() => handleDelete(idTypeDelete)}
                    onCancel={() => setIsOpenDialog(false)}
                    key={"delete-type-drug"}
                />
                <div className="typeDrugContainer">

                    <div className="formSection">
                        <span className="formTitle">Thêm danh mục thuốc</span>
                        <div className="inputGroupDrug">
                            <input
                                type="text"
                                name="name"
                                placeholder=''
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Tên danh mục thuốc</label>
                        </div>
                        <div className="inputGroupDrug">
                            <input
                                name="description"
                                value={formData.description}
                                placeholder=''
                                onChange={handleInputChange}
                                required
                            />
                            <label>Mô tả (nếu có)</label>
                        </div>
                        <button onClick={handleAdd}>Thêm danh mục</button>
                    </div>

                    <div className="searchSection">
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="listSection">
                        <table>
                            <colgroup>
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '55%' }} />
                                <col style={{ width: '10%' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((type) => (
                                    <tr key={type._id}>
                                        <td>{type.name}</td>
                                        <td>{type.description}</td>
                                        <td>
                                            <button className="editBtn" onClick={() => openEditModal(type)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="deleteBtn" onClick={() => handleClickDelete(type._id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedData.length === 0 && (
                                    <tr><td colSpan="3">Không tìm thấy danh mục phù hợp.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                    <div className="pagination">
                        <span>Hiển thị</span>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span>
                            {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTypes.length)} của {totalPages}
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

                {/* Modal Edit */}
                <AnimatePresence>
                    {editingType && (
                        <div className="modalOverlay">
                            <motion.div className="modalContent"
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
                                <div className="modalHeader">
                                    <h3>Chỉnh sửa danh mục</h3>
                                    <button onClick={() => setEditingType(null)} className="closeModalBtn">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className='inputGroupTypeDrug'>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder=""
                                        value={editForm.name}
                                        onChange={handleEditInputChange}
                                    />
                                    <label>Tên danh mục thuốc</label>
                                </div>
                                <div className='inputGroupTypeDrug'>
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder=""
                                        value={editForm.description}
                                        onChange={handleEditInputChange}
                                    />
                                    <label>Mô tả {`(nếu có)`}</label>
                                </div>
                                <button onClick={handleSaveEdit} className="saveEditBtn">Lưu thay đổi</button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default TypeDrugPage;

import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { useEffect, useState } from 'react';
import './MedExamServicePage.css';
import { MedExamServiceAPI } from '../../../API/MedExamServiceAPI';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import YesNoDialog from '../../../Components/YesNoDialog/YesNoDialog';

const MedExamServicePage = () => {
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [rawPrice, setRawPrice] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [updatedService, setUpdatedService] = useState({});
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [idMedExamServiceDelete, setIdMedExamServiceDelete] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        MedExamServiceAPI.getMedExamServices()
            .then(res => setServices(res.data))
            .catch(err =>
                toast.error('Lỗi khi lấy dữ liệu dịch vụ khám bệnh')
            );
    }, []);

    const filteredServices = services.filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const formatCurrency = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
    };

    const handlePriceChange = (e) => {
        let rawValue = e.target.value.replace(/\D/g, ''); // Chỉ giữ lại số
        setRawPrice(rawValue);
        setServicePrice(rawValue ? formatCurrency(rawValue) : '');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            let newRawPrice = rawPrice.slice(0, -1); // Xóa ký tự cuối cùng
            setRawPrice(newRawPrice);
            setServicePrice(newRawPrice ? formatCurrency(newRawPrice) : '');
            e.preventDefault(); // Ngăn chặn hành vi mặc định
        }
    };

    const handlePriceFocus = () => {
        setServicePrice(rawPrice); // Khi focus, chỉ hiển thị số để nhập dễ hơn
    };

    const handlePriceBlur = () => {
        if (rawPrice) {
            setServicePrice(formatCurrency(rawPrice)); // Khi rời ô, định dạng lại giá tiền
        }
    };

    const handleAddService = () => {
        if (!serviceName || !rawPrice) {
            toast.error('Vui lòng nhập đủ thông tin');
            return;
        }

        const data = {
            name: serviceName,
            fee: parseInt(rawPrice, 10) // Chỉ lấy số để gửi API
        };

        MedExamServiceAPI.createMedExamService(data)
            .then(res => {
                toast.success('Thêm dịch vụ thành công');
                setServices([...services, res.data]);
                setServiceName('');
                setServicePrice('');
                setRawPrice('');
            })
            .catch(err => {
                toast.error('Lỗi khi thêm dịch vụ');
            });
    };

    const handleOpenEditModal = (service) => {
        setIsEdit(true);
        setUpdatedService(service);
        setRawEditPrice(service.fee.toString())
    };

    const handleDeleteService = (id) => {
        MedExamServiceAPI.deleteMedExamService(id)
            .then(res => {
                toast.success('Xóa dịch vụ thành công');
                setServices(services.filter(service => service._id !== id));
                setIsOpenDialog(false);
            })
            .catch(err => {
                toast.error('Lỗi khi xóa dịch vụ');
                setIsOpenDialog(false);
            }
            );
    };

    const handleUpdateService = (id) => {
        const data = {
            name: updatedService.name,
            fee: parseInt(updatedService.fee.replace(/\D/g, ''), 10)
        };


        MedExamServiceAPI.updateMedExamService(id, data)
            .then(res => {
                toast.success('Cập nhật dịch vụ thành công');
                setServices(services.map(service => service._id === id ? res.data : service));
                setIsEdit(false);
            })
            .catch(err => {
                toast.error('Lỗi khi cập nhật dịch vụ');
            });
    };


    const [rawEditPrice, setRawEditPrice] = useState(''); // Thêm state lưu số tiền thô khi edit

    const handleEditPriceChange = (e) => {
        let rawValue = e.target.value.replace(/\D/g, ''); // Chỉ giữ số
        setRawEditPrice(rawValue);
        setUpdatedService({ ...updatedService, fee: rawValue ? parseInt(rawValue, 10) : 0 });
    };

    const handleEditPriceKeyDown = (e) => {
        if (e.key === 'Backspace') {
            let newRawPrice = rawEditPrice.slice(0, -1); // Xóa ký tự cuối cùng
            setRawEditPrice(newRawPrice);
            setUpdatedService({ ...updatedService, fee: newRawPrice ? parseInt(newRawPrice, 10) : 0 });
            e.preventDefault(); // Ngăn hành vi mặc định
        }
    };

    const handleEditPriceBlur = () => {
        if (!rawEditPrice) {
            setUpdatedService({ ...updatedService, fee: 0 }); // Giữ số 0 thay vì NaN
        } else {
            setUpdatedService({ ...updatedService, fee: formatCurrency(rawEditPrice) });
        }
    };

    const handleEditPriceFocus = () => {
        setUpdatedService({ ...updatedService, fee: rawEditPrice });
    }

    const handleOpenDeleteService = (id) => {
        setIdMedExamServiceDelete(id);
        setIsOpenDialog(true);
    }

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <YesNoDialog
                    isOpen={isOpenDialog}
                    title={"Xác nhận"}
                    message={"Bạn có chắc chắn muốn xóa dịch vụ này không?"}
                    yesText={"Có"}
                    noText={"Không"}
                    onConfirm={() => handleDeleteService(idMedExamServiceDelete)}
                    onCancel={() => setIsOpenDialog(false)}
                    key={"delete-med-exam-service-dialog"}
                />
                <AnimatePresence>
                    {isEdit && (
                        <div className="edit-service-modal">
                            <motion.div className="edit-service-modal-content"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}

                            >
                                <div className="edit-service-modal-header">
                                    <h3>Sửa dịch vụ</h3>
                                    <button className="close-edit-service-modal-btn" onClick={() => setIsEdit(false)}>
                                        <FontAwesomeIcon icon={faClose} />
                                    </button>
                                </div>
                                <div className="input-edit-service-modal-group">
                                    <label htmlFor="service-name">Tên dịch vụ:</label>
                                    <input
                                        id="service-name"
                                        type="text"
                                        value={updatedService.name}
                                        onChange={(e) => setUpdatedService({ ...updatedService, name: e.target.value })}
                                    />
                                </div>

                                {/* Nhập giá tiền */}
                                <div className="input-edit-service-modal-group">
                                    <label htmlFor="service-price">Giá tiền:</label>
                                    <input
                                        id="service-price"
                                        type="text"
                                        value={rawEditPrice ? formatCurrency(rawEditPrice) : '0 VND'}
                                        onChange={handleEditPriceChange}
                                        onKeyDown={handleEditPriceKeyDown}
                                        onBlur={handleEditPriceBlur}
                                        onFocus={handleEditPriceFocus}
                                    />
                                </div>

                                {/* Nút lưu & hủy */}
                                <div className="modal-actions">
                                    <button className="cancel-edit-service-modal-btn" onClick={() => setIsEdit(false)}>Hủy</button>
                                    <button className="save-edit-service-modal-btn" onClick={() => handleUpdateService(updatedService._id)}>Lưu</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="med-exam-container">
                    <div className="med-exam-form">
                        <div className='med-exam-form-input-group'>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder=" "
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    id="service-name"
                                />
                                <label htmlFor="service-name">Nhập tên dịch vụ:</label>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder=" "
                                    value={servicePrice}
                                    onChange={handlePriceChange}
                                    onKeyDown={handleKeyDown}
                                    onBlur={handlePriceBlur}
                                    onFocus={handlePriceFocus}
                                    id="service-price"
                                />
                                <label htmlFor="service-price">Nhập giá tiền:</label>
                            </div>
                        </div>
                        <button className="add-service-btn" onClick={handleAddService}>+ Thêm dịch vụ</button>
                    </div>
                    <input type="text" className="search-box" placeholder="Tìm kiếm" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />
                    <table className="service-table">
                        <thead>
                            <tr>
                                <th className="small-col">STT</th>
                                <th className="wide-col">Tên dịch vụ</th>
                                <th className="wide-col">Giá tiền</th>
                                <th className="small-col">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.length > 0 ? filteredServices.map((service, index) => (
                                <tr key={service._id}>
                                    <td>{index + 1}</td>
                                    <td>{service.name}</td>
                                    <td>{formatCurrency(service.fee)}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleOpenEditModal(service)}>Sửa</button>
                                        <button className="delete-btn" onClick={() => handleOpenDeleteService(service._id)}> Xóa</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>Không có dữ liệu</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default MedExamServicePage;

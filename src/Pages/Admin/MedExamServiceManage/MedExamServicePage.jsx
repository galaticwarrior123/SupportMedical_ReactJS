import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { useState } from 'react';
import './MedExamServicePage.css';

const MedExamServicePage = () => {
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');

    const handleAddService = () => {
        if (serviceName && servicePrice) {
            setServices([...services, { id: Date.now(), name: serviceName, price: servicePrice }]);
            setServiceName('');
            setServicePrice('');
        }
    };

    const handleDeleteService = (id) => {
        setServices(services.filter(service => service.id !== id));
    };

    const handleUpdateService = (id) => {
        const newPrice = prompt('Nhập giá mới:');
        if (newPrice) {
            setServices(services.map(service => service.id === id ? { ...service, price: newPrice } : service));
        }
    };

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="med-exam-container">
                    <div className="med-exam-form">
                        <input type="text" placeholder="Nhập tên dịch vụ" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
                        <input type="number" placeholder="Nhập giá tiền" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} />
                        <button className="add-btn" onClick={handleAddService}>+ Thêm dịch vụ</button>
                    </div>
                    <input type="text" className="search-box" placeholder="Tìm kiếm" />
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
                            {services.map((service, index) => (
                                <tr key={service.id}>
                                    <td>{index + 1}</td>
                                    <td>{service.name}</td>
                                    <td>{service.price} VNĐ</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleUpdateService(service.id)}> Sửa</button>
                                        <button className="delete-btn" onClick={() => handleDeleteService(service.id)}> Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default MedExamServicePage;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ManageRecordsPage.css';
import { faUser, faBirthdayCake, faPhone, faVenusMars, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import LayoutManageRecordsPage from '../LayoutManageRecordsPage';
import { useEffect, useState } from 'react';


const listRecords = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        dob: "01/01/1990",
        phone: "0123456789",
        gender: "Nam",
        address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh"
    },
    {
        id: 2,
        name: "Nguyễn Văn B",
        dob: "01/01/1990",
        phone: "0123456789",
        gender: "Nam",
        address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh"
    }
]


const ManageRecordsPage = () => {
    const [visibleRecords, setVisibleRecords] = useState([]);

    useEffect(() => {
        listRecords.forEach((record, index) => {
            setTimeout(() => {
                setVisibleRecords(prev => [...prev, record]);
            }, index * 50);
        });
    }, []);

    return (
        <LayoutManageRecordsPage>
            <>

                <h2 className="title-manage-records">Danh sách hồ sơ bệnh nhân</h2>

                {visibleRecords.length > 0 ? visibleRecords.map((record) => (
                    <div className="record-card" key={record.id}>
                        <div className="record-card-up">
                            <p>
                                <FontAwesomeIcon icon={faUser} className="fa-icon" />
                                <strong>Họ và tên:</strong> <strong style={{ color: "#2697EC" }}>{record.name}</strong>
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faBirthdayCake} className="fa-icon" />
                                <strong>Ngày sinh:</strong> {record.dob}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faPhone} className="fa-icon" />
                                <strong>Số điện thoại:</strong> {record.phone}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faVenusMars} className="fa-icon" />
                                <strong>Giới tính:</strong> {record.gender}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faMapMarkedAlt} className="fa-icon" />
                                <strong>Địa chỉ:</strong> {record.address}
                            </p>
                        </div>

                        <div className="action-buttons-manage-records">
                            <button className="edit-btn-manage-records">Sửa hồ sơ</button>
                            <button className="delete-btn-manage-records">Xóa hồ sơ</button>

                        </div>
                    </div>
                )) : <p style={{ color: "#2697EC" }}>Không có hồ sơ nào</p>}

                {/* <div className="record-card">
            <div className="record-card-up">
                <p>
                    <FontAwesomeIcon icon={faUser} className="fa-icon" />
                    <strong>Họ và tên:</strong> <strong style={{color: "#2697EC"}}>Nguyễn Văn A</strong>
                </p>
                <p>
                    <FontAwesomeIcon icon={faBirthdayCake} className="fa-icon" />
                    <strong>Ngày sinh:</strong> 01/01/1990
                </p>
                <p>
                    <FontAwesomeIcon icon={faPhone} className="fa-icon" />
                    <strong>Số điện thoại:</strong> 0123456789
                </p>
                <p>
                    <FontAwesomeIcon icon={faVenusMars} className="fa-icon" />
                    <strong>Giới tính:</strong> Nam
                </p>
                <p>
                    <FontAwesomeIcon icon={faMapMarkedAlt} className="fa-icon" />
                    <strong>Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                </p>
            </div>


            <div className="action-buttons-manage-records">
                <button className="edit-btn-manage-records">Sửa hồ sơ</button>
                <button className="delete-btn-manage-records">Xóa hồ sơ</button>

            </div>
        </div> */}


            </>
        </LayoutManageRecordsPage>



    )
}

export default ManageRecordsPage;

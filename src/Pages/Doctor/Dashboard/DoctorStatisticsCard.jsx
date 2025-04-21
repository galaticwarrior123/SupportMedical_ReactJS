import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale, ArcElement } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ResultRegistrationAPI } from '../../../API/ResultRegistrationAPI';
import { ResultRegistrationStatus } from '../../../Common/Constants';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement
);

const DoctorStatiscsCard = () => {
    const [medServiceData, setMedServiceData] = useState([]);
    const [patientVisited, setPatientVisited] = useState(0);
    const [patientAbsent, setPatientAbsent] = useState(0);

    useEffect(() => {
        const fetchResultRegistrations = async () => {
            try {
                // Simulate an API call to fetch data
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth();
                const response = await ResultRegistrationAPI.doctorGetByFilter({
                    startDate: new Date(year, month, 1).toISOString().split('T')[0],
                    endDate: new Date(year, month + 1, 0).toISOString().split('T')[0],
                });

                // group data by response.data.medExamService
                const groupedData = response.data.reduce((acc, item) => {
                    const serviceName = item.medExamService.name;
                    if (!acc[serviceName]) {
                        acc[serviceName] = 0;
                    }
                    acc[serviceName]++;
                    return acc;
                }, {});
                const newData = Object.keys(groupedData).map((key) => ({
                    label: key,
                    data: groupedData[key],
                }));
                setMedServiceData(newData);

                const visitedCount = response.data.filter(item => item.status === ResultRegistrationStatus.COMPLETED).length;
                const absentCount = response.data.filter(item => item.status === ResultRegistrationStatus.ABSENT).length;
                setPatientVisited(visitedCount);
                setPatientAbsent(absentCount);
            } catch (error) {
                console.error('Error fetching result registrations:', error);
            }
        }
        fetchResultRegistrations();
    }, []);
    
    return (
        <div className="doctor-dashboard-card doctor-statistics-card">
            <h2>Thống kê tháng này</h2>
            <div className="doctor-statistics-card-body">
                <div className="doctor-statistics-chart">
                    <Bar
                        data={{
                            labels: medServiceData.map(item => item.label),
                            datasets: [
                                {
                                    label: 'Số lượng bệnh nhân',
                                    data: medServiceData.map(item => item.data),
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Thống kê số lượng bệnh nhân theo loại dịch vụ',
                                },
                            },
                        }}
                    />
                </div>
                <div className="doctor-statistics-items">
                    <div className="doctor-statistics-item patient-visited">
                        <div className="doctor-statistics-item-number">
                            {patientVisited}
                        </div>
                        <div className="doctor-statistics-item-label">
                            Bệnh nhân đã khám
                        </div>
                    </div>
                    <div className="doctor-statistics-item patient-absent">
                        <div className="doctor-statistics-item-number">
                            {patientAbsent}
                        </div>
                        <div className="doctor-statistics-item-label">
                            Bệnh nhân vắng mặt
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DoctorStatiscsCard;
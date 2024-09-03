import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import './Dashboard.css';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [selectedOption, setSelectedOption] = useState('patients');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleSelectionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const filterDataByDate = (data) => {
        // Placeholder for filtering data based on startDate and endDate.
        // You would replace this with your own logic to filter data based on the selected date range.
        return data;
    };

    const dataOptions = {
        patients: filterDataByDate({
            labels: ['Total Patients'],
            datasets: [
                {
                    label: 'Patients',
                    data: [150], // Example data
                    backgroundColor: ['rgba(75, 192, 192, 0.6)'],
                    borderColor: ['rgba(75, 192, 192, 1)'],
                    borderWidth: 1,
                },
            ],
        }),
        appointments: filterDataByDate({
            labels: ['Total Appointments'],
            datasets: [
                {
                    label: 'Appointments',
                    data: [200], // Example data
                    backgroundColor: ['rgba(153, 102, 255, 0.6)'],
                    borderColor: ['rgba(153, 102, 255, 1)'],
                    borderWidth: 1,
                },
            ],
        }),
        diseases: filterDataByDate({
            labels: ['Disease A', 'Disease B', 'Disease C'],
            datasets: [
                {
                    label: 'Diseases',
                    data: [50, 30, 20], // Example data
                    backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                    borderColor: ['rgba(255, 159, 64, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                    borderWidth: 1,
                },
            ],
        }),
        frequency: filterDataByDate({
            labels: ['Weekly', 'Monthly', 'Yearly'],
            datasets: [
                {
                    label: 'Frequency',
                    data: [100, 200, 300], // Example data
                    backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                    borderWidth: 1,
                },
            ],
        }),
    };

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="dashboard-container">
                    <div className="dashboard-filters">
                        <div className="dashboard-datepickers">
                            <label htmlFor="start-date">Start Date:</label>
                            <DatePicker
                                id="start-date"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy/MM/dd"
                            />
                            <label htmlFor="end-date">End Date:</label>
                            <DatePicker
                                id="end-date"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="yyyy/MM/dd"
                            />
                        </div>
                        <div className="dashboard-combobox">
                            <label htmlFor="dashboard-select">Select Data:</label>
                            <select id="dashboard-select" value={selectedOption} onChange={handleSelectionChange}>
                                <option value="patients">Number of Patients</option>
                                <option value="appointments">Number of Appointments</option>
                                <option value="diseases">Common Diseases</option>
                                <option value="frequency">Appointment Frequency</option>
                            </select>
                        </div>
                    </div>

                    <div className="dashboard-chart">
                        {selectedOption === 'patients' && <Bar data={dataOptions.patients} />}
                        {selectedOption === 'appointments' && <Bar data={dataOptions.appointments} />}
                        {selectedOption === 'diseases' && <Pie data={dataOptions.diseases} />}
                        {selectedOption === 'frequency' && <Bar data={dataOptions.frequency} />}
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>

    );
};

export default Dashboard;

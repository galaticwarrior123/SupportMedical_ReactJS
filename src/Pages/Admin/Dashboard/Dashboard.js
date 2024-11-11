import React from 'react';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { Line, Bar, Radar } from 'react-chartjs-2';
import './Dashboard.css'; // Chỉ giữ file CSS chính cho toàn bộ giao diện
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale
);
const Dashboard = () => {
    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="dashboard-container">
                    {/* Analysis Cards */}
                    <div className="dashboard-row analysis-cards">
                        <AnalysisCard title="Analysis" percentage={25} />
                        <AnalysisCard title="Analysis" percentage={50} />
                        <AnalysisCard title="Analysis" percentage={75} />
                        <AnalysisCard title="Analysis" percentage={100} />
                    </div>

                    {/* Line Chart Section */}
                    <div className="chart-section">
                        <h2>Daily Charts</h2>
                        <LineChart />
                    </div>

                    {/* Bar and Radar Charts */}
                    <div className="dashboard-row charts-group">
                        <BarChart />
                        <RadarChart />
                    </div>

                    {/* Progress Bars */}
                    <div className="progress-section">
                        <ProgressBar label="Activity" value={60} />
                        <ProgressBar label="Completion" value={50} />
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

// AnalysisCard Component
const AnalysisCard = ({ title, percentage }) => (
    <div className="analysis-card">
        <h3>{title}</h3>
        <div className="circle">{percentage}%</div>
        <p>Lorem ipsum dolor sit amet.</p>
    </div>
);

// LineChart Component
const LineChart = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Daily Data',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };
    return <Line data={data} />;
};

// BarChart Component
const BarChart = () => {
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: 'Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };
    return <Bar data={data} />;
};

// RadarChart Component
const RadarChart = () => {
    const data = {
        labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
        datasets: [
            {
                label: 'Skills',
                data: [20, 10, 4, 2],
                backgroundColor: 'rgba(34, 202, 236, .2)',
                borderColor: 'rgba(34, 202, 236, 1)',
            },
        ],
    };
    return <Radar data={data} />;
};

// ProgressBar Component
const ProgressBar = ({ label, value }) => (
    <div className="progress-bar">
        <label>{label}</label>
        <div className="progress">
            <div className="progress-fill" style={{ width: `${value}%` }}></div>
        </div>
        <span>{value}%</span>
    </div>
);

export default Dashboard;


import React, { useEffect, useRef, useState } from 'react';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import PostAPI from '../../../API/PostAPI';
import { UserAPI } from '../../../API/UserAPI';
import { DepartmentAPI } from '../../../API/DepartmentAPI';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale, ArcElement } from 'chart.js';

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
    ArcElement // Add ArcElement here for Pie charts
);

const Dashboard = () => {
    const [countPost, setCountPost] = useState(0);
    const [countUser, setCountUser] = useState(0);
    const [countDoctor, setCountDoctor] = useState(0);
    const [countPostPending, setCountPostPending] = useState(0);
    const [countPostPublished, setCountPostPublished] = useState(0);
    const [countPostRejected, setCountPostRejected] = useState(0);
    const [departments, setDepartments] = useState([]);
    const [postTags, setPostTags] = useState({ tags: [], counts: [] });
    const [chartsVisible, setChartsVisible] = useState({
        line: false,
        bar: false,
        pie: false,
    });

    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);

    useEffect(() => {
        // Intersection Observer to check visibility
        const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const chartType = entry.target.dataset.chart;
                    setChartsVisible((prev) => ({ ...prev, [chartType]: true }));
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1, // Trigger when 10% of the element is visible
        });

        if (lineChartRef.current) observer.observe(lineChartRef.current);
        if (barChartRef.current) observer.observe(barChartRef.current);
        if (pieChartRef.current) observer.observe(pieChartRef.current);

        return () => {
            if (lineChartRef.current) observer.unobserve(lineChartRef.current);
            if (barChartRef.current) observer.unobserve(barChartRef.current);
            if (pieChartRef.current) observer.unobserve(pieChartRef.current);
        };
    }, []);

    useEffect(() => {
        const fetchPostCount = async () => {
            try {
                const response = await PostAPI.getAllPost();
                if (response.status === 200) {
                    setCountPost(response.data.length);
                    const posts = response.data;
                    const postsPending = posts.filter(post => post.status === 'PENDING');
                    const postsPublished = posts.filter(post => post.status === 'PUBLISHED');
                    const postsRejected = posts.filter(post => post.status === 'REJECTED');
                    setCountPostPending(postsPending.length);
                    setCountPostPublished(postsPublished.length);
                    setCountPostRejected(postsRejected.length);
                }
            } catch (error) {
                console.error('Failed to fetch post count:', error);
            }
        };

        const fetchUserCount = async () => {
            try {
                const response = await UserAPI.getAll();
                if (response.status === 200) {
                    const users = response.data.filter(user => user.roles.includes('CLIENT'));
                    setCountUser(users.length);
                }
            } catch (error) {
                console.error('Failed to fetch user count:', error);
            }
        };

        const fetchDoctorCount = async () => {
            try {
                const response = await UserAPI.getAll();
                if (response.status === 200) {
                    const doctors = response.data.filter(user => user.roles.includes('DOCTOR'));
                    setCountDoctor(doctors.length);
                }
            } catch (error) {
                console.error('Failed to fetch doctor count:', error);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await DepartmentAPI.getAll();
                if (response.status === 200) {
                    setDepartments(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            }
        };

        const fetchPostDataByTag = async () => {
            try {
                const response = await PostAPI.getByTag();
                if (response.status === 200) {
                    const tags = response.data.map(item => item.name || 'Unknown'); // Handle missing tag names
                    const counts = response.data.map(item => item.count || 0); // Handle missing counts
        
                    setPostTags({ tags, counts });
                }
            } catch (error) {
                console.error('Failed to fetch post data by tag:', error);
                setPostTags({ tags: [], counts: [] }); // Reset to empty in case of error
            }
        };

        fetchDoctorCount();
        fetchUserCount();
        fetchPostCount();
        fetchDepartments();
        fetchPostDataByTag();
    }, []);

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="dashboard-container">
                    {/* Analysis Cards */}
                    <div className="dashboard-row analysis-cards">
                        <AnalysisCard title="Số lượng bài viết" percentage={countPost} unit="bài viết" />
                        <AnalysisCard title="Số lượng người dùng" percentage={countUser} unit="người" />
                        <AnalysisCard title="Số lượng bác sĩ" percentage={countDoctor} unit="bác sĩ" />
                    </div>

                    {/* Line Chart Section */}
                    <div
                        ref={lineChartRef}
                        data-chart="line"
                        className={`chart-section ${chartsVisible.line ? 'visible' : 'hidden'}`}
                    >
                        <h2>Biểu đồ số lượng bài viết theo ngày</h2>
                        {chartsVisible.line && <LineChart />}
                    </div>

                    {/* Bar Chart Section */}
                    <div
                        ref={barChartRef}
                        data-chart="bar"
                        className={`chart-section ${chartsVisible.bar ? 'visible' : 'hidden'}`}
                    >
                        <h2>Biểu đồ thống kê bài viết theo trạng thái</h2>
                        {chartsVisible.bar && (
                            <BarChart
                                countPostPending={countPostPending}
                                countPostPublished={countPostPublished}
                                countPostRejected={countPostRejected}
                            />
                        )}
                    </div>

                    {/* Pie Chart Section */}
                    <div
                        ref={pieChartRef}
                        data-chart="pie"
                        className={`chart-section ${chartsVisible.pie ? 'visible' : 'hidden'}`}
                    >
                        <h2>Biểu đồ phân phối bài viết theo chủ đề</h2>
                        {chartsVisible.pie && <PieChart tags={postTags.tags} counts={postTags.counts} />}
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

// AnalysisCard Component
const AnalysisCard = ({ title, percentage, unit }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1000; // Duration for the animation in ms
        const increment = percentage / (duration / 16); // Calculate increment for ~60fps
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                start += increment;
                setDisplayValue(Math.min(Math.round(start), percentage));
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(percentage); // Ensure it ends at the exact percentage
            }
        };

        requestAnimationFrame(animate);
    }, [percentage]);

    return (
        <div className="analysis-card">
            <h3>{title}</h3>
            <div className="circle">{displayValue}</div>
            <p>{unit}</p>
        </div>
    );
};



// LineChart Component
const LineChart = () => {
    const [postData, setPostData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
    const [year, setYear] = useState(new Date().getFullYear()); // Current year

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await PostAPI.getByDate(month, year);
                const days = response.data.map(item => parseInt(item.date.split('-')[2])); 
                const counts = response.data.map(item => item.count);

                const allDays = Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
                const postCounts = allDays.map(day => {
                    const index = days.indexOf(day);
                    return index === -1 ? 0 : counts[days.indexOf(day)];
                });

                setLabels(allDays);
                setPostData(postCounts);
            } catch (error) {
                console.error("Failed to fetch post data:", error);
            }
        };

        fetchPostData();
    }, [month, year]);

    const data = {
        labels: labels.map(day => `${day}`),
        datasets: [
            {
                label: `Số lượng bài viết trong tháng ${month}/${year}`,
                data: postData,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Số lượng bài viết: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Ngày trong tháng',
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return value + 1;
                    },
                },
                grid: {
                    display: false, // Loại bỏ các ô (grid lines)
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Số lượng bài viết',
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return value % 1 === 0 ? value : '';
                    },
                },
                
            },
        },
    };

    return (
        <div>
            {/* Month and Year Selector */}
            <div className="filter-container">
                <label htmlFor="month">Tháng: </label>
                <select
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                            Tháng {i + 1}
                        </option>
                    ))}
                </select>

                <label htmlFor="year">Năm: </label>
                <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                >
                    {Array.from({ length: 5 }, (_, i) => 2020 + i).map((yearOption) => (
                        <option key={yearOption} value={yearOption}>
                            {yearOption}
                        </option>
                    ))}
                </select>
            </div>
            <Line data={data} options={options} />
        </div>
    );
};

// BarChart Component
const BarChart = ({ countPostPending, countPostPublished, countPostRejected }) => {
    const data = {
        labels: ['Chờ duyệt', 'Đã duyệt', 'Bị từ chối'],
        datasets: [
            {
                label: 'Số lượng bài viết',
                data: [countPostPending, countPostPublished, countPostRejected],
                backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="bar-chart">
            <Bar data={data} />
        </div>
    );
};

// PieChart Component
const PieChart = ({ tags = [], counts = [] }) => {
    const total = counts.reduce((acc, count) => acc + count, 0); // Safe to reduce because counts is defaulted to []

    if (total === 0) {
        return <p>Không có dữ liệu để hiển thị biểu đồ.</p>;
    }

    const data = {
        labels: tags,
        datasets: [
            {
                label: `Số lượng bài viết theo tag`,
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const count = context.raw;
                        const percentage = ((count / total) * 100).toFixed(2);
                        return `${context.label}: ${count} bài viết (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="pie-chart">
            <Pie data={data} options={options} />
        </div>
    );
};

export default Dashboard;

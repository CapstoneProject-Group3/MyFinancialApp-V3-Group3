import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js/auto";
import { ResponsiveContainer } from 'recharts';

// Register Chart.js plugins
ChartJS.register(Tooltip, Legend, ArcElement);

// Pie chart component
export const PieChartComponent = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        let sum = 0;
                        let dataArr = tooltipItem.dataset.data;
                        dataArr.map(data => {
                            sum += Number(data);
                        });
                        let percentage = (tooltipItem.raw * 100 / sum).toFixed(2) + "%";
                        return `${tooltipItem.label}: ${percentage}`;
                    }
                }
            }
        },
    };

    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                data: data.map(item => item.value),
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
                hoverOffset: 4,
                borderWidth: 1,
                borderColor: '#ffffff',
            },
        ],
    };

    return <div style={{ height: '500px', width: '500px' }}>
        <Pie options={options} data={chartData} />
    </div>;
};

// Portfolio page component
const PortfolioPage = () => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const riskRating = queryParams.get('riskRating');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (riskRating && token) {
        axios.post('http://localhost:4000/api/portfolio', {riskLevel: riskRating},{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('API response:', response.data);
            const { stocks, bonds, cashOrEquivalents } = response.data.portfolio;
            setData([
                { name: 'Stocks', value: stocks },
                { name: 'Bonds', value: bonds },
                { name: 'Cash or Equivalents', value: cashOrEquivalents }
            ]);
        })
        .catch(error => {
            console.error('Error fetching portfolio data:', error.response ? error.response.data.error : error.message);
        });
    }
    }, [riskRating]);

    return (
        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
            <h style={{
                textAlign: 'center',   // Center the text horizontally
                fontWeight: 'bold',    // Make the text bold
                fontSize: '24px',      // Increase the font size
                marginBottom: '20px',  // Add space between the title and the chart
                color: '#333'    
            }}>
                Your Investment Portfolio
            </h>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChartComponent data={data} />
                </ResponsiveContainer>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default PortfolioPage;

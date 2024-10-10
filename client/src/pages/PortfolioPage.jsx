import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement} from "chart.js/auto";
import { ResponsiveContainer } from 'recharts';  // Import if using recharts (optional)

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
                hoverOffset: 4,  // Adjust hover state size change
                borderWidth: 1,  // Adjust border width of the sections
                borderColor: '#ffffff',  // Adjust border color
            },
        ],
    };

    return <div style={{ height: '500px', width: '500px' }}>
        <Pie options={options} data={chartData} />
    </div>;
};

// Portfolio page component
const PortfolioPage = () => {
    const { userId } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:4000/api/portfolio/${userId}`)
                .then(response => {
                    const { stocksPercentage, bondsPercentage, cashOrEquivalentsPercentage } = response.data.data;
                    setData([
                        { name: 'Stocks', value: stocksPercentage },
                        { name: 'Bonds', value: bondsPercentage },
                        { name: 'Cash or Equivalents', value: cashOrEquivalentsPercentage }
                    ]);
                })
                .catch(error => {
                    console.error('Error fetching portfolio data:', error);
                });
        } else {
            console.log("UserId is undefined, not fetching data");
        }
    }, [userId]);   // Dependency array for useEffect, will rerun when 'userId' changes

    return (
        <div style={{ width: '100%', height: '400px' }}>
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from '../table/Table';
import { formatDateTo12Hours } from '../../store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const ExpenditureChart = () => {
    const navigate = useNavigate();
    const [expenditures, setExpenditures] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [currentMonthTotal, setCurrentMonthTotal] = useState(0);

    useEffect(() => {
        fetchExpenditures();
    }, []);

    const fetchExpenditures = async () => {
        try {
            const response = await axios.get('https://printingapp.onrender.com/api/expenditures');
            const data = response.data;
            setExpenditures(data);
            calculateMonthlySummary(data);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateMonthlySummary = (data) => {
        const summary = {};
        const currentMonth = new Date().getMonth() + 1;
        let totalThisMonth = 0;

        data.forEach((expenditure) => {
            const date = new Date(expenditure.date);
            const month = date.getMonth() + 1; // Months are 0-indexed
            const year = date.getFullYear();
            const key = `${month}/${year}`;

            if (!summary[key]) {
                summary[key] = 0;
            }

            summary[key] += expenditure.amount;

            if (month === currentMonth && year === new Date().getFullYear()) {
                totalThisMonth += expenditure.amount;
            }
        });

        setMonthlySummary(
            Object.entries(summary).map(([key, total]) => ({ month: key, total }))
        );
        setCurrentMonthTotal(totalThisMonth);
    };

   

    return (
        <div className="expenditure-list">
            <h1>INSIGHT OF EXPENDITURE</h1>

            <div className="chart-container">
                <h2>Monthly Expenditure Summary</h2>
                <div>
                    <h3>Total Expenditure for the Current Month: N{currentMonthTotal}</h3>
                </div>  
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlySummary}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
                
            </div>
                      
        </div>
    );
};

export default ExpenditureChart;
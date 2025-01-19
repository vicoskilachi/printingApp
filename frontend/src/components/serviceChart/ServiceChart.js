import React, { useState, useEffect, useRef } from "react";
import { toJpeg } from "html-to-image";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDateTo12Hours } from "../../store.js";
import "./service-chart.css";
import Table from "../table/Table.js";
import banner from "../../images/banner.png";
import logo from "../../images/nifty_logo.png";
import cost_icon from "../../images/cost_icon.png";
import Card from "../card/Card.js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ServiceChart = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [totals, setTotals] = useState({
    totalCost: 0,
    totalPayment: 0,
    totalBalance: 0,
  });
  const [chartData, setChartData] = useState([]);
  const invoiceRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      const sortedServices = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setServices(sortedServices);

      const groupedByMonth = sortedServices.reduce((acc, service) => {
        const month = new Date(service.date).toLocaleString("default", { month: "long", year: "numeric" });

        if (!acc[month]) {
          acc[month] = { cost: 0, payment: 0, balance: 0 };
        }

        acc[month].cost += service.cost;
        acc[month].payment += service.payment;
        acc[month].balance += service.cost > service.payment ? service.cost - service.payment : 0;

        return acc;
      }, {});

      const chartData = Object.keys(groupedByMonth).map(month => ({
        month,
        cost: groupedByMonth[month].cost,
        payment: groupedByMonth[month].payment,
        balance: groupedByMonth[month].balance
      }));

      const totalCost = sortedServices.reduce((sum, service) => sum + service.cost, 0);
      const totalPayment = sortedServices.reduce((sum, service) => sum + service.payment, 0);
      const totalBalance = sortedServices.reduce(
        (sum, service) => sum + (service.cost > service.payment ? service.cost - service.payment : 0),
        0
      );

      setTotals({ totalCost, totalPayment, totalBalance });
      setChartData(chartData);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <h1>INSIGHT OF SERVICES OFFERED</h1>
      <div className="service-summary">

      
        <Card>
          <div className="container">
            <div className="icon">
              <img src={cost_icon} alt="Total Cost Icon" />
            </div>
            <div className="card-text">
              <p>Total Cost</p>
              <h2>N{totals.totalCost}</h2>
            </div>
          </div>
        </Card>
        <Card>
          <div className="container">
            <div className="icon">
              <img src={cost_icon} alt="Total Payment Icon" />
            </div>
            <div className="card-text">
              <p>Total Payment</p>
              <h2>N{totals.totalPayment}</h2>
            </div>
          </div>
        </Card>
        <Card>
          <div className="container">
            <div className="icon">
              <img src={cost_icon} alt="Total Balance Icon" />
            </div>
            <div className="card-text">
              <p>Total Balance</p>
              <h2>N{totals.totalBalance}</h2>
            </div>
          </div>
        </Card>
      </div>

      <div className="chart-container">
        <div className="chart-item">
          <h3>Total Cost of Service Offered by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>Total Service Paid for by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="payment" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h3>Total Service Balance Remaining by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="balance" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        
      </div>

      {/* Your table and invoice content */}
    </>
  );
};

export default ServiceChart;

import React, { useState, useEffect, useRef } from "react";
import { toJpeg } from "html-to-image";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDateTo12Hours } from "../../store.js";
import "./service-list.css";
import Table from "../../components/table/Table.js";
import banner from "../../images/banner.png";
import logo from "../../images/nifty_logo.png";
import cost_icon from "../../images/cost_icon.png";
import Card from "../../components/card/Card.js";
import "./invoice.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../../components/form/Form.js";

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  // Add Service State
  const [formData, setFormData] = useState({
    serviceType: "",
    customerName: "",
    customerPhone: "",
    cost: 0,
    payment: 0,
    providerName: "",
    date: "",
  });

  // Update Service State
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    serviceType: "",
    providerName: "",
    customerName: "", // Added customerName filter
    customerPhone: "",
    dateFrom: "",
    dateTo: "",
  });

  // Filter Total State
  const [filterTotals, setFilterTotals] = useState({
    totalCost: 0,
    totalPayment: 0,
    totalBalance: 0,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);



  const invoiceRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Filter services based on the filter values
  const filteredServices = services.filter((service) => {
    const serviceDate = new Date(service.date);
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    const matchesServiceType =
      !filters.serviceType || service.serviceType.toLowerCase().includes(filters.serviceType.toLowerCase());
    const matchesProviderName =
      !filters.providerName || service.providerName.toLowerCase().includes(filters.providerName.toLowerCase());
    const matchesCustomerName =
      !filters.customerName || service.customerName.toLowerCase().includes(filters.customerName.toLowerCase()); // Added filter for customerName
    const matchesCustomerPhone = !filters.customerPhone || service.customerPhone.includes(filters.customerPhone);
    const matchesDateRange =
      (!dateFrom || serviceDate >= dateFrom) && (!dateTo || serviceDate <= dateTo);

    return matchesServiceType && matchesProviderName && matchesCustomerName && matchesCustomerPhone && matchesDateRange;
  });

  console.log(filters.customerPhone);

  const filteredTotalCost = filteredServices.reduce((sum, filteredService) => sum + filteredService.cost, 0);
  const filteredTotalPayment = filteredServices.reduce((sum, filteredService) => sum + filteredService.payment, 0);
  const filteredTotalBalance = filteredServices.reduce((sum, filteredService) => sum + (filteredService.cost > filteredService.payment ? filteredService.cost - filteredService.payment : 0), 0)


  // Fetch services from the server
  const fetchServices = async () => {
    try {
      const response = await axios.get("https://printingapp.onrender.com/api/services");
      const sortedServices = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setServices(sortedServices);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch services!");
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };





  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = {
        ...formData,
        date: new Date(formData.date),
      };

      if (editingServiceId) {
        // Update existing service
        await axios.put(
          `https://printingapp.onrender.com/api/services/${editingServiceId}`,
          newFormData
        );
        toast.success("Service updated successfully!");
        setEditingServiceId(null);
      } else {
        // Add new service
        await axios.post("https://printingapp.onrender.com/api/services", newFormData);
        toast.success("Service added successfully!");
      }
      fetchServices();
      setFormData({
        serviceType: "",
        customerName: "",
        customerPhone: "",
        cost: 0,
        payment: 0,
        providerName: "",
        date: "",
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add/update service!");
    }
  };

  // Populate form with existing service details for editing
  const handleEdit = (service) => {
    setFormData({
      serviceType: service.serviceType,
      customerName: service.customerName,
      customerPhone: service.customerPhone,
      cost: service.cost,
      payment: service.payment,
      providerName: service.providerName,
      date: service.date,
    });
    setEditingServiceId(service._id);
    setIsModalOpen(true);
  };

  // Delete a service
  const deleteService = async (id) => {
    try {
      await axios.delete(`https://printingapp.onrender.com/api/services/${id}`);
      fetchServices();
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete service!");
    }
  };

  // Download invoice
  const handleDownloadInvoice = (service) => {
    const invoiceContent = invoiceRef.current;
    invoiceContent.querySelector(".date").textContent = formatDateTo12Hours(
      service.date
    );
    invoiceContent.querySelector(".customer-name").textContent = service.customerName;
    invoiceContent.querySelector(".job-description").textContent = service.serviceType;
    invoiceContent.querySelector(".job-cost").textContent = `N${service.cost}`;
    invoiceContent.querySelector(".payment-made").textContent = `N${service.payment}`;
    invoiceContent.querySelector(".balance").textContent =
      service.cost > service.payment ? `N${service.cost - service.payment}` : "-";
    invoiceContent.querySelector(".service-person").textContent = service.providerName;

    invoiceContent.style.display = "block";
    toJpeg(invoiceContent, { quality: 0.95, cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `Invoice-${service.customerName}.jpg`;
        link.href = dataUrl;
        link.click();
        toast.success("Invoice downloaded successfully!");
      })
      .catch((error) => {
        console.error("Error generating invoice:", error);
        toast.error("Failed to download invoice!");
      })
      .finally(() => {
        invoiceContent.style.display = "none";
      });
  };



  return (
    <>

      <button className="floating-button" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      <ToastContainer position="top-right" autoClose={5000} />

      <div className="service-summary">
        <Card>
          <div className="container">
            <div className="item">
              <div className="icon">
                <img src={cost_icon} alt="Total Cost Icon" />
              </div>
              <div className="card-text">
                <p>Total Cost</p>
                <h2>N{filteredTotalCost}</h2>
              </div>
            </div>

            <div className="item">
              <div className="icon">
                <img src={cost_icon} alt="Total Payment Icon" />
              </div>
              <div className="card-text">
                <p>Total Payment</p>
                <h2>N{filteredTotalPayment}</h2>
              </div>
            </div>

            <div className="item">
              <div className="icon">
                <img src={cost_icon} alt="Total Balance Icon" />
              </div>
              <div className="card-text">
                <p>Total Balance</p>
                <h2>N{filteredTotalBalance}</h2>
              </div>
            </div>
          </div>
        </Card>




      </div>

      {/* Filter Inputs */}
      <Form>
        <div className="filters">
          <h2>Filter Services</h2>
          <div className="input-group">
            <div className="input-item">
                <input
                type="text"
                name="serviceType"
                placeholder="Filter by Job Description"
                value={filters.serviceType}
                onChange={handleFilterChange}
              />
            </div>

            <div className="input-item">
                <input
                type="text"
                name="providerName"
                placeholder="Filter by Service Provider"
                value={filters.providerName}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-item">
                <input
                type="text"
                name="customerName" // Added filter for customerName
                placeholder="Filter by Customer Name"
                value={filters.customerName}
                onChange={handleFilterChange}
              />
            </div>

            <div className="input-item">
                <input
                type="phone"
                name="customerPhone" // Added filter for customerName
                placeholder="Filter by Customer Phonu Number"
                value={filters.customerPhone}
                onChange={handleFilterChange}
              />
            </div>
          </div>


          <div className="input-group">
            <div className="input-item">
                <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>

            <div className="input-item">
                <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
          </div>         
        </div>
      </Form>

      {/* Service List */}
      {/* Services Table */}

      <Table>
        <table>
          <thead>
            <tr>
              <th>Job Description</th>
              <th>Customer Name</th>
              <th className="mobile-hide">Customer Phone</th>
              <th className="mobile-hide">Job Cost</th>
              <th>Payment Made</th>
              <th>Balance</th>
              <th className="mobile-hide">Service Provider</th>
              <th className="mobile-hide">Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service._id}>
                <td data-label="customerName">{service.serviceType}</td>
                <td>{service.customerName}</td>
                <td className="mobile-hide">{service.customerPhone}</td>
                <td className="mobile-hide">N{service.cost}</td>
                <td>N{service.payment}</td>
                <td>
                  {service.cost > service.payment
                    ? `N${service.cost - service.payment}`
                    : "-"}
                </td>
                <td className="mobile-hide">{service.providerName}</td>
                <td className="mobile-hide">{formatDateTo12Hours(service.date)}</td>
                <td>
                  <button onClick={() => handleEdit(service)}>Edit</button>
                  <button onClick={() => deleteService(service._id)}>Delete</button>
                  <button onClick={() => handleDownloadInvoice(service)}>
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Table>


      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => {
              setIsModalOpen(false)
              setEditingServiceId(null);
              setFormData({
                serviceType: "",
                customerName: "",
                customerPhone: "",
                cost: 0,
                payment: 0,
                providerName: "",
                date: "",
              });

            }}>&times;</span>
            {/* Add and Update Form */}
            <Form>

              <form onSubmit={handleSubmit} className="service-form">
                <h3>{editingServiceId ? "Update Service" : "Add New Service"}</h3>

                <div className="input-group">
                  <div className="input-item">
                    <label htmlFor="service-type">Job Description</label>
                    <input
                      type="text"
                      id="service-type"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="input-group">


                  <div className="input-item">
                    <label htmlFor="cost">Cost</label>
                    <input
                      type="number"
                      name="cost"
                      id="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-item">
                    <label htmlFor="payment">Payment Made</label>
                    <input
                      type="number"
                      id="payment"
                      name="payment"
                      value={formData.payment}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-item">
                    <label htmlFor="date">Date</label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-item">
                    <label htmlFor="customer-name">Customer Name</label>
                    <input
                      type="text"
                      id="customer-name"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-item">
                    <label htmlFor="customer-phone">Customer Phone</label>
                    <input
                      type="text"
                      id="customer-phone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="input-item">
                    <label htmlFor="provider-name">Service Provider</label>
                    <input
                      type="text"
                      id="provider-name"
                      name="providerName"
                      value={formData.providerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  {editingServiceId ? "Update Service" : "Add Service"}
                </button>
              </form>


            </Form>
          </div>
        </div>
      )

      }












      {/* Hidden invoice template */}
      <div ref={invoiceRef} className="receipt" style={{ display: "none" }}>
        <div className="receipt-logo">
          <img src={logo} alt="Logo" />
        </div>

        <h2>Payment Invoice</h2>
        <p className="acknowledge"> Payment received successfully </p>

        <div className="receipt-text_content">
          <p>Date/Time: <b><span className="date"></span></b></p>
          <p>Customer Name: <b><span className="customer-name"></span></b></p>
          <p>Job Description: <b><span className="job-description"></span></b></p>
          <p>Job Cost: <b><span className="job-cost"></span></b></p>
          <p>Payment Made: <b><span className="payment-made"></span></b></p>
          <p>Balance: <b><span className="balance"></span></b></p>
          <p>Service Provider: <b><span className="service-person"></span></b></p>
        </div>

        <p className="patronage"> Thanks for your Patronage </p>
        <div className="footer-banner">
          <img src={banner} alt="Footer Banner" />
        </div>
      </div>



    </>
  );
};

export default ServiceList;

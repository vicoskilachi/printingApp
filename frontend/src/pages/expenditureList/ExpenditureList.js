import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './expenditure-list.css';
import Table from '../../components/table/Table';
import { formatDateTo12Hours } from '../../store';
import Form from '../../components/form/Form';

const ExpenditureList = () => {
    const navigate = useNavigate();
    const [expenditures, setExpenditures] = useState([]);
    const [totalExpenditure, setTotalExpenditure] = useState(0);
    const [filteredTotal, setFilteredTotal] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        itemName: '',
        amount: '',
        spender: '',
        date: "",
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

     // Filter state
     const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        itemName: '',
        spender: '',
    });


    useEffect(() => {
        fetchExpenditures();
    }, []);

    // Fetch all expenditures
    const fetchExpenditures = async () => {
        try {
            const response = await axios.get('https://printingapp.onrender.com/api/expenditures');
            const data = response.data;
            setExpenditures(data);

            // Calculate the total expenditure for the current month
            const currentMonth = new Date().getMonth();
            const total = data.reduce((sum, expenditure) => {
                const expenditureMonth = new Date(expenditure.date).getMonth();
                if (expenditureMonth === currentMonth) {
                    return sum + expenditure.amount;
                }
                return sum;
            }, 0);

            setTotalExpenditure(total);
        } catch (error) {
            toast.error('Failed to fetch expenditures.');
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Add or Update Expenditure
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {

            const newFormData = {
                ...formData,
                date: new Date(formData.date),
              };

              console.log(newFormData.date)
        
            if (isUpdating) {
                await axios.put(`https://printingapp.onrender.com/api/expenditures/${updateId}`, newFormData);
                toast.success('Expenditure updated successfully!');
                setIsUpdating(false);
                setUpdateId(null);
            } else {
                await axios.post('https://printingapp.onrender.com/api/expenditures', newFormData);
                toast.success('Expenditure added successfully!');
            }

            setFormData({
                itemName: '',
                amount: '',
                spender: '',
                date: '',
            });
            setIsModalOpen(false);
            fetchExpenditures();
        } catch (error) {
            toast.error('Failed to add/update expenditure.');
        }
    };

    // Handle Update Button Click
    const handleUpdateClick = (expenditure) => {
        setIsUpdating(true);
        setUpdateId(expenditure._id);
        setFormData({
            itemName: expenditure.itemName,
            amount: expenditure.amount,
            spender: expenditure.spender,
            date: expenditure.date,
        });
        setIsModalOpen(true);
    };


    //✅ Handle Delete Expenditure
    const deleteExpenditure = async (id)=>{
        try {
            await axios. delete(`https://printingapp.onrender.com/api/expenditures/${id}`);
            toast.success('Expenditure deleted successfully!');
            fetchExpenditures();
        } catch (error) {
            toast.error('Failed to delete expenditure');
            console.error(error);
        }
    }

      // ✅ Handle filter input changes
      const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,           
        }));
        console.log(filters.itemName);
    };


    // ✅ Filter and Sort Expenditures
    const filteredExpenditures = expenditures
        .filter((expenditure) => {
            // Filter by date range
            const expenditureDate = new Date(expenditure.date);
            const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
            const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

            return (
                (!fromDate || expenditureDate >= fromDate) &&
                (!toDate || expenditureDate <= toDate) &&
                (filters.itemName === '' || expenditure.itemName.toLowerCase().includes(filters.itemName.toLowerCase())) &&
                (filters.spender === '' || expenditure.spender.toLowerCase().includes(filters.spender.toLowerCase()))
            );
    });

    // ✅ Calculate filtered total expenditure
    const filteredTotalExpenditure = filteredExpenditures.reduce((sum, expenditure) => sum + expenditure.amount, 0);


    
     



    return (
        <div className="expenditure-list">
            <ToastContainer />
            <h1>Expenditure List</h1>


              

            {/* Total Expenditure */}
            <div className="total-expenditure">
                <h3>Total Expenditure for {new Date().toLocaleString('default', { month: 'long' })}: N{totalExpenditure}</h3>
            </div>

            <div className="filtered-total_expediture">
                <h3>Total Expenditure at View: {filteredTotalExpenditure}</h3>
            </div>


            {/* Filter Inputs */}

            <Form>
                <div className="filter-expenditure">
                <h2>Filter Expenditures</h2>
                    <div className="input-group">
                        <div className="input-item">
                            <input type="date" name="dateFrom" placeholder="From Date" value={filters.dateFrom} onChange={handleFilterChange} />
                        </div>
                        <div className="input-item">
                            <input type="date" name="dateTo" placeholder="To Date" value={filters.dateTo} onChange={handleFilterChange} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-item">
                            <input type="text" name="itemName" placeholder="Item Name" value={filters.itemName} onChange={handleFilterChange} />
                        </div>
                        <div className="input-item">
                            <input type="text" name="spender" placeholder="Spender" value={filters.spender} onChange={handleFilterChange} />
                        </div>
                    </div>
                </div>
            </Form>
          

            {/* Add Expenditure Button */}
            <button className="floating-button" onClick={() => setIsModalOpen(true)}>
                +
            </button>

            {/* Expenditure Table */}
            <Table>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>Amount</th>
                            <th className='mobile-hide'>Spender</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredExpenditures.map((expenditure, key) => (
                            <tr key={expenditure._id}>
                                <td>{key + 1}</td>
                                <td>{formatDateTo12Hours(expenditure.date)}</td>
                                <td>{expenditure.itemName}</td>
                                <td>N{expenditure.amount}</td>
                                <td className='mobile-hide'>{expenditure.spender}</td>
                                <td>
                                    <button onClick={() => deleteExpenditure(expenditure._id)}>Delete</button>
                                    <button onClick={() => handleUpdateClick(expenditure)}>Update</button>
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
                        <span className="close" onClick={() =>{
                                setIsModalOpen(false);                        
                                    
                                    setIsUpdating(false);
                                    setUpdateId(null);
                                    setFormData({
                                        itemName: "",
                                        amount: "",
                                        spender: "",
                                        date: ""
                                    });
                                
                        } }>&times;</span>
                        <h2>{isUpdating ? 'Update Expenditure' : 'Add Expenditure'}</h2>
                        <Form>
                            <form onSubmit={handleFormSubmit}>
                                <div className="input-group">
                                    <div className="input-item">
                                        <label htmlFor="itemName">Item Name</label>
                                        <input type="text" name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleInputChange} required />
                                    </div>

                                    <div className="input-item">
                                        <label htmlFor="amount">Amount</label>
                                        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-item">
                                        <label htmlFor="spender">Spender</label>
                                        <input type="text" name="spender" placeholder="Spender" value={formData.spender} onChange={handleInputChange} required />
                                    </div>
                                    <div className="input-item">
                                        <label htmlFor="date">Date</label>
                                        <input type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} required />

                                    </div>
                                </div>
                                
                               
                               
                                
                                <button type="submit">{isUpdating ? 'Update' : 'Add'} Expenditure</button>
                            </form>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenditureList;

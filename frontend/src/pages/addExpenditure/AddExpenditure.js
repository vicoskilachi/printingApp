import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './add-expenditure.css';

const AddExpenditure = () => {
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [spender, setSpender] = useState('');

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {      
        await axios.post('http://localhost:5000/api/expenditures', { itemName, amount, spender });
      setItemName('');
      setAmount('');
      setSpender('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Expenditure</h3>
      <input
        type="text"
        placeholder="Expense Purpose"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Spender"
        value={spender}
        onChange={(e) => setSpender(e.target.value)}
        required
      />
      <button type="submit">Add Expenditure</button>
    </form>
  );
};

export default AddExpenditure;

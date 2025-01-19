import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateExpenditure = () => {
    const {id} = useParams();
    console.log(id);
    const navigate = useNavigate();
    const [expenditure, setExpenditure] = useState({
        itemName: '',
        amount: '',
        spender: '',
    })

    useEffect(()=>{

        const fetchExpenditures = async ()=>{
            try {
                const response = await axios.get(`http://localhost:5000/api/expenditures/${id}`);
                setExpenditure(response.data);
                console.log(response.data);
            } catch (error) {
               console.error(error); 
            }
        }

        fetchExpenditures();
    },[id])

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setExpenditure({...expenditure, [name]: value});
    };

    const handleSubmit =  async (e)=>{
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/expenditures/${id}`, expenditure);
            navigate('/expenditure-list');
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <label>
            Job Description:
            <input type="text" name="itemName" value={expenditure.itemName} onChange={handleChange}/>
        </label>

        <label>
            Amount:
            <input type="Number" name="amount" value={expenditure.amount} onChange={handleChange} />
        </label>

        <label>
            Spender:
            <input type="text" name="spender" value={expenditure.spender} onChange={handleChange}/>
        </label>

        <button type="submit">Update Expenditure</button>
    </form>
  )
}

export default UpdateExpenditure
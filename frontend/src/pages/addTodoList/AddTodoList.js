import React, {useState} from 'react'
import axios from 'axios'
import './addTodoList.css'



const AddTodoList = () => {
  const [task, setTask] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e)=>{
    console.log(e)
    e.preventDefault();
    console.log('hello world');
    axios.post('https://printingapp.onrender.com/api/todos', {task});
    setTask('');
    
  }
  
  return (
    <>
      <form onSubmit={(e)=>{handleSubmit(e)}} >
        <div className="form-group">
          <input type="text" id="task" value = {task} onChange = {(e) => {setTask(e.target.value)}} placeholder='Enter Task' />
          <button type="submit">Add Task</button>
        </div>
        
      </form>
    </>
    
  )
}

export default AddTodoList
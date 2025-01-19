import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import ServiceList from './pages/serviceList/ServiceList';
import ExpenditureList from './pages/expenditureList/ExpenditureList';
import Dashboard from './pages/dashboard/Dashboard';
import AddTodoList from './pages/addTodoList/AddTodoList';
import TodoList from './pages/todoList/TodoList';
import UpdateTodo from './pages/updateTodo/UpdateTodo';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <div>Coming Soon</div>,
        children: [
            {
                index: true,
                element: <Dashboard/>
            },

            
            {
                path: "service-list",
                element: <ServiceList/>
            },

            {
                path: "expenditure-list",
                element: < ExpenditureList />

            },

            {
                path: "add-todolist",
                element: <AddTodoList/>

            },

            {
                path: "todolist",
                element: <TodoList/>

            },

            {
                path: "update-todo/:id",
                element: <UpdateTodo/>
            },
        ]
    }
])
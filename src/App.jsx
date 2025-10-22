import { useEffect, useState } from 'react'
import './App.css'
import EmployeeQueueSystem from './components/EmployeeQueueSystem'
import { EmployeeLogin } from './components/EmployeeLogin';

function App() {
  const STORAGE_KEY = "currentEmployee";
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const storedEmployee = localStorage.getItem(STORAGE_KEY);
    if (storedEmployee) {
      setEmployeeName(storedEmployee);
    }
  },[])

  useEffect(()=> {
    if(employeeName) {
      localStorage.setItem(STORAGE_KEY, employeeName);
    } else{
      localStorage.removeItem(STORAGE_KEY);
    }
}, [employeeName])

  const handleLogin = (name) => {
    setEmployeeName(name)
  }

 

  if(!employeeName) return <EmployeeLogin onLogin={handleLogin}/>
  return (
    <EmployeeQueueSystem
      employeeName={employeeName}
      onLogout={() => {
        localStorage.removeItem("currentEmployee");
        setEmployeeName("");
      }}
    />
  );

}

export default App

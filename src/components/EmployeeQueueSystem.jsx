import { useEffect, useState } from "react";
import Section from "./Section";
import { findExistingReservation, toTitleCase, validateCustomerName, validatePhoneNumber } from "../assets/utils";

export default function EmployeeQueueSystem({ employeeName, onLogout }) {
    const normalizedEmployee = employeeName.trim().toLowerCase();
    const EMPLOYEE_KEY = `restaurantData_${normalizedEmployee}`;
    const WAITLIST_KEY = "restaurantWaitList";
    const MAX_QUEUE = 1000;

    const [data, setData] = useState({queue:[], served:[]});
    const [waitList, setWaitList] = useState([]);
    const [newCustomerName, setNewCustomerName] = useState("");
    const [newCustomerContact, setNewCustomerContact] = useState("");

    // Loading this employee's data from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem(EMPLOYEE_KEY);
        if (storedData && storedData !== "{}") {
            setData(JSON.parse(storedData));
        }else if(!storedData){

            const initialData = { queue: [], served: [] };
            setData(initialData);
             localStorage.setItem(
               EMPLOYEE_KEY,
               JSON.stringify(initialData)
             );
        }
    }, [employeeName]);

    // Loading shared waitlist from localStorage
    useEffect(() => {
        const shared = localStorage.getItem(WAITLIST_KEY);
        if (shared) {
            setWaitList(JSON.parse(shared));
        } else {
            localStorage.setItem(WAITLIST_KEY, JSON.stringify([]));
        }
    },[])

    // Saving this employee's data to localStorage
    useEffect(()=>{
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(data));
    },[data,employeeName]);

    // Saving shared waitlist to localStorage
    useEffect(()=>{
        localStorage.setItem(WAITLIST_KEY, JSON.stringify(waitList));
    },[waitList]);

    const addReservation = () => {
        const customerName = newCustomerName.trim();
        const customerContact = newCustomerContact.trim();
        if(!customerName || !customerContact) {
            return alert("Please enter both customer name and contact!");
        }
        const nameValidation = validateCustomerName(customerName);
        if(!nameValidation.valid) {
            return alert(nameValidation.message);
        }
        const contactValidation = validatePhoneNumber(customerContact);
        if(!contactValidation.valid) {
            return alert(contactValidation.message);
        }

        const newEntry = { name: customerName, contact: customerContact, timestamp: Date.now() };

        const existingInSystem = findExistingReservation(customerContact, waitList);

        if(existingInSystem.exists){
            if(existingInSystem.location === "queue") {
                 alert(`${customerContact} already in ${existingInSystem.employee}'s queue!`);
            } else if(existingInSystem.location === "waitlist") {
                 alert(`${customerContact} already in the shared waitlist!`);
            }
            return;
        }
        if(data.queue.length < MAX_QUEUE) {
            setData(prev => ({...prev, queue: [...prev.queue, newEntry]}));
        } else {
            setWaitList(prev => [...prev, newEntry]);
            alert(`Queue is full! ${toTitleCase(customerName)} has been added to the waitlist.`);
        }
        setNewCustomerName("");
        setNewCustomerContact("");
    };
    const serveNext = () => {
        if(data.queue.length === 0) {
            return alert("No customers in the queue to serve!");
        }
        const nextCustomer = data.queue[0];
        setData(prev => ({
            ...prev,
            queue: prev.queue.slice(1),
            served: [nextCustomer, ...prev.served],
        }));
    };
const moveFromWaitlist = () => {
  if (waitList.length === 0) {
    return alert("No customers in the waitlist to move!");
  }

  const availableSlots = MAX_QUEUE - data.queue.length;
  if (availableSlots <= 0) {
    return alert("Queue is already full!");
  }

const nextFromWaitlist = waitList[0];
setData((prev) => {
  if (prev.queue.length >= MAX_QUEUE) {
    alert("Queue became full while moving!");
    return prev;
  }
  return { ...prev, queue: [...prev.queue, nextFromWaitlist] };
});
setWaitList((prev) => prev.slice(1));


  alert(`${nextFromWaitlist.name} has been moved to your queue.`);
};

return (
  <div className="min-h-screen bg-blue-50 p-6">
    <div className="max-w-4xl mx-auto bg-blue-500 rounded-xl shadow p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">
          🍗 {toTitleCase(employeeName)}’s Queue
        </h1>
        <button
          onClick={() => {
            localStorage.setItem(
              EMPLOYEE_KEY,
              JSON.stringify(data || { queue: [], served: [] })
            );
            onLogout();
          }}
          className="bg-red-400 text-white px-3 py-1 rounded-lg hover:bg-red-500"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={newCustomerName}
          onChange={(e) => setNewCustomerName(e.target.value)}
          placeholder="Customer name"
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-yellow-400"
        />
        <input
          value={newCustomerContact}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          onChange={(e) =>
            setNewCustomerContact(e.target.value.replace(/\D/g, ""))
          }
          placeholder="Phone number"
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-yellow-400"
        />

        <button
          onClick={addReservation}
          className="bg-yellow-400 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Section
            title="Queue"
            items={data.queue}
            handler={serveNext}
            buttonTitle="Serve Next"
          />
        </div>

        <div>
          <Section
            title="Shared Waitlist"
            items={waitList}
            handler={moveFromWaitlist}
            buttonTitle="Move 1 to Queue"
          />
        </div>
      </div>

      <Section title="Served" items={data.served} className="mt-4" />
    </div>
  </div>
);
}

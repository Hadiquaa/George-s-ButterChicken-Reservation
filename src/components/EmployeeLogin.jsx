import React,{useState} from 'react'

export const EmployeeLogin = ({onLogin}) => {
    const [name, setName] = useState("");

    const handleLogin = () => {
        const trimmedName = name.trim().toLowerCase();
        if(!trimmedName) return alert("Please enter your name!");
        onLogin(trimmedName);
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-2xl font-bold text-yellow-500 mb-4 underline">
        George's Restaurant
      </h1>
      <div className="bg-blue-500 shadow-md rounded-xl p-8 text-center text">
        <h1 className="text-xl font-bold text-yellow-400 mb-4">
          👋 Welcome! Enter your employee name
        </h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter') handleLogin(); }}
          placeholder="Employee name"
          className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-yellow-400 mb-3 mr-4"
        />
        <button
          onClick={handleLogin}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}

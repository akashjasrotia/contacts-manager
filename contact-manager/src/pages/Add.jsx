import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
export default function AddContact() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  useLayoutEffect(()=>{
    const ctx = gsap.context(()=>{
      gsap.from(containerRef.current.children,{
        y:20,
        opacity:0,
        duration:0.3,
        stagger:0.1,
      },containerRef)
    },[])
    return ()=>ctx.revert();
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://contacts-manager-y75i.onrender.com/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
        credentials:'include',
      });

      const data = await res.json();

      if (data.success) {
        alert("Contact Saved");
        navigate("/");
      } else {
        alert(data.message || "Contact not saved");
      }
    } catch (err) {
      console.error("Error saving contact:", err);
      alert("Error occurred");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center font-poppins p-4">
      <div ref={containerRef} className="w-full md:w-1/3 h-auto bg-gray-950 rounded-3xl p-8 md:p-10 flex flex-col gap-6 shadow-2xl">
        <h1 className="text-3xl md:text-4xl text-white font-extrabold mb-6 text-center tracking-wide">
          Add Contact
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            required
          />
          <input
            type="number"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-4 shadow-lg transition-all duration-300"
          >
            Save Contact
          </button>
        </form>
      </div>
    </div>
  );
}


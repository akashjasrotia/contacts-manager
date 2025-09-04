import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImg from "../assets/images/profile.jpg";
import { gsap } from "gsap";
import DeleteContactButton from "../components/deleteContact";
export default function Home() {
  const navigate = useNavigate();
  const leftContent = useRef(null);
  const rightContent = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const aj = useRef(null)

  function handleOnDelete(id) {
    setContacts((prev) => prev.filter((c) => c._id !== id));
    if (selectedContact?._id === id) setSelectedContact(null);
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(leftContent.current, { x: -100,opacity:0, duration: 0.3 }).from(
        rightContent.current,
        { x: 100, duration: 0.5 },
        "<"
      );
      tl.from(leftContent.current.children,{
        y:  100,
        opacity:0,
        duration:0.5,
        stagger:0.1,
      }).from(rightContent.current.children,{
        y:  100,
        opacity:0,
        duration:0.5,
        stagger:0.1,
      },'<')
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:3000/contacts",{
          credentials:'include',
        });
        const data = await res.json();
        if(data.message == 'Not authenticated'){
          navigate('/login');
        }
        setContacts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContacts();
  }, [navigate]);

  useLayoutEffect(()=>{
    const ctx = gsap.context(()=>{
      if(aj.current){

        gsap.from(aj.current.children,{
          y:50,
          opacity:0,
          stagger:0.1,
          duration:0.3,
        })
      }
    })
    return ()=>ctx.revert()
  },[selectedContact])

  return (
    <div className="h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center font-poppins p-4">
      <div className="w-full md:w-[85%] h-[90%] md:h-[80%] rounded-3xl bg-gray-950 flex flex-col md:flex-row shadow-2xl /* removed overflow-hidden */ relative">
        {/* Left Panel: Contacts List */}
        <div
          ref={leftContent}
          className="w-full md:w-1/3 h-1/2 md:h-full bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col border-r border-gray-700"
        >
          <div className="h-26  md:h-26 w-full flex justify-center items-center border-b border-gray-700">
            <h1 className="text-2xl md:text-4xl text-white font-extrabold tracking-wide my-10 ">
              Contacts
            </h1>
          </div>
          <div className="flex-1 overflow-auto">
            {contacts.length === 0 ? (
              <div className="flex justify-center items-center text-gray-400 text-sm md:text-base mt-6">
                No contacts to display
              </div>
            ) : (
              <ul className="p-2">
                {contacts.map((c) => (
                  <li
                    key={c._id}
                    onClick={() => setSelectedContact(c)}
                    className="px-4 py-3 mb-2 rounded-xl cursor-pointer flex items-center justify-between hover:bg-gray-700 transition duration-200 shadow-sm bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                        <img
                          src={profileImg}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white font-medium">{c.name}</span>
                    </div>
                    <span className="text-gray-300">{c.phone}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="m-5 text-xl text-gray-500">
              Note: these contacts are saved in Akash Jasrotia&apos;s mongoDB
              database dont worry they are in safe hands 😘😈
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div
          ref={rightContent}
          className="relative w-full md:flex-1 h-1/2 md:h-full bg-gray-800 flex flex-col items-center justify-center gap-6 p-6 md:p-10 text-gray-300"
        >

          <div className="absolute top-5 px-6 flex justify-between w-full">
            {selectedContact ? (
              <DeleteContactButton
                contactId={selectedContact._id}
                onDeleted={(id) => handleOnDelete(id)}
              />
            ) : (
              <div />
            )}
          <button
              onClick={() => navigate("/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all cursor-pointer duration-300"
              >
              + Add Contact
            </button>
              </div>

          {selectedContact ? (
            <div ref={aj} className="flex gap-10">
              <div className="w-32 z-9 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl border-2 border-blue-500">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white space-y-2 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {selectedContact.name}
                </h2>
                <p className="text-gray-300">Email: {selectedContact.email}</p>
                <p className="text-gray-300">Phone: {selectedContact.phone}</p>
                <p className="text-gray-300">
                  Address: {selectedContact.address}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-lg md:text-xl">
              Select a contact to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

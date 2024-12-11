import { useEffect, useState, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import ContactList from './components/ContactList';
import { getContacts, saveContact, updatePhoto } from './api/ContactService';
import { Navigate, Route, Routes } from 'react-router-dom';
import ContactDetails from './components/ContactDetails';
import { toastError } from './api/toastService';
import { ToastContainer } from 'react-toastify';

function App() {

  const modalRef = useRef()
  const fileRef = useRef()
  const [data, setData] = useState({});
  const [currentPage, setcurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState(
    {
      
      name: '',
      email: '',
      phone: '',
      title: '',
      address: '',
      status: ''
    });

  const getAllContacts = async (page = 0, size = 8) => {

    try {

      setcurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
      // console.log(data);

    } catch (error) { console.log(error);
      toastError(error.message); 
      }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    // console.log(values)
  }
  const handelnewContact = async (e) => {
    e.preventDefault();
    try {
      const { data } = await saveContact(values);
      const formData = new FormData();
      formData.append("image", file, file.name);
      formData.append("id", data.id);
       await updatePhoto(formData);
      toggleModel(false)
      
      // setFile(undefined)
      // fileRef.current.value = null;
      // setValues({
        
      //   name: '',
      //   email: '',
      //   phone: '',
      //   title: '',
      //   address: '',
      //   status: ''
      // })
      getAllContacts()

    } catch (error) 
    { console.log(error);
      toastError(error.message); 
      }finally {
        setFile(undefined);
        fileRef.current.value = null;
        setValues({
          name: '',
          email: '',
          phone: '',
          title: '',
          address: '',
          status: ''
        });
      }
  };

  const updateContact=async(contact,id) =>{
    try {
          await saveContact(contact,contact.id)

    } catch (error) { console.log(error);
      toastError(error.message); 
      }
  }

  const updateImage= async(formData) =>{
    try {
      
      await updatePhoto(formData)
     

    } catch (error) { console.log(error);
      toastError(error.message);
       }
  };

  

  const toggleModel = (show) => show ? modalRef.current.showModal() : modalRef.current.close()

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    < >
      <Header toggleModel={toggleModel} numOfContacts={data.totalElements} />
      <main className='main'>
        <div className='container'>


          <Routes>
            <Route path='/' element={<Navigate to={'/contacts'} />} />
            <Route path='/contacts' element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} />} />
            <Route path='/contacts/:id' element={<ContactDetails updateContact={updateContact} updateImage={updateImage} />} />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModel(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handelnewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={values.name} onChange={onChange} name='name' required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="text" value={values.email} onChange={onChange} name='email' required />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" value={values.title} onChange={onChange} name='title' required />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input type="text" value={values.phone} onChange={onChange} name='phone' required />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" value={values.address} onChange={onChange} name='address' required />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input type="text" value={values.status} onChange={onChange} name='status' required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" onChange={(e) => { setFile(e.target.files[0]) }} ref={fileRef} name='file' required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModel(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;

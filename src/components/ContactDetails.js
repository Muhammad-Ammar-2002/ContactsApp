import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams ,Navigate,useNavigate  } from 'react-router-dom';
import { getContact,deleteContact } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/toastService';

const ContactDetails = ({ updateContact, updateImage }) => {

  const inputRef = useRef();
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    id:'',
    name: '',
    email: '',
    phone: '',
    title: '',
    address: '',
    status: '',
    imgUrl: ''
  });
  const { id } = useParams();

  const fetchContact = async (id) => {
    try {
      const { data } = await getContact(id);
      setContact({
        id: data.id ||'',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        title: data.title || '',
        address: data.address || '',
        status: data.status || '',
        imgUrl: data.imgUrl || ''  // Ensure imgUrl is safely set
      });
      toastSuccess('Contact Retrieved');
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  }

  const onUpdateContact = async (e) => {
    e.preventDefault();
    await updateContact(contact, id);
    fetchContact(id);
    toastSuccess('Contact updated');
  }

  const selectImage = () => {
    inputRef.current.click();
  }

  const updatePhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file, file.name);
      formData.append("id", id);
      await updateImage(formData);
      
      setContact((prev) => ({
        ...prev,
        imgUrl: `${prev.imgUrl}?updated_at=${new Date().getTime()}`
            }));
      toastSuccess('Photo updated');
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  }
  const onDeleteContact = async () => {
    try {
      await deleteContact(id);  // Call delete API
      toastSuccess('Contact deleted');
      setRedirect(true);   
       
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };
  

  useEffect(() => {
    fetchContact(id);
  }, [id]);
  useEffect(() => {
    if (redirect) {
      // Navigate to the home page and reload the page
      navigate('/'); 
       // This will navigate to the home page
      window.location.reload();  // This will reload the page

      toastSuccess('Contact deleted');

      
    }
  }, [redirect, navigate]);
  return (
    <>
      <Link to={'/'} className='link'>
        <i className='bi bi-arrow-left'></i>Back to list
      </Link>

      <div className='profile'>
        <div className='profile__details'>
          <img src={contact.imgUrl || '/path/to/default-image.jpg'} alt={`Photo profile of ${contact.name}`} />
          <div className='profile__metadate'>
            <p className='profile__name'>{contact.name}</p>
            <p className='profile__muted'>JPG , GIF or PNG. Max size of 10MB</p>
            <button onClick={selectImage} className='btn'>
              <i className='bi bi-cloud-upload'></i>Change photo
            </button>
          </div>
        </div>

        <div className='profile__settings'>
          <form onSubmit={onUpdateContact} className="form">
            <div className="user-details">
              <input type="hidden" value={contact.id || ''} name="id" required />
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={contact.name} onChange={onChange} name="name" required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="text" value={contact.email} onChange={onChange} name="email" required />
              </div>
              <div className="input-box">
                <span className="details">Phone</span>
                <input type="text" value={contact.phone} onChange={onChange} name="phone" required />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" value={contact.address} onChange={onChange} name="address" required />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" value={contact.title} onChange={onChange} name="title" required />
              </div>
              <div className="input-box">
                <span className="details">Status</span>
                <input type="text" value={contact.status} onChange={onChange} name="status" required />
              </div>
            </div>
            <div className="form_footer">
              <button type="submit" className="btn">Save</button>
            </div>
          </form>
        </div>

      

       {/* Delete Contact Button */}
       <div className="form_footer">
          <button to={'/'} onClick={onDeleteContact} className="btn btn-danger">Delete Contact</button>
        </div>
      </div>

      <form style={{ display: 'none' }}>
        <input type='file' ref={inputRef} onChange={(e) => updatePhoto(e.target.files[0])} name='photo' accept='image/*' />
      </form>
    </>
  )
}

export default ContactDetails;

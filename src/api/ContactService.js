import axios from "axios";

const API_URL="http://localhost:8080/contacts";

export async function saveContact(contact) {

    return await axios.post(`${API_URL}/add-contact`,contact)
    
}
export async function getContacts(page=0,size=10) {

    return await axios.get(`${API_URL}?page=${page}&size=${size}`)
    
}
export async function getContact(id) {

    return await axios.get(`${API_URL}/${id}`)
    
}
export async function updateContact(contact,id) {

    return await axios.patch(`${API_URL}/${id}`,contact)
    
}

export async function updatePhoto(formatData) {

    return await axios.put(`${API_URL}/image`,formatData)
    
}

export async function deleteContact(id) {

    return await axios.delete(`${API_URL}/${id}`)
    
}
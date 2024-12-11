package com.site.Contacts_App.Service;


import com.site.Contacts_App.Model.ContactDto;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface ContactServiceInterface {

    public Page<ContactDto> getAllContacts(Integer page, Integer size);
    public ContactDto getContactById(String id);
    public ContactDto createContact(ContactDto ontact);
    public void deleteContact(String id);
    public String UploadPhoto(String id, MultipartFile image);

    ContactDto updateContact(ContactDto ContactDto, String id);
}

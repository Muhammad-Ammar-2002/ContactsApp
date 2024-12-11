package com.site.Contacts_App.Service;



import com.site.Contacts_App.Entity.Contact;
import com.site.Contacts_App.Model.ContactDto;
import com.site.Contacts_App.Repo.ContactRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.site.Contacts_App.Constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor

public class ContactService implements ContactServiceInterface{

    private final ContactRepo contactRepo;
    private final ModelMapper mapper=new ModelMapper();

    @Override
    public Page<ContactDto> getAllContacts(Integer page, Integer size)
    {
        Page<Contact> contactPage=contactRepo.findAll(PageRequest.of(page,size, Sort.by("name")));

       return contactPage.map(contact->mapper.map(contact,ContactDto.class));
    }
    @Override

    public ContactDto getContactById(String id)
    {
        return mapper.map(contactRepo.findById(id).orElseThrow(()-> new RuntimeException("Contact not found.")), ContactDto.class);
    }

    @Override
    public ContactDto createContact(ContactDto contact)
    {
        return mapper.map(contactRepo.save(mapper.map(contact,Contact.class)), ContactDto.class);
    }

    @Override
    public void deleteContact(String id)
    {
        contactRepo.deleteById(id);

//        return "contact deleted successfully";
    }


    @Override
    public String UploadPhoto(String id, MultipartFile image)
    {
        log.info("Saving picture for user id: {}",id);
        Contact contact=mapper.map(getContactById(id), Contact.class);
        String imgUrl=imgFunction.apply(id,image);
        contact.setImgUrl(imgUrl);
        contactRepo.save(contact);
        return imgUrl;

    }

    @Override
    public ContactDto updateContact(ContactDto contact, String id) {

        Contact oldContact=mapper.map(getContactById(id), Contact.class);
        if(contact.getName()!=null)
        {
            oldContact.setName(contact.getName());
        }
        if(contact.getEmail()!=null)
        {
            oldContact.setEmail(contact.getEmail());
        }
        if(contact.getTitle()!=null)
        {
            oldContact.setTitle(contact.getTitle());
        }
        if(contact.getPhone()!=null)
        {
            oldContact.setPhone(contact.getPhone());
        }
        if(contact.getAddress()!=null)
        {
            oldContact.setAddress(contact.getAddress());
        }
        if(contact.getStatus()!=null)
        {
            oldContact.setStatus(contact.getStatus());
        }
        if(contact.getImgUrl()!=null)
        {
            oldContact.setImgUrl(contact.getImgUrl());
        }


        return  mapper.map(contactRepo.save(oldContact), ContactDto.class);
    }


    private final Function<String,String> fileExtension = fileName -> Optional.of(fileName).filter(name->name.contains("."))
                .map(name->"."+name.substring(fileName.lastIndexOf(".")+1)).orElse(".png")
     ;

    private final BiFunction<String,MultipartFile,String> imgFunction=(id,image)->{

        String fileName=id+fileExtension.apply(image.getOriginalFilename());

        try{

            Path fileStorageLocation= Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if(!Files.exists(fileStorageLocation)) {Files.createDirectories(fileStorageLocation);}
            Files.copy(image.getInputStream(),fileStorageLocation.resolve(fileName),REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/contacts/image/"+fileName)
                    .toUriString();
        }catch (Exception e)
        {
            throw  new RuntimeException("Unable to save image");
        }
    };

}





























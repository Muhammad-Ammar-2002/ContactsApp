package com.site.Contacts_App.Controller;


import com.site.Contacts_App.Entity.Contact;
import com.site.Contacts_App.Model.ContactDto;
import com.site.Contacts_App.Service.ContactServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static com.site.Contacts_App.Constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.util.MimeTypeUtils.IMAGE_JPEG_VALUE;
import static org.springframework.util.MimeTypeUtils.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactsController {

    private final ContactServiceInterface contactServiceInt;


    @PostMapping("/add-contact")
    public ResponseEntity<ContactDto> createContact(@RequestBody ContactDto contact)
    {
        return ResponseEntity.ok(contactServiceInt.createContact(contact));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ContactDto> updateContact(@RequestBody ContactDto contact,@PathVariable String id)
    {
        return ResponseEntity.ok(contactServiceInt.updateContact(contact,id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable String id)
    {
        contactServiceInt.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getContactById(@PathVariable String id)
    {
        return ResponseEntity.ok(contactServiceInt.getContactById(id));

    }

    @GetMapping
    public ResponseEntity<Page<ContactDto>> getAllContacts(@RequestParam(value = "page",defaultValue = "0") Integer page,
                                                        @RequestParam(value = "size",defaultValue = "10") Integer size)
    {
        return ResponseEntity.ok().body(contactServiceInt.getAllContacts(page,size));

    }

    @PutMapping("/image")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("image")MultipartFile image)
    {
        return ResponseEntity.ok().body(contactServiceInt.UploadPhoto(id,image));

    }

    @GetMapping(path = "/image/{imgName}",produces = {IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE})
    public byte[] getImage(@PathVariable("imgName")String imgName) throws IOException {
        return Files.readAllBytes(Paths.get(PHOTO_DIRECTORY + imgName));
    }
}

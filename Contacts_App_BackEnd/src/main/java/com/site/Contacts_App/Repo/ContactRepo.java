package com.site.Contacts_App.Repo;


import com.site.Contacts_App.Entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ContactRepo extends JpaRepository<Contact,String> {

}

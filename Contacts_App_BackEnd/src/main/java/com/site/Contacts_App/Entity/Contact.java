package com.site.Contacts_App.Entity;


import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="contacts")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Contact {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name ="id",unique = true,updatable = false )
    private String id;

    private String name;
    private String email;
    private String title;
    private String phone;
    private String address;
    private String status;
    private String imgUrl;
}

package com.site.Contacts_App.Model;

import lombok.Data;

@Data
public class ContactDto {

    private String id;
    private String name;
    private String email;
    private String title;
    private String phone;
    private String address;
    private String status;
    private String imgUrl;
}

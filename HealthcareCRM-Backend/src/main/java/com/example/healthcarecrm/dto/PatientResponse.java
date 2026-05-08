package com.example.healthcarecrm.dto;

import java.time.LocalDate;

public class PatientResponse {

    private Long id;
    private String name;
    private String phone;
    private String gender;
    private LocalDate dob;
    private boolean active;

    // ✅ GETTERS

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getGender() {
        return gender;
    }

    public LocalDate getDob() {
        return dob;
    }

    public boolean isActive() { return active; }

    // ✅ SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public void setActive(boolean active) { this.active = active; }
}
package com.example.healthcarecrm.dto;

public class DoctorRequest {

    private String name;
    private String specialization;
    private String phone;
    private boolean active;

    // ✅ GETTERS

    public String getName() {
        return name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getPhone() {
        return phone;
    }

    public boolean isActive() {
        return active;
    }

    // ✅ SETTERS

    public void setName(String name) {
        this.name = name;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
package com.example.healthcarecrm.repository;

import com.example.healthcarecrm.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
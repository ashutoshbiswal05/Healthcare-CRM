package com.example.healthcarecrm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.healthcarecrm.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
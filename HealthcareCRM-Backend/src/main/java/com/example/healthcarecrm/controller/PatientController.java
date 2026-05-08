package com.example.healthcarecrm.controller;

import com.example.healthcarecrm.dto.PatientRequest;
import com.example.healthcarecrm.dto.PatientResponse;
import com.example.healthcarecrm.service.PatientService;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Patients", description = "Manage patient records")
@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @Operation(
            summary = "Create a new patient",
            description = "Adds a new patient to the system with basic details like name, phone, gender, and date of birth"
    )
    @PostMapping
    public PatientResponse createPatient(@RequestBody PatientRequest request) {
        return patientService.createPatient(request);
    }

    @Operation(
            summary = "Update a patient",
            description = "Updates existing patient details using the patient ID"
    )
    @PutMapping("/{id}")
    public PatientResponse updatePatient(@PathVariable Long id,
                                         @RequestBody PatientRequest request) {
        return patientService.updatePatient(id, request);
    }

    @Operation(
            summary = "Get all patients",
            description = "Fetches a list of all registered patients in the system"
    )
    @GetMapping
    public List<PatientResponse> getAllPatients() {
        return patientService.getAllPatients();
    }

    @Operation(
            summary = "Deactivates a patient",
            description = "Deactivates a patient record from the system using the patient ID"
    )
    @PatchMapping("/{id}/deactivate")
    public String deactivatePatient(@PathVariable Long id) {
        patientService.deactivatePatient(id);
        return "Patient deactivated successfully";
    }

    @Operation(
            summary = "Activates a patient",
            description = "Activates a patient record from the system using the patient ID"
    )
    @PatchMapping("/{id}/activate")
    public String activatePatient(@PathVariable Long id) {
        patientService.activatePatient(id);
        return "Patient activated successfully";
    }

    @Operation(
            summary = "Delete a patient",
            description = "Deletes a patient record from the system using the patient ID"
    )
    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return "Patient deleted successfully";
    }
}
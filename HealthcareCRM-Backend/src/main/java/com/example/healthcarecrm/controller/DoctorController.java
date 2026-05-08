package com.example.healthcarecrm.controller;

import com.example.healthcarecrm.dto.DoctorRequest;
import com.example.healthcarecrm.dto.DoctorResponse;
import com.example.healthcarecrm.service.DoctorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Doctors", description = "Manage doctors")
@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @Operation(
            summary = "Create a new doctor",
            description = "Adds a new doctor with details such as name, specialization, and contact information"
    )
    @PostMapping
    public DoctorResponse createDoctor(@RequestBody DoctorRequest request) {
        return doctorService.createDoctor(request);
    }

    @Operation(
            summary = "Update a doctor",
            description = "Updates doctor information using the doctor ID"
    )
    @PutMapping("/{id}")
    public DoctorResponse updateDoctor(@PathVariable Long id,
                                       @RequestBody DoctorRequest request) {
        return doctorService.updateDoctor(id, request);
    }

    @Operation(
            summary = "Get all doctors",
            description = "Retrieves a list of all doctors available in the system"
    )
    @GetMapping
    public List<DoctorResponse> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @Operation(
            summary = "Deactivates a doctor",
            description = "Deactivates a doctor from the system using the doctor ID"
    )
    @PatchMapping("/{id}/deactivate")
    public String deactivateDoctor(@PathVariable Long id) {
        doctorService.deactivateDoctor(id);
        return "Doctor deactivated successfully";
    }

    @Operation(
            summary = "Activates a doctor",
            description = "Activates a doctor from the system using the doctor ID"
    )
    @PatchMapping("/{id}/activate")
    public String activateDoctor(@PathVariable Long id) {
        doctorService.activateDoctor(id);
        return "Doctor activated successfully";
    }

    @Operation(
            summary = "Delete a doctor",
            description = "Removes a doctor from the system using the doctor ID"
    )
    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return "Doctor deleted successfully";
    }
}
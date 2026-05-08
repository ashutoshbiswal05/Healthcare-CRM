package com.example.healthcarecrm.controller;

import com.example.healthcarecrm.dto.AppointmentRequest;
import com.example.healthcarecrm.dto.AppointmentResponse;

import com.example.healthcarecrm.model.Appointment;

import com.example.healthcarecrm.service.AppointmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Appointments", description = "Manage appointments")
@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @Operation(
            summary = "Create a new appointment",
            description = "Schedules an appointment between a patient and a doctor at a specific time"
    )
    @PostMapping
    public AppointmentResponse createAppointment(@RequestBody AppointmentRequest request) {
        return appointmentService.createAppointment(request);
    }

    @Operation(
            summary = "Update an appointment",
            description = "Modifies appointment details such as time, status, or notes using appointment ID"
    )
    @PutMapping("/{id}")
    public AppointmentResponse updateAppointment(@PathVariable Long id,
                                                 @RequestBody AppointmentRequest request) {
        return appointmentService.updateAppointment(id, request);
    }

    @Operation(
            summary = "Get all appointments",
            description = "Fetches all scheduled appointments with patient and doctor details"
    )
    @GetMapping
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @Operation(
            summary = "Update status",
            description = "Update the status from booked to other stuff"
    )
    @PatchMapping("/{id}/status")
    public String updateStatus(@PathVariable Long id,
                               @RequestParam String status) {
        appointmentService.updateStatus(id, status);
        return "Status updated";
    }

    @Operation(
            summary = "Delete an appointment",
            description = "Cancels and deletes an appointment using the appointment ID"
    )
    @DeleteMapping("/{id}")
    public String deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return "Appointment deleted successfully";
    }
}
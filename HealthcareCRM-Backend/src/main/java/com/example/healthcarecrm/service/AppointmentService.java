package com.example.healthcarecrm.service;

import com.example.healthcarecrm.dto.*;
import com.example.healthcarecrm.model.*;
import com.example.healthcarecrm.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public AppointmentResponse createAppointment(AppointmentRequest request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!patient.isActive() || !doctor.isActive()) {
            throw new RuntimeException("Cannot book appointment with inactive doctor/patient");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(request.getAppointmentTime());

        appointment.setStatus(
                AppointmentStatus.valueOf(request.getStatus().toUpperCase())
        );

        appointment.setNotes(request.getNotes());

        return mapToResponse(appointmentRepository.save(appointment));
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse updateAppointment(Long id, AppointmentRequest request) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.MISSED) {
            throw new RuntimeException("Cannot modify missed appointment");
        }

        appointment.setAppointmentTime(request.getAppointmentTime());

        appointment.setStatus(
                AppointmentStatus.valueOf(request.getStatus().toUpperCase())
        );

        appointment.setNotes(request.getNotes());

        return mapToResponse(appointmentRepository.save(appointment));
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointmentRepository.delete(appointment);
    }

    public void updateStatus(Long id, String status) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.MISSED) {
            throw new RuntimeException("Missed appointments are final");
        }

        appointment.setStatus(
                AppointmentStatus.valueOf(status.toUpperCase())
        );

        appointmentRepository.save(appointment);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();

        response.setId(appointment.getId());
        response.setPatientId(appointment.getPatient().getId());
        response.setPatientName(appointment.getPatient().getName());
        response.setDoctorId(appointment.getDoctor().getId());
        response.setDoctorName(appointment.getDoctor().getName());
        response.setAppointmentTime(appointment.getAppointmentTime());

        response.setStatus(
                appointment.getStatus() != null ? appointment.getStatus().name() : null
        );

        response.setNotes(appointment.getNotes());

        return response;
    }
}
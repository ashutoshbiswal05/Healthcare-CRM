package com.example.healthcarecrm.service;

import com.example.healthcarecrm.dto.PatientRequest;
import com.example.healthcarecrm.dto.PatientResponse;
import com.example.healthcarecrm.model.Appointment;
import com.example.healthcarecrm.model.AppointmentStatus;
import com.example.healthcarecrm.model.Patient;
import com.example.healthcarecrm.repository.AppointmentRepository;
import com.example.healthcarecrm.repository.PatientRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public PatientService(PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public PatientResponse createPatient(PatientRequest request) {
        Patient patient = new Patient();

        patient.setName(request.getName());
        patient.setPhone(request.getPhone());
        patient.setGender(request.getGender());
        patient.setDob(request.getDob());

        Patient saved = patientRepository.save(patient);

        return mapToResponse(saved);
    }

    public PatientResponse updatePatient(Long id, PatientRequest request) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setName(request.getName());
        patient.setPhone(request.getPhone());
        patient.setGender(request.getGender());
        patient.setDob(request.getDob());

        Patient updated = patientRepository.save(patient);

        return mapToResponse(updated);
    }

    @Transactional
    public void deactivatePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setActive(false);

        List<Appointment> activeAppointments =
                appointmentRepository.findByPatientIdAndStatusNot(id, AppointmentStatus.CANCELLED);

        for (Appointment appointment : activeAppointments) {
            appointment.setStatus(AppointmentStatus.CANCELLED);
        }

        patientRepository.save(patient);
    }

    public void activatePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setActive(true);
        patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (patient.isActive()) {
            throw new RuntimeException("Deactivate patient before deleting");
        }

        List<Appointment> activeAppointments =
                appointmentRepository.findByPatientIdAndStatusNot(id, AppointmentStatus.CANCELLED);

        if (!activeAppointments.isEmpty()) {
            throw new RuntimeException("Patient has active appointments");
        }

        patientRepository.delete(patient);
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PatientResponse mapToResponse(Patient patient) {
        PatientResponse response = new PatientResponse();

        response.setId(patient.getId());
        response.setName(patient.getName());
        response.setPhone(patient.getPhone());
        response.setGender(patient.getGender());
        response.setDob(patient.getDob());
        response.setActive(patient.isActive());

        return response;
    }
}
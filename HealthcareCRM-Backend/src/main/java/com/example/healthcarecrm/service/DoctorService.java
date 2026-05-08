package com.example.healthcarecrm.service;

import com.example.healthcarecrm.dto.DoctorRequest;
import com.example.healthcarecrm.dto.DoctorResponse;
import com.example.healthcarecrm.model.Appointment;
import com.example.healthcarecrm.model.AppointmentStatus;
import com.example.healthcarecrm.model.Doctor;
import com.example.healthcarecrm.repository.AppointmentRepository;
import com.example.healthcarecrm.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorService(DoctorRepository doctorRepository,
                         AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public DoctorResponse createDoctor(DoctorRequest request) {
        Doctor doctor = new Doctor();

        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setPhone(request.getPhone());

        Doctor saved = doctorRepository.save(doctor);

        return mapToResponse(saved);
    }

    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setPhone(request.getPhone());

        Doctor updated = doctorRepository.save(doctor);

        return mapToResponse(updated);
    }

    @Transactional
    public void deactivateDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setActive(false);

        List<Appointment> activeAppointments =
                appointmentRepository.findByDoctorIdAndStatusNot(id, AppointmentStatus.CANCELLED);

        for (Appointment appointment : activeAppointments) {
            appointment.setStatus(AppointmentStatus.CANCELLED);
        }

        doctorRepository.save(doctor);
    }

    public void activateDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setActive(true);
        doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctor.isActive()) {
            throw new RuntimeException("Deactivate doctor before deleting");
        }

        List<Appointment> activeAppointments =
                appointmentRepository.findByDoctorIdAndStatusNot(id, AppointmentStatus.CANCELLED);

        if (!activeAppointments.isEmpty()) {
            throw new RuntimeException("Doctor has active appointments");
        }

        doctorRepository.delete(doctor);
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();

        response.setId(doctor.getId());
        response.setName(doctor.getName());
        response.setSpecialization(doctor.getSpecialization());
        response.setPhone(doctor.getPhone());
        response.setActive(doctor.isActive());

        return response;
    }
}
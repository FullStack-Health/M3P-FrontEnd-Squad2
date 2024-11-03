import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../services/patient.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BirthDatePipe } from '../../pipes/birth-date.pipe';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterModule, BirthDatePipe],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss'
})
export class RecordsComponent {

  constructor (
    private toastrService: ToastrService,
    private patientService: PatientService,
    private router: Router,
  ) {}

  patientInput = new FormGroup({
    nameOrId: new FormControl('')
  });

  patientsList: any = [];
  resultsList: any = [];

  selectedPatientName: string = "";
  selectedPatientId: string = "";

  ngOnInit () {
    this.patientService.getListaPronturario().subscribe((patients) => {
    this.patientsList = patients.content;
    this.resultsList = this.patientsList;
    this.resultsList.sort((a: any,b: any) => a.paciente.name.localeCompare(b.paciente.name));
    })
  };

  searchPatient() {
    const nameOrId = this.patientInput.value.nameOrId?.trim();
    if (nameOrId) {
      this.patientService.getListaPronturario().subscribe((patients) => {
        this.patientsList = patients.content;
        this.resultsList = this.patientsList.filter((searchedPatient: { paciente: { name: string, id: string } }) => {
          const isNameMatch = searchedPatient.paciente.name && searchedPatient.paciente.name.toLowerCase().includes(nameOrId.toLowerCase());
          const isIdMatch = searchedPatient.paciente.id && searchedPatient.paciente.id.toString().includes(nameOrId);
          return isNameMatch || isIdMatch;
        });
        this.resultsList.sort((a: any,b: any) => a.paciente.name.localeCompare(b.paciente.name));
        if (this.resultsList.length === 0) {
          this.toastrService.error("Não foram encontrados registros de paciente com este nome ou código de registro.");
        }
      });
    } else {
      this.patientService.getListaPronturario().subscribe((patients) => {
        this.patientsList = patients.content;
        this.resultsList = this.patientsList;
        this.resultsList.sort((a: any,b: any) => a.paciente.name.localeCompare(b.paciente.name));
      });
      this.toastrService.info("A lista de pacientes foi recarregada.");
    }
  };

  redirectToDetail(patientId: string){
    this.router.navigate(["medical-records", patientId]);
  };

  redirectToPatient(patientId: string){
    this.router.navigate(["edit-patient", patientId]);
  };


}

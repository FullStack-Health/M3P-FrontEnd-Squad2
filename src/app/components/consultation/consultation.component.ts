import { CommonModule, formatDate, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultationService } from '../../services/consultation.service';
import { PatientService } from '../../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { BirthDatePipe } from '../../pipes/birth-date.pipe';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-consultation',
  standalone: true,
  templateUrl: './consultation.component.html',
  styleUrl: './consultation.component.scss',
  imports: [ReactiveFormsModule, CommonModule, BirthDatePipe, FontAwesomeModule, NgxMaskDirective, NgxMaskPipe]
})
export class ConsultationComponent {

  constructor(
    private consultationService: ConsultationService,
    private toastrService: ToastrService,
    private patientService: PatientService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private confirmDialogService: ConfirmDialogService,
  ) { };

  patientInput = new FormGroup({
    nameOrId: new FormControl('')
  });

  patientsList: any = [];
  resultsList: any = [];

  selectedPatientName: string = "";
  selectedPatientId: string = "";

  consultationInfo = new FormGroup({
    reason: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
    date: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', "en"), [Validators.required]),
    time: new FormControl(formatDate(new Date(), 'HH:mm', "en"), [Validators.required]),
    issueDescription: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(1024)]),
    prescribedMedication: new FormControl(''),
    observation: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(256)]),
  });

  editingMode = false;
  consultationToEdit: any = {};

  faCircleChevronLeft = faCircleChevronLeft;
  faPenToSquare = faPenToSquare;

  ngOnInit() {
    this.activatedRoute.params.subscribe((parameters) => {
      let consultationId = parameters['id'];
      if (consultationId) {
        this.editingMode = true;
        this.getConsultation(consultationId);
      }
      else {
        this.editingMode = false;
      }
    });
  };

  getConsultation(consultationId: string) {
    this.consultationService.getConsultation().subscribe((consultations) => {
      this.consultationToEdit = consultations.content.find((consultation: { id: string; }) => consultation.id == consultationId);
      this.consultationInfo.patchValue({
        reason: this.consultationToEdit.reason,
        date: this.consultationToEdit.date,
        time: this.consultationToEdit.time,
        issueDescription: this.consultationToEdit.issueDescription,
        prescribedMedication: this.consultationToEdit.prescribedMedication,
        observation: this.consultationToEdit.observation,
        });
      this.selectedPatientId = this.consultationToEdit.patient?.id;
      this.selectedPatientName = this.consultationToEdit.patient?.name;
    });
  };

  searchPatient() {
    const nameOrId = this.patientInput.value.nameOrId?.trim();
    if (nameOrId) {
      this.patientService.getPatient().subscribe((patients) => {
        this.patientsList = patients.content;
        this.resultsList = this.patientsList.filter((searchedPatient: { name: string, id: string }) => {
          const isNameMatch = searchedPatient.name && searchedPatient.name.toLowerCase().includes(nameOrId.toLowerCase());
          const isIdMatch = searchedPatient.id && searchedPatient.id.toString().includes(nameOrId);
          return isNameMatch || isIdMatch;
        });
        this.resultsList.sort((a: any,b: any) => a.name.localeCompare(b.name));
        if (this.resultsList.length === 0) {
        this.toastrService.error("Não foram encontrados registros de paciente com este nome ou código de registro.");
      }
      });
    } else {
      this.toastrService.warning("Preencha nome ou identificador no campo de busca.");
    }
  };

  selectPatient(name: string, id: string) {
    this.toastrService.info("Você selecionou " + name);
    this.selectedPatientName = name;
    this.selectedPatientId = id;
    this.resultsList = [];
  }

  saveConsultation() {
    if (!!this.selectedPatientId) {
      if (this.consultationInfo.valid) {
        const newConsultation = {
          "patientId": this.selectedPatientId,
          "reason": this.consultationInfo.value.reason,
          "date": this.consultationInfo.value.date,
          "time": this.consultationInfo.value.time,
          "issueDescription": this.consultationInfo.value.issueDescription,
          "prescribedMedication": this.consultationInfo.value.prescribedMedication,
          "observation": this.consultationInfo.value.observation,
        }
        this.consultationService.addConsultation(newConsultation).subscribe({
          next: (response): void => {
            this.consultationInfo.reset();
            this.consultationInfo.get('date')?.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
            this.consultationInfo.get('time')?.setValue(formatDate(new Date(), 'HH:mm', 'en'));
            this.toastrService.success('Nova consulta salva com sucesso!', '');
          },
          error: (error) => {
            this.toastrService.error('Não foi possível salvar a nova consulta.', error.error);
          }
        });
      } else {
        this.toastrService.warning("Preencha todos os campos obrigatórios corretamente.");
      }
    } else {
      this.toastrService.warning("Selecione um registro de paciente para vincular a esta consulta.");
    }
  };

  editConsultation() {
      if (this.consultationInfo.valid) {
        console.log(this.consultationToEdit);
        const editedConsultation = {
          "patientId": this.selectedPatientId,
          "reason": this.consultationInfo.value.reason,
          "date": this.consultationInfo.value.date,
          "time": this.consultationInfo.value.time,
          "issueDescription": this.consultationInfo.value.issueDescription,
          "prescribedMedication": this.consultationInfo.value.prescribedMedication,
          "observation": this.consultationInfo.value.observation,
        }
        this.consultationService.editConsultation(this.consultationToEdit.id, editedConsultation).subscribe({
          next: (response): void => {
            this.toastrService.success('Consulta alterada com sucesso!', '');
            this.location.back();
          },
          error: (error) => {
            this.toastrService.error('Não foi possível editar a consulta.', error.error);
          }
        });
      } else {
        this.toastrService.warning("Preencha todos os campos obrigatórios corretamente.");
      }
  };  

  deleteConsultation() {
    this.confirmDialogService.confirm('Confirmar', 'Você deseja realmente apagar esta consulta? Esta ação é irreversível.', "Sim", "Cancelar")
    .then((confirmed) => {
      if (confirmed) {
        this.consultationService.deleteConsultation(this.consultationToEdit.id).subscribe({
          next: (response): void => {
            this.toastrService.success('Consulta apagada com sucesso!', '');
            this.location.back();
          },
          error: (error) => {
            this.toastrService.error('Algo deu errado ao tentar editar a consulta.', '');
          }
        })
      };
    })
    .catch((error) => {});
  };

  goBack() {
    this.location.back();
    };


}

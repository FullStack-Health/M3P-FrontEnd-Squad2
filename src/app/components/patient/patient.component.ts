import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PatientService } from '../../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { ExamService } from '../../services/exam.service';
import { ConsultationService } from '../../services/consultation.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { DateFormatOutPipe } from '../../pipes/date-format-out.pipe';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective, NgxMaskPipe, FontAwesomeModule, DateFormatOutPipe],
  providers: [DateFormatOutPipe],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss'
})
export class PatientComponent {

  constructor(
    private addressService: AddressService,
    private patientService: PatientService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private examService: ExamService,
    private consultationService: ConsultationService,
    private dateFormatOut: DateFormatOutPipe,
  ) { };

  editingMode: boolean = false;
  patientToEdit: any = {};
  address: any | undefined;
  datePattern = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{4}$/;
  faCircleChevronLeft = faCircleChevronLeft;
  faPenToSquare = faPenToSquare;

  patientInfo = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
    gender: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required, Validators.pattern(this.datePattern)]),
    cpf: new FormControl('', [Validators.required]),
    rg: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    maritalStatus: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    birthCity: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
    emergencyContact: new FormControl('', [Validators.required]),
    allergies: new FormControl('', [Validators.required]),
    specialCare: new FormControl(''),
    insuranceCompany: new FormControl(''),
    insuranceNumber: new FormControl(''),
    insuranceExpiration: new FormControl('', Validators.pattern(this.datePattern)),
    cep: new FormControl('', [Validators.required]),
    addressStreet: new FormControl('', [Validators.required]),
    addressNumber: new FormControl(''),
    addressComplement: new FormControl(''),
    addressNeighborhood: new FormControl('', [Validators.required]),
    addressCity: new FormControl('', [Validators.required]),
    addressState: new FormControl('', [Validators.required]),
    addressLandmark: new FormControl(''),
  });

  ngOnInit() {
    this.activatedRoute.params.subscribe((parameters) => {
      let patientId = parameters['id'];
      if (patientId) {
        this.editingMode = true;
        this.getPatient(patientId);
      }
      else {
        this.editingMode = false;
      }
    });
  };

  getPatient(patientId: string) {

    const convertFromBd = (birthDate: string): string => {
      if (!birthDate) return '';
      const parts = birthDate.split('T')[0].split('-');
      return `${parts[2]}${parts[1]}${parts[0]}`;
    }

    this.patientService.getPatient().subscribe({
      next:(patients) => {
      this.patientToEdit = patients.content.find((patient: { id: string; }) => patient.id == patientId);

      const formattedBirthDateFromBd = convertFromBd(this.patientToEdit.birthDate);
      const formattedInsuranceDateFromBd = convertFromBd(this.patientToEdit.insuranceExpiration);

      this.patientInfo.patchValue({
        name: this.patientToEdit.name,
        gender: this.patientToEdit.gender,
        birthDate: formattedBirthDateFromBd,
        cpf: this.patientToEdit.cpf,
        rg: this.patientToEdit.rg,
        maritalStatus: this.patientToEdit.maritalStatus,
        phone: this.patientToEdit.phone,
        email: this.patientToEdit.email,
        birthCity: this.patientToEdit.birthCity,
        emergencyContact: this.patientToEdit.emergencyContact,
        allergies: this.patientToEdit.allergies,
        specialCare: this.patientToEdit.specialCare,
        insuranceCompany: this.patientToEdit.insuranceCompany,
        insuranceNumber: this.patientToEdit.insuranceNumber,
        insuranceExpiration: formattedInsuranceDateFromBd,
        cep: this.patientToEdit.address.cep,
        addressStreet: this.patientToEdit.address.logradouro,
        addressNumber: this.patientToEdit.address.numero,
        addressComplement: this.patientToEdit.address.complemento,
        addressNeighborhood: this.patientToEdit.address.bairro,
        addressCity: this.patientToEdit.address.cidade,
        addressState: this.patientToEdit.address.estado,
        addressLandmark: this.patientToEdit.address.pontoDeReferencia,
      });
    },
    error: (error) => {
      this.toastrService.error('Não foi possível carregar o registro de paciente com o id '+patientId, error.error);
    }
    });
  };

  searchAddress() {
    this.addressService.getAddress(this.patientInfo.value.cep).subscribe(
      {
        next: (response): void => {
          this.address = response;
          this.patientInfo.patchValue({
            addressStreet: this.address.logradouro,
            addressNeighborhood: this.address.bairro,
            addressCity: this.address.localidade,
            addressState: this.address.uf
          }
          );
          if (this.address.logradouro) {
            this.toastrService.success('Dados de endereço encontrados.', '');
          }
          else {
            this.toastrService.error('Informações de endereço não encontradas.', '');
          };
        },
        error: (error) => {
          this.toastrService.error('CEP Inválido.', '');
        }
      }
    );
  };

  formatDateOut(date: string): string {
    return date ? this.dateFormatOut.transform(date) : '';
  }  

  savePatient() {
    if (!this.patientInfo.valid) {
      this.toastrService.warning("Preencha todos os campos obrigatórios corretamente");
      return;
    }
    const newPatient = {
      "name": this.patientInfo.value.name,
      "gender": this.patientInfo.value.gender,
      "birthDate": this.formatDateOut(this.patientInfo.value.birthDate || ''),
      "cpf": this.patientInfo.value.cpf,
      "rg": this.patientInfo.value.rg,
      "maritalStatus": this.patientInfo.value.maritalStatus,
      "phone": this.patientInfo.value.phone,
      "email": this.patientInfo.value.email,

      "birthCity": this.patientInfo.value.birthCity,
      "emergencyContact": this.patientInfo.value.emergencyContact,
      "allergies": this.patientInfo.value.allergies,
      "specialCare": this.patientInfo.value.specialCare,
      "insuranceCompany": this.patientInfo.value.insuranceCompany,
      "insuranceNumber": this.patientInfo.value.insuranceNumber,
      "insuranceExpiration": this.formatDateOut(this.patientInfo.value.insuranceExpiration || ''),
      "address": {
        "cep": this.patientInfo.value.cep,
        "cidade": this.patientInfo.value.addressCity,
        "estado": this.patientInfo.value.addressState,
        "logradouro": this.patientInfo.value.addressStreet,
        "numero": this.patientInfo.value.addressNumber,
        "complemento": this.patientInfo.value.addressComplement,
        "bairro": this.patientInfo.value.addressNeighborhood,
        "pontoDeReferencia": this.patientInfo.value.addressLandmark,
      }
    };
    this.patientService.addPatient(newPatient).subscribe({
      next: (response): void => {
        this.patientInfo.reset();
        this.toastrService.success('Novo registro de paciente salvo com sucesso!', '');
      },
      error: (error) => {
        this.toastrService.error('Não foi possível salvar o registro de paciente.', error.error);
      }
    });
  };

  editPatient() {
    if (!this.patientInfo.valid) {
      this.toastrService.warning("Preencha todos os campos obrigatórios corretamente");
      return;
    }
      const editedPatient = {
        "name": this.patientInfo.value.name,
        "gender": this.patientInfo.value.gender,
        "birthDate": this.formatDateOut(this.patientInfo.value.birthDate || ''),
        "cpf": this.patientInfo.value.cpf,
        "rg": this.patientInfo.value.rg,
        "maritalStatus": this.patientInfo.value.maritalStatus,
        "phone": this.patientInfo.value.phone,
        "email": this.patientInfo.value.email,
        "birthCity": this.patientInfo.value.birthCity,
        "emergencyContact": this.patientInfo.value.emergencyContact,
        "allergies": this.patientInfo.value.allergies,
        "specialCare": this.patientInfo.value.specialCare,
        "insuranceCompany": this.patientInfo.value.insuranceCompany,
        "insuranceNumber": this.patientInfo.value.insuranceNumber,
        "insuranceExpiration": this.formatDateOut(this.patientInfo.value.insuranceExpiration || ''),
        "address": {
          "cep": this.patientInfo.value.cep,
          "cidade": this.patientInfo.value.addressCity,
          "estado": this.patientInfo.value.addressState,
          "logradouro": this.patientInfo.value.addressStreet,
          "numero": this.patientInfo.value.addressNumber,
          "complemento": this.patientInfo.value.addressComplement,
          "bairro": this.patientInfo.value.addressNeighborhood,
          "pontoDeReferencia": this.patientInfo.value.addressLandmark,
        }
      }
      this.patientService.editPatient(this.patientToEdit.id, editedPatient).subscribe({
        next: (response): void => {
          this.toastrService.success('Registro de paciente atualizado com sucesso!', '');
          this.location.back();
        },
        error: (error) => {
          if (error.status === 403 ) 
            { this.toastrService.error('O email informado já está em uso. Por favor, use um email diferente.', ''); } 
          else { this.toastrService.error('Não foi possível editar este registro.', error.error); } }
       
        
      });
  };

  deletePatient() {
    this.confirmDialogService.confirm('Confirmar', 'Você deseja realmente apagar este registro de paciente? Esta ação é irreversível.', "Sim", "Cancelar")
      .then(async (confirmed) => {
        if (confirmed) {
          if (await this.isDeletable(this.patientToEdit.id)) {
            this.patientService.deletePatient(this.patientToEdit.id).subscribe({
              next: (response): void => {
                this.toastrService.success('Registro de paciente apagado com sucesso!', '');
                this.router.navigate(["home"]);
              },
              error: (error) => {
                this.toastrService.error('Não foi possível apagar o registro.', error.error);
              }
            })
          } else {
            this.toastrService.warning('Não é possível apagar um registro de paciente que esteja associado a exames ou consultas.', '');
          }
        }
      })
      .catch((error) => { });
  };

  patientEvents: any[] = [];

  isDeletable(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let patientConsultations: any[] = [];
      this.consultationService.getConsultation().subscribe((consultations) => {
        const patientConsultations = consultations.content.filter((consultation: { patient: { id: string } }) => {
          return consultation.patient && consultation.patient.id == this.patientToEdit.id;
        });

        let patientExams = [];
        this.examService.getExam().subscribe((exams) => {
          patientExams = exams.content.filter((exam: { paciente: { id: string } }) => exam.paciente.id == this.patientToEdit.id);


          this.patientEvents = patientConsultations.concat(patientExams);
          if (this.patientEvents.length > 0) {
            resolve(false);
          } else {
            resolve(true);
          };
        });
      });
    });
  };

  goBack() {
    this.location.back();
  };

  onSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      const { selectionStart, selectionEnd, value } = target;
      target.value = value.substring(0, selectionStart) + ', ' + value.substring(selectionEnd);
      target.selectionStart = target.selectionEnd = selectionStart + 2;
    }
  }

  convertDatefromBd() {
    const convertFromBd = (birthDate: string): string => {
      if (!birthDate) return '';
      const parts = birthDate.split('T')[0].split('-');
      return `${parts[2]}${parts[1]}${parts[0]}`;
    }

  }


}

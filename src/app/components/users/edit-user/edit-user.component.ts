import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../services/user.service';
import { DateFormatInPipe } from '../../../pipes/date-format-in.pipe';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, NgxMaskDirective, NgxMaskPipe, DateFormatInPipe],
  providers: [DateFormatInPipe],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private toastrService: ToastrService,
    private dateFormatIn: DateFormatInPipe,
  ) { }

  userToEdit: any = {};

  datePattern = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{4}$/;

  faCircleChevronLeft = faCircleChevronLeft;

  userInfo = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
    birthDate: new FormControl('', [Validators.required, Validators.pattern(this.datePattern)]),
    cpf: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  ngOnInit() {
    this.activatedRoute.params.subscribe((parameters) => {
      let userId = parameters['id'];
      if (userId) {
        this.getUser(userId);
      }
    });
  };

  
  getUser(userId: string) {
    this.userService.getUser(userId).subscribe({
      next: (response): void => {
        this.userToEdit = response;
        const formattedDate = this.dateFormatIn.transform(this.userToEdit.dataNascimento);
        this.userInfo.patchValue({
          name: this.userToEdit.nome,
          birthDate: formattedDate,
          cpf: this.userToEdit.cpf,
          phone: this.userToEdit.telefone,
          email: this.userToEdit.email
        });
      }
    });
  }


  save(){
    if (this.userInfo.valid) {
      this.toastrService.success('Registro de paciente atualizado com sucesso!', '');
      this.router.navigate(["home"]);
    } else {
      this.toastrService.error('Por favor, preencha todos os campos obrigatórios.', '');
    }
  }


  delete() {
    // this.confirmDialogService.confirm('Confirmar', 'Você deseja realmente apagar este registro de paciente? Esta ação é irreversível.', "Sim", "Cancelar")
    // .then(async (confirmed) => {
    //   if (confirmed) {
    //     if (await this.isDeletable(this.patientToEdit.id)) {
    //       this.patientService.deletePatient(this.patientToEdit.id).subscribe({
    //         next: (response): void => {
    //           this.toastrService.success('Registro de paciente apagado com sucesso!', '');
    //           this.router.navigate(["home"]);
    //         },
    //         error: (error) => {
    //           this.toastrService.error('Algo deu errado ao tentar apagar o registro.', '');
    //         }
    //       })
    //     } else {
    //       this.toastrService.warning('Não é possível apagar um registro de paciente que esteja associado a exames ou consultas.', '');
    //     }}
    // })
    // .catch((error) => {});
  };

  goBack() {
    this.location.back();
    };

}

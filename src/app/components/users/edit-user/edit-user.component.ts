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
import { DateFormatOutPipe } from '../../../pipes/date-format-out.pipe';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, NgxMaskDirective, NgxMaskPipe, DateFormatInPipe, DateFormatOutPipe],
  providers: [DateFormatInPipe, DateFormatOutPipe],
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
    private dateFormatOut: DateFormatOutPipe,
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
      },
      error: (error) => {
        this.toastrService.error('Não foi possível carregar este registro.', error.error);
      }
    });
  }


  save(){
    if (this.userInfo.valid) {
      let formattedDate = '';
      if (this.userInfo.value.birthDate) {
      formattedDate = this.dateFormatOut.transform(this.userInfo.value.birthDate);
      }
      const user = {
        nome: this.userInfo.value.name,
        dataNascimento: formattedDate,
        cpf: this.userInfo.value.cpf,
        telefone: this.userInfo.value.phone,
        email: this.userInfo.value.email,
      };
      this.userService.put(user, this.userToEdit.id).subscribe({
        next: (response): void => {
          this.toastrService.success('Registro de pessoa usuária atualizado com sucesso!', '');
          this.router.navigate(["users-list"]);
        },
        error: (error) => {
          this.toastrService.error('Não foi possível atualizar o registro.', error.error);
        }
      })
    } else {
      this.toastrService.warning('Por favor, preencha todos os campos obrigatórios.', '');
    }
  }

  delete() {
    this.confirmDialogService.confirm('Confirmar', 'Você deseja realmente apagar este registro de pessoa usuária? Esta ação é irreversível.', "Sim", "Cancelar")
    .then(async (confirmed) => {
      if (confirmed) {
          this.userService.delete(this.userToEdit.id).subscribe({
            next: (response): void => {
              this.toastrService.success('Registro de pessoa usuária apagado com sucesso!', '');
              this.router.navigate(["users-list"]);
            },
            error: (error) => {
              this.toastrService.error('Não foi possível apagar este registro.', error.error);
            }
          })
        }
    })
    .catch((error) => {});
  };

  goBack() {
    this.location.back();
    };

}

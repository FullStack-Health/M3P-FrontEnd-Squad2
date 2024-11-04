import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor (
    private toastrService: ToastrService,
    private userService: UserService,
    private router: Router,
  ) {}

  userInput = new FormGroup({
    emailOrId: new FormControl('')
  });

  usersList: any[] = [];
  resultsList: any[] = [];

  selectedUserName: string = "";
  selectedUserId: string = "";

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users) => {
      if (Array.isArray(users.content)) {
        this.usersList = users.content;
        this.resultsList = this.usersList;
        this.sortResults;
      }
    })
  };

  searchUser() {
    const emailOrId = this.userInput.value.emailOrId?.trim();
    if (emailOrId) {
      this.userService.getUsers().subscribe((users) => {
        if (Array.isArray(users.content)) {
          this.usersList = users.content;
          this.resultsList = this.usersList.filter((searchedUser: { email: string, id: string }) => {
            const isEmailMatch = searchedUser.email && searchedUser.email.toLowerCase().includes(emailOrId.toLowerCase());
            const isIdMatch = searchedUser.id && searchedUser.id.toString().includes(emailOrId);
            return isEmailMatch || isIdMatch;
          });
          this.sortResults;
          if (this.resultsList.length === 0) {
          this.toastrService.error("Não foram encontrados registros de pessoa usuária com este e-mail ou código de registro.");
          }
        }
      });
    } else {
      this.loadUsers();
      this.toastrService.info("A lista de pessoas usuárias foi recarregada.");
    }
  };

  sortResults() {
    this.resultsList.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  redirectToEdit(userId: string){
    this.router.navigate(["edit-user", userId]);
  };


}

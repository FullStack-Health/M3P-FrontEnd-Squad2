import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {

  loggedUserName: string = "";
  loggedUser: any;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
  ) {
  };

  ngOnInit(): void {
    const loggedUserStorage = localStorage.getItem("loggedUser");
    if (loggedUserStorage) {
      this.loggedUser = JSON.parse(loggedUserStorage);
      if(this.loggedUser.nome){
        this.loggedUserName = this.loggedUser.nome;
      } else {
        this.loggedUserName = this.loggedUser.username;
      }
      
    };
  }

  getCurrentUrl() {
    return this.router.url;
  };

  logout() {
    localStorage.setItem("loggedUser", JSON.stringify(""));
    this.toastrService.success("Logout realizado com sucesso.", '')
    this.router.navigate(["login"]);;
  };

}
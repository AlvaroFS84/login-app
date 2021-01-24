import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario:UsuarioModel;
  recordar:boolean = false;

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
    }
  }

  login(form:NgForm){
    if(form.invalid){ return;}

    Swal.fire({
      icon: 'warning',
      title: 'Logueando',
      text: 'Espera unos segundos',
      allowOutsideClick:false
    });
    Swal.showLoading()

    

    this.auth.login(this.usuario)
      .subscribe(
        resp => { 
          console.log(resp);
          Swal.close();
          if(this.recordar){
            localStorage.setItem('email', this.usuario.email);
          }
          this.router.navigateByUrl('/home');
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: err.error.error.message,
            allowOutsideClick:false
          });
        }
      );

  }
}

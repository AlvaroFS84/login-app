import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario:UsuarioModel;

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() { 
    this.usuario = new UsuarioModel();
    if(localStorage.getItem('email'))
      this.usuario.email = localStorage.getItem('email')
  }

  onSubmit(form:NgForm){
    if(form.invalid){ return; }
    Swal.fire({
      icon: 'warning',
      title: 'Registrando',
      text: 'Espera unos segundos',
      allowOutsideClick:false
    });
    Swal.showLoading()
    
    this.auth.resgistrar( this.usuario )
      .subscribe(resp => {
        console.log(resp);
        Swal.close();
        this.router.navigateByUrl('/home');
      }, 
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: err.error.error.message,
          allowOutsideClick:false
        });
      } );
    
  }
}

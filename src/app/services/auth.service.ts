import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apikey = 'AIzaSyDYXJP7Pgk7mZVuAT9W0txT1h7YKvkbpZc';
  userToken:string;

  constructor(private http:HttpClient) {
    this.leerToken();
   }

  login(usuario:UsuarioModel){
    const authData = {
      ...usuario,//operador de propagacion
      returnSecureToken:true
    }
    return this.http.post(
      `${ this.url }:signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( (resp:any) =>{
        this.guardarToken(resp.idToken)
        return resp;
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
  }

  resgistrar(usuario:UsuarioModel){

    const authData = {
      ...usuario,//operador de propagacion
      returnSecureToken:true
    }
    return this.http.post(
      `${ this.url }:signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( (resp:any) =>{
        this.guardarToken(resp.idToken)
        return resp;
      })
    );
  }

  private guardarToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    var expiraDate = new Date().setSeconds(60);
    localStorage.setItem('expira',expiraDate.toString());
  }

  private leerToken(){
    if(localStorage.getItem('token'))
      this.userToken = localStorage.getItem('token');
    else
      this.userToken = '';
    
    return this.userToken;
  }

  estaAutenticado():boolean{

    var expira = new Date(Number(localStorage.getItem('expira')));
    var ahora = new Date();
    if(this.userToken.length > 0 &&  expira > ahora)
      return true;
    else
      return false;
  }
}

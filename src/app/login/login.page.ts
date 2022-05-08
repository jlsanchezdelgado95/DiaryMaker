import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/servicios/authentication.service';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Recojo datos necesarios para cada caso
  correo = new FormControl('');
  contrasenya = new FormControl('');
  // Controlo los mensajes que muestro con estos booleanos
  cerradoRegistro1 = true;
  cerradoRegistro2 = true;
  cerradoRegistro3 = true;
  cerradoRegistro4 = true;
  cerradoRegistro5 = true;

  cerradoAcceso1 = true;
  cerradoAcceso2 = true;
  cerradoAcceso3 = true;
  cerradoAcceso4 = true;

  constructor(private firebase: AngularFirestore, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  resetAllAlerts() {
    this.resetAlertsLogin();
    this.resetAlertsRegis();
  }

  acceder() {
    this.resetAllAlerts();
    this.authService.accederService(this.correo.value, this.contrasenya.value).then(res => {
      //console.log("Logueado");
      this.router.navigateByUrl("/main");
    })
      .catch(e => {
        console.log("Problemas con el acceso: ", e.message)
        if (e.message == "There is no user record corresponding to this identifier. The user may have been deleted") {
          this.cerradoAcceso1 = false;
        } else if (e.message == "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).") {
          this.cerradoAcceso2 = false;
        } else if (e.message == "Firebase: The email address is badly formatted. (auth/invalid-email).") {
          this.cerradoAcceso3 = false;
        } else if (e.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred.") {
          this.cerradoAcceso4 = false;
        }
      });
  }

  resetAlertsLogin() {
    this.cerradoAcceso1 = true;
    this.cerradoAcceso2 = true;
    this.cerradoAcceso3 = true;
    this.cerradoAcceso4 = true;
  }

  registrarse() {
    this.resetAllAlerts();
    this.authService.registarseService(this.correo.value, this.contrasenya.value).then(res => {
      console.log("Registrado");
      this.cerradoRegistro4 = false;
    })
      .catch(e => {
        console.log("No se ha podido registrar", e.message)
        if (e.message == "The email address is already in use by another account.") {
          this.cerradoRegistro2 = false;
          //console.log("Se esta usando este correo electrónico");
        } else if (e.message == "The email address is badly formatted.") {
          this.cerradoRegistro1 = false;
        } else if (e.message == "The password must be 6 characters long or more.") {
          this.cerradoRegistro3 = false;
        } else if (e.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred.") {
          this.cerradoRegistro5 = false;
        }
      });
  }

  resetAlertsRegis() {
    this.cerradoRegistro1 = true;
    this.cerradoRegistro2 = true;
    this.cerradoRegistro3 = true;
    this.cerradoRegistro4 = true;
    this.cerradoRegistro5 = true;
  }

}

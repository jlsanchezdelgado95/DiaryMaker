import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/servicios/authentication.service';
import { Router } from '@angular/router';
// Servicios
import { MainService } from 'src/app/servicios/main.service';

@Component({
  selector: 'app-crear-tareas',
  templateUrl: './crear-tareas.page.html',
  styleUrls: ['./crear-tareas.page.scss'],
})
export class CrearTareasPage implements OnInit {
  email: any;
  public documentId = null;
  public currentStatus = 1;
  public newTareaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    detalle: new FormControl(''),
    usuario: new FormControl(''),
  });

  closed = true;
  closed2 = true;

  constructor(private mainService: MainService, private auth: AuthenticationService, private router: Router) {
    this.newTareaForm.setValue({
      nombre: '',
      fecha: '',
      detalle: '',
      usuario: ''
    })
  }
  // Compruebo si tiene acceso(logueado) y recojo su email para mas tarde filtrar
  ngOnInit() {
    this.auth.logeado().subscribe(auth => {
      if (auth) {//Entra si esta logueado
        this.auth.datosUsuario.subscribe(data => {
          this.email = data.email;
        })
      } else {
        this.router.navigateByUrl("/login")
      }
    })
  }

  newTarea(form, documentId = this.documentId) {
    const fechaBuena = new Date(new Date(form.fecha).getTime());
    let data = {
      nombre: form.nombre,
      fecha: fechaBuena,
      detalle: form.detalle,
      usuario: form.usuario,
      email: this.email
    }
    this.mainService.createTarea(data).then(() => {
      this.closed = false;
      this.newTareaForm.setValue({
        nombre: '',
        fecha: '',
        detalle: '',
        usuario: '',
        email: ''
      })
    }, (error) => {
      this.closed2 = false;
      console.log(error);
    })
  }

}

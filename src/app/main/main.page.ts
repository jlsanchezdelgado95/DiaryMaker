import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// Servicios
import { AuthenticationService } from '../servicios/authentication.service'
import { MainService } from '../servicios/main.service'

// Importo Modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  // Modales del mainpage html
  @ViewChild("bienvenida", { static: false }) bienvenida: ElementRef;
  @ViewChild("nuevaTarea", { static: false }) nuevaTarea: ElementRef;
  @ViewChild("deleteModal", { static: false }) deleteTareaRef: ElementRef;
  @ViewChild("despedidaModal", { static: false }) despedidaModalRef: ElementRef;
  @ViewChild("updateModal", { static: false }) updateModalRef: ElementRef;

  public documentId = null;
  public currentStatus = 1;
  correo: any;
  tareas = [];
  anyo = '';
  mes = '';
  dia = '';
  //Variables Tarea
  nombre = '';
  fecha = '';
  detalle = '';
  usuario = '';
  tareaId = '';
  //

  public nuevaTareaFormulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    detalle: new FormControl(''),
    /*usuario: new FormControl(''),*/
    /*id: new FormControl('')*/
  });

  constructor(private router: Router, private auth: AuthenticationService, private modal: NgbModal, private main: MainService) { }

  ngOnInit() {
    // Miro si esta logueado o no, en el onInit por que es al cargar la página
    this.auth.logeado().subscribe(auth => {
      if (auth) {//Entra si esta logueado
        this.modal.open(this.bienvenida)
        this.auth.datosUsuario.subscribe(data => {
          this.correo = data.email;
        })
        this.main.getTareas().subscribe((tareas) => {
          this.tareas = []
          tareas.forEach((tarea: any) => {
            let date = tarea.payload.doc.data().fecha.toDate();
            this.anyo = date.getFullYear();
            this.mes = date.getMonth();
            this.dia = date.getDate();
            let fechaBuena = (this.anyo + "/" + this.mes + "/" + this.dia)
            this.tareas.push({
              nombre: tarea.payload.doc.data().nombre,
              detalle: tarea.payload.doc.data().detalle,
              fecha: fechaBuena,
              id: tarea.payload.doc.id
            })
          })
        })

      } else {
        this.router.navigateByUrl("/login")
      }
    })
  }

  borrarTarea() {
    this.main.deleteTarea(this.tareaId).then(() => {
      console.log("DOCUMENTO ELIMINADO");
      this.modal.dismissAll(this.deleteTareaRef);
    }, error => {
      console.error(error);
    })
  }

  desconectarse() {
    this.auth.salirSesionService();
    this.correo = undefined;
    this.modal.open(this.despedidaModalRef);
    this.router.navigateByUrl("/login");
  }

  openCreate(content) {
    this.modal.open(content);
  }

  open(content, tarea, tareaId) {
    if (tarea === undefined) {
      this.modal.open(content);
    } else {
      this.tareaId = tareaId;
      this.nombre = tarea.nombre;
      this.fecha = tarea.fecha;//no lo coge en el date
      this.detalle = tarea.detalle;
      /*this.usuario = tarea.usuario;*/
      this.modal.open(content);
    }
  }

  newTarea(form, documentId = this.documentId) {
    const fechaBuena = new Date(new Date(form.fecha).getTime());
    let data = {
      nombre: form.nombre,
      fecha: fechaBuena,
      detalle: form.detalle,
      /*usuario: form.usuario*/
    }
    this.main.createTarea(data).then(() => {
      console.log('Documento creado exitósamente!');
      this.modal.dismissAll(this.nuevaTarea);
      this.modal.open(this.nuevaTarea);
      this.nuevaTareaFormulario.setValue({
        nombre: '',
        fecha: '',
        detalle: '',
        /*usuario: ''*/
      });
    }, (error) => {
      console.error(error);
    });

  }

  updateTarea(form, documentId = this.documentId) {
    const fechaBuena = new Date(new Date(form.fecha).getTime());
    let data = {
      nombre: form.nombre,
      fecha: fechaBuena,
      detalle: form.detalle,
      /*usuario: form.usuario*/
    }
    /*console.log(documentId);
    console.log(data);*/
    this.main.updateTarea(this.tareaId, data).then(() => {
      this.currentStatus = 1;
      this.nuevaTareaFormulario.setValue({
        nombre: '',
        fecha: '',
        detalle: '',
        /*usuario: ''*/
      });
      console.log('Documento editado exitósamente');
      this.modal.dismissAll(this.updateTarea);
      this.modal.open(this.updateModalRef);
    }, (error) => {
      console.log(error);
    });
  }

}

import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RamasService } from 'src/app/services/ramas.service';
import { TeachersService } from 'src/app/services/teachers.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-form-perfil-teacher',
  templateUrl: './form-perfil-teacher.component.html',
  styleUrls: ['./form-perfil-teacher.component.css']
})
export class FormPerfilTeacherComponent {

  contador = 0;
  contadorMax = 255;

  // nivelesSeleccionados:string[] = [];

  formRegisterPerfilTeacher: FormGroup;

  @Input() usuarioId: number = 0;

  values: any;
  valuesRamaCo: any;
  valuesEmail: any;

  constructor(
    private teachersService: TeachersService,
    private ramasService: RamasService,
    private router: Router
  ) {

    this.formRegisterPerfilTeacher = new FormGroup({
      materia_id: new FormControl("",[
        Validators.required
      ]),
      nivel_id: new FormControl("",[
        Validators.required
      ]),
      cuota: new FormControl("",[
        Validators.required
      ]),
      experiencia: new FormControl("",[
        Validators.required
      ]),
      status: new FormControl("",[])
    },[])
  }

  checkControl(pControlName: string, pError: string): boolean {
    if(this.formRegisterPerfilTeacher.get(pControlName)?.hasError(pError) && this.formRegisterPerfilTeacher.get(pControlName)?.touched) {
      return true;
    }
    return false;
  }

  onKey($event: any) {
    this.contador = $event.target.value.length;
    if(this.contador >= this.contadorMax) {
      $event.preventDefault();

    }
  }

  async getDataPerfilTeacher() {

    // this.formRegisterPerfilTeacher.value.nivel = this.nivelesSeleccionados.toString();

    this.formRegisterPerfilTeacher.value.usuario_id = this.usuarioId;

    const { materia_id, nivel_id, cuota, experiencia, usuario_id } = this.formRegisterPerfilTeacher.value;

    this.values = { cuota, experiencia, usuario_id }
    this.valuesRamaCo = { usuario_id, materia_id, nivel_id }
    this.valuesEmail = { "destinatario": environment.correo_admin, "asunto": `Nuevo registro Profesor ${usuario_id}`, "cuerpo": `Se ha registrado el profesor con identificación ${usuario_id} quedando pendiente de validación` }

    try {
      const response = await this.teachersService.registroProfesor(this.values);

      if (!response.usuario_id) {
        alert(response.fatal);
        return alert('Registro de datos de perfil Profesor erroneo')
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const responseRamaCo = await this.ramasService.registroRamasCo(this.valuesRamaCo);

      // console.log(responseArea)
      if (!responseRamaCo.insertId) {
        alert(responseRamaCo.fatal);
        return alert('Registro de datos de perfil Ramas erroneo')
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const sendEmail = await this.teachersService.envioEmail(this.valuesEmail);

      console.log(sendEmail);
      // if (!responseNivel.insertId) {
      //   alert(responseNivel.fatal);
      //   return alert('Registro de datos de perfil Niveles erroneo')
      // }

    } catch (error) {
      console.log(error)
    }
    this.router.navigate([`/teacherprofile/${this.usuarioId}`]);
  }
}


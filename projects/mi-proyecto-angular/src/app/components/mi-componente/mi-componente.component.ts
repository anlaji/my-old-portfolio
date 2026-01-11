import { Component } from '@angular/core';
//Decorador, json con selector y template o templateUrl
@Component({
  selector: 'mi-componente',
  templateUrl: './mi-componente.component.html',
})
export class MiComponente {
  public titulo: string;
  public comentario: string;
  public year: number;

  constructor() {
    this.titulo = 'Hola Mundo, soy mi Componente';
    this.comentario = 'Este es mi primer componente';
    this.year = 2023;
    console.log('Mi componente ha cargado ' + this.year);
  }
}

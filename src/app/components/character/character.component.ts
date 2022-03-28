import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { CharacterModel, ResultModel } from 'src/app/core/models/character.model';
import { RickAndMortyService } from 'src/app/shared/services/rick-and-morty-api/rick-and-morty.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  characters: ResultModel[];
  character: ResultModel;
  prueba: string;

  constructor(private readonly characterService: RickAndMortyService) { }

  ngOnInit(): void {
    this.callServices();
  }

  callServices(): void{
    this.getObservableGetCharacters().pipe(
      mergeMap( (characters: CharacterModel) =>
      this.getObservableCharacter(characters.results[0].id))
    ).subscribe();
  }

  getObservableGetCharacters(): Observable<CharacterModel> {
    return this.characterService.getAllCharacters().pipe(
      tap((characters: CharacterModel) => {
        console.log('Executing character service ...', characters);
        this.characters = [...characters.results];
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Executing error...', error);
        alert('Error al consumir el servicio');
        return throwError(error);
      })
    );
  }

  getObservableCharacter(id: number): Observable<ResultModel> {
    return this.characterService.getCharacter(id).pipe(
      tap( (character: ResultModel) => {
        console.log('Executing alone Character...', character);
      }),
      catchError( (error: HttpErrorResponse) => {
        console.log('Executing error alone character...', error);
        return throwError(error);
      })
    );
  }
}

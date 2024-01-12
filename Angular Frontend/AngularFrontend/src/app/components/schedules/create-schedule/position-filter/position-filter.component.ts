import { Component, Input, Output, EventEmitter, ComponentRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-position-filter',
  templateUrl: './position-filter.component.html',
  styleUrls: ['./position-filter.component.css']
})
export class PositionFilterComponent {

  constructor(private _formBuilder: FormBuilder) {}

  @Input() position: any;
  @Input() color: any;
  @Input() positionFilters: any;
  @Input() colorSelection: any;
  @Output() changeColorRequest = new EventEmitter<{position: string, oldColor: string, newColor: string}>();
  @Output() filter = new EventEmitter();

  colorSelectionFiltered: string[] = [];
  currentColor: string = '';

  ngOnInit(): void {
    this.currentColor = this.color;
    /*
    this.colorSelectionFiltered = this.colorSelection.filter((color: string) =>
      color != this.currentColor
    );
    */
  }

  public changeColorToggle: boolean = false;
  emitColorChange(newColor: string){
    this.changeColorRequest.emit({
      position: this.position,
      oldColor: this.color,
      newColor: newColor
    });
  }

  emitFilterChange(){
    this.filter.emit();
  }

  //console.log("Position filter color: " + color);
  //testColor: string = '';
  //testColor = this.color;
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { CreateSupervisorComponent } from './create-supervisor.component';

@Component({
  selector: 'training-status-view',
  template: `
    <div>
      <button class='mybtn' title='Approve' *ngIf="rowData.trStatus == 0" (click)="employeeAction(1)">
        <i class="fa fa-check" aria-hidden="true"></i>
      </button>
      <button class='mybtn' title='Reject' *ngIf="rowData.trStatus == 0" (click)="employeeAction(2)">
        <i class="fa fa-ban" aria-hidden="true"></i>
      </button>
    </div>
  `,
  // template: `
  //   <div>
  //     <button class='mybtn' *ngIf="rowData.trStatus == 0 || rowData.trStatus == 2" (click)="employeeAction(1)">
  //       Approve
  //     </button>
  //     <button class='mybtn' *ngIf="rowData.trStatus == 0 || rowData.trStatus == 1" (click)="employeeAction(2)">
  //       Reject
  //     </button>
  //   </div>
  // `,
  styleUrls: ['./create-supervisor.component.css']
})
export class TrainingStatusComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private supComp : CreateSupervisorComponent){}

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  employeeAction(action){
    this.supComp.actionOnSupervisorTraining(this.rowData, action)
  }
}
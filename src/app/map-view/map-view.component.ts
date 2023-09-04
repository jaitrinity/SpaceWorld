import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  zoom = 5;
  lat = 23.5120;
  lng = 80.3290;
  spoiAlarmList = [];
  iProAlarmList = [];
  markers = [
    {
        iconUrl: "./assets/img/ok.png",
        lat: 21.1594627,
        lng: 72.6822083,
        label: '<h1>Surat</h1>',
        // draggable: false,
        animation: 'DROP'
    },
    {
        lat: 23.0204978,
        lng: 72.4396548,
        label: 'Ahmedabad',
        // draggable: false,
        animation: 'BOUNCE'
    },
    {
        lat: 22.2736308,
        lng: 70.7512555,
        label: 'Rajkot'
    }
  ];
  spoiAlarmCount = 0;
  iProAlarmCount = 0;
  loginEmpId = "";
  loginEmpRole = "";
  loginEmpRoleId = "";
  alertFadeoutTime = 0;
  tenentId = "";
  alarmRecall = 0; // in second
  constructor(private sharedService : SharedService,
    private layoutComponent : LayoutComponent,
    private datePipe : DatePipe) { 
    this.loginEmpId = localStorage.getItem("empId");
    this.loginEmpRole = localStorage.getItem("loginEmpRole");
    this.loginEmpRoleId = localStorage.getItem("empRoleId");
    this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
    this.tenentId = localStorage.getItem("tenentId");
    this.layoutComponent.setPageTitle("Alarm");
    this.alarmRecall = 60;
  }

  ngOnInit(): void {
    this.getAlarmList();
    // setInterval(()=>{
    //   if(this.alarmRecall != 0){
    //     let hh = this.datePipe.transform(new Date(),'HH');
    //     let hours = parseInt(hh);
    //     if(hours >= 8 && hours <= 20){
    //       this.getAlarmList();
    //     }
    //     // 
    //   }
    // },this.alarmRecall * 1000)
  }

  getAlarmList(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId,
      tenentId : this.tenentId
    }

    this.sharedService.getAllListBySelectType(jsonData,"alarmList")
    .subscribe(
      (result)=>{
        this.markers = result.markersList;
        this.spoiAlarmCount = result.spoiAlarmCount;
        this.iProAlarmCount = result.iProAlarmCount;
        // this.lat = result.zoomLat;
        // this.lng = result.zoomLng;
        this.spoiAlarmList = result.spoiAlarmList;
        this.iProAlarmList = result.iProAlarmList;
      },
      (error)=>{

      }
    )
  }

  previous
  clickedMarker(infowindow,index){
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  openedWindow : number = 0; // alternative: array of numbers

  openWindow(id) {
    this.zoom = 13;
    this.openedWindow = id; // alternative: push to array of numbers
  }

  isInfoWindowOpen(id) {
      return this.openedWindow == id; // alternative: check if id is in array
  }

}

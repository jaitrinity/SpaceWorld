import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';
declare var $: any;

@Component({
  selector: 'app-raise-sr',
  templateUrl: './raise-sr.component.html',
  styleUrls: ['./raise-sr.component.scss']
})
export class RaiseSrComponent implements OnInit {

  siteSurveyCheckpoint = [];
  alertFadeoutTime = 0;
  loginEmpId = "";
  loginEmpRole = "";
  tenentId = "";
  button = "";
  color1 = "";
  color2 = "";
  todayDate = "";
  constructor(private sharedService : SharedService, private datePipe : DatePipe,
    private toastr: ToastrService,private layoutComponent : LayoutComponent) { 
    this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
    this.loginEmpId = localStorage.getItem("empId");
    this.loginEmpRole = localStorage.getItem("loginEmpRole");
    this.tenentId = localStorage.getItem("tenentId");
    this.button = localStorage.getItem("button");
    this.color1 = localStorage.getItem("color1");
    this.color2 = localStorage.getItem("color2");
    this.layoutComponent.setPageTitle("Raise SR");
  }

  ngOnInit(): void {
    this.todayDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    this.getSiteSurveyCheckpoint();
  }

  getSiteSurveyCheckpoint(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId
    }
    this.sharedService.getAllListBySelectType(jsonData, "siteSurveyCheckpoint")
    .subscribe(
      (result)=>{
        this.siteSurveyCheckpoint = result.siteSurveyCheckpoint;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("getSiteSurveyCheckpoint"),"Alert !",{timeOut : this.alertFadeoutTime});
      }
    )
  }

  saveData = [];
  validateData () : any{
    this.saveData = []
    for(let i=0;i<this.siteSurveyCheckpoint.length;i++){
      let cpId = this.siteSurveyCheckpoint[i].chkpId;
      let cpDesc = this.siteSurveyCheckpoint[i].description;
      let o = $("#cp_"+cpId);
      if(o.val().trim() == ""){
        alert("Please fill data for "+cpDesc);
        return false;
      }
      else{
        let data = {
          chpId : cpId,
          value : o.val().trim()
        }
        this.saveData.push(data);
      }
    }
    return true;
  }
  submitSiteSurvey(){
    if(!this.validateData()){
      return;
    }
    let jsonData = {
      loginEmpId : this.loginEmpId,
      tenentId : this.tenentId,
      saveData : this.saveData
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "submitSiteSurvey")
    .subscribe(
      (result)=>{
        if(result.status){
          $(".forBlank").val("");
          $(".forBlankSelect").val(" ");
          this.saveData = [];
          this.toastr.success("Successfully inserted");
        }
        else{
          this.toastr.warning(result.message,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("submitSiteSurvey"),"Alert !",{timeOut : this.alertFadeoutTime});
        this.layoutComponent.ShowLoading = false;
      }
    )
  }

}

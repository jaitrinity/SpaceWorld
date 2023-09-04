import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs-compat/operator/map';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';
import { SupervisorTableSetting } from '../shared/tableSettings/SupervisorTableSetting';
import { SupervisorTraining } from '../shared/tableSettings/SupervisorTraining';
declare var $: any;
@Component({
  selector: 'app-create-supervisor',
  templateUrl: './create-supervisor.component.html',
  styleUrls: ['./create-supervisor.component.css']
})
export class CreateSupervisorComponent implements OnInit {

  supervisorTableSettings = SupervisorTableSetting.setting;
  supervisorTraining = SupervisorTraining.setting;
  supervisorName : any = "";
  mobile : any = "";
  whatsappNumber : any = "";
  aadharNumber : any = "";
  supervisorList = [];
  supervisorTrainingList = [];
  tenentId = "";
  loginEmpId = "";
  loginEmpRole = "";
  loginEmpRoleId = "";
  rmId = "";
  alertFadeoutTime = 0;
  rejectReason = "";
  button = "";
  color1 = "";
  color2 = "";
  ii = 1;
  trainingRowArr = [1];
  supTraDesc = ""
  trainingTypeList = [];
  constructor(private router: Router,private sharedService : SharedService,
    private toastr: ToastrService, private layoutComponent : LayoutComponent) {
      this.loginEmpId = localStorage.getItem("empId");
      this.loginEmpRole = localStorage.getItem("loginEmpRole");
      this.loginEmpRoleId = localStorage.getItem("empRoleId");
      this.rmId = localStorage.getItem("rmId");
      this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
      this.tenentId = localStorage.getItem("tenentId");
      this.button = localStorage.getItem("button");
      this.color1 = localStorage.getItem("color1");
      this.color2 = localStorage.getItem("color2");
      this.layoutComponent.setPageTitle("Create supervisor");
    }

  trTypeCombo = 0;
  ngOnInit(): void {
    setTimeout(() => {
      $("ng2-smart-table thead").css('background-color',this.color1);
    }, 100);
    
    this.getAllSupervisorList();
    if(this.loginEmpRoleId == "50")
      this.getSupervisorTrainingList();
    else
      this.getTrainingTypeList();
  }

  getTrainingTypeList(){
    this.trainingTypeList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId,
    }
    this.sharedService.getAllListBySelectType(jsonData, 'trainingType')
    .subscribe((response) =>{
      this.supTraDesc = response.supTraDesc;
      this.trainingTypeList = response.trainingTypeList;
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getSupervisorTrainingList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  getSupervisorTrainingList(){
    this.supervisorTrainingList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      rmId : this.rmId,
      tenentId : this.tenentId,
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData, 'supervisorTraining')
    .subscribe((response) =>{
      this.supervisorTrainingList = response.supervisorTrainingList;
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getSupervisorTrainingList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
    
  }

  getAllSupervisorList(){
    this.supervisorList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      rmId : this.rmId,
      tenentId : this.tenentId,
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.getAllListBySelectType(jsonData, 'supervisor_new')
    .subscribe((response) =>{
      this.supervisorList = response.supervisorList;
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("getAllSupervisorList"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }
  
  

  trainingList = [];
  validateTrainingData() : any{
    this.trainingList = [];
    for(let i=0;i<this.trainingRowArr.length;i++){
      let r = this.trainingRowArr[i];
      let trType = $("#tr-type-"+r).val();
      let trCompanyName = $("#tr-company-name-"+r).val();
      let trIdNo = $("#tr-id-no-"+r).val();
      let trMode = $("#tr-mode-"+r).val();
      let trGivenBy = $("#tr-given-by-"+r).val();
      let trDate = $("#tr-date-"+r).val();
      let trExDate = $("#tr-ex-date-"+r).val();
      let trPic = $("#hidden-tr-pic-"+r).val();
      let trTypeCombo = $("#trTypeCombo"+r).val();
      if(trType != ""){
        if(trTypeCombo == "1"){
          if(trCompanyName == "" || trIdNo == "" || trPic == "" || trDate == "" || trExDate == ""){
            alert("Must have value of `Company Name`, `Training Id No`, `External Certification / Training Snaps`, `Date of Training` and `Expire date of Training` of "+r+" training")
            return false;
          }
          else{
            let json = {
              trType: trType,
              trCompanyName: trCompanyName,
              trIdNo: trIdNo,
              trMode: '',
              trGivenBy:'',
              trDate: trDate,
              trExDate: trExDate,
              trPic: trPic,
              trTypeCombo :trTypeCombo
            }
            this.trainingList.push(json);
          }
        }
        else if(trTypeCombo == "2"){
          if(trCompanyName == "" || trDate == "" || trGivenBy == "" || trMode == ""){
            alert("Must have value of `Company Name`, `Date of Training`, `Training given by` and `Mode of training` of "+r+" training")
            return false;
          }
          else{
            let json = {
              trType: trType,
              trCompanyName: trCompanyName,
              trIdNo: '',
              trMode: trMode,
              trGivenBy: trGivenBy,
              trDate: trDate,
              trExDate: '',
              trPic: trPic,
              trTypeCombo: trTypeCombo
            }
            this.trainingList.push(json);
          }
        }
        else if(trTypeCombo == "3"){
          if(trCompanyName == "" || trDate == ""){
            alert("Must have value of `Company Name` and `Date of Training` of "+r+" training")
            return false;
          }
          else{
            let json = {
              trType: trType,
              trCompanyName: trCompanyName,
              trIdNo: '',
              trMode: '',
              trGivenBy: '',
              trDate: trDate,
              trExDate: '',
              trPic: trPic,
              trTypeCombo: trTypeCombo
            }
            this.trainingList.push(json);
          }
        }
      }
    }

    return true;
  } 

  submitSupervisorData(){
    if(this.supervisorName == ""){
      this.toastr.warning("please enter name value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.mobile == ""){
      this.toastr.warning("please enter mobile value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.mobile.length != 10){
      this.toastr.warning("mobile length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.whatsappNumber == ""){
      this.toastr.warning("please enter whatsappNumber value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.whatsappNumber.length != 10){
      this.toastr.warning("whatsappNumber length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.aadharNumber == ""){
      this.toastr.warning("please enter aadharNumber value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.aadharNumber.length != 12){
      this.toastr.warning("aadharNumber length should be 12 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(!this.validateTrainingData()){
      return;
    }

    let jsonData = {
      loginEmpId : this.loginEmpId,
      employeeName : this.supervisorName,
      mobile : this.mobile,
      whatsappNumber : this.whatsappNumber,
      aadharNumber : this.aadharNumber,
      tenentId : this.tenentId,
      trainingList : this.trainingList
    }
    // console.log(JSON.stringify(jsonData));
    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "supervisor_new")
    // this.sharedService.insertDataByInsertType(jsonData, "supervisor")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultAllField();
        this.getAllSupervisorList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("submitSupervisorData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  onCustomAction(event){
    switch ( event.action) {
      case 'editrecord':
        this.editSupervisor(event);
        break;
      case 'activerecord':
        this.actionOnSupervisor(event,1);
        break;
      case 'deactiverecord':
        this.actionOnSupervisor(event,0);
        break;
      case 'approveRecord':
        this.actionOnSupervisorTraining(event,1);
        break;
      case 'rejectRecord':
        this.actionOnSupervisorTraining(event,2);
        break;
    }
  }

  supTrId = 0;
  actionOnSupervisorTraining(event,action){
    // console.log(event);
    this.supTrId = event.id;
    if(action == 2){
      $("#rejectModal").modal({
        backdrop : 'static',
        keyboard : false
      });
    }
    else{
      let isConfirm = confirm("Do you want to Approve this?");
      if(isConfirm){
        let jsonData = {
          loginEmpId : this.loginEmpId,
          id : this.supTrId,
          action : action
        }
        this.layoutComponent.ShowLoading = true;
        this.sharedService.updateDataByUpdateType(jsonData,"SupervisorTraining")
        .subscribe((response) =>{
          if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
            this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
            this.getSupervisorTrainingList();
          }
          else{
            this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          }
          this.layoutComponent.ShowLoading = false;
          
        },
        (error)=>{
          this.toastr.warning(Constant.returnServerErrorMessage("actionOnSupervisor"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
          this.layoutComponent.ShowLoading = false;
        });
      }
    }
    
  }

  rejectTraining(action){
    if(this.rejectReason == ""){
      this.toastr.warning("Please enter reason","Alert !",{timeOut : this.alertFadeoutTime});
      return;
    }
    let isConfirm = confirm("Do you want to Reject this?");
    if(isConfirm){
      let jsonData = {
        loginEmpId : this.loginEmpId,
        id : this.supTrId,
        action : action,
        rejectReason : this.rejectReason
      }
      this.layoutComponent.ShowLoading = true;
      this.sharedService.updateDataByUpdateType(jsonData,"SupervisorTraining")
      .subscribe((response) =>{
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          this.getSupervisorTrainingList();
          this.rejectReason = '';
          this.closeAnyModal("rejectModal");
        }
        else{
          this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
        
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("actionOnSupervisor"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      });
    }
  }

  actionOnSupervisor(event,action){
    let actionType = action == 1 ? "Activate" : "Deactivate";
    let isConfirm = confirm("Do you want to "+actionType+" this?");
    if(isConfirm){
      let id = event.data.id;
      let jsonData = {
        loginEmpId : this.loginEmpId,
        id : id,
        action : action
      }
      this.layoutComponent.ShowLoading = true;
      this.sharedService.updateDataByUpdateType(jsonData,"employee")
      .subscribe((response) =>{
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          this.getAllSupervisorList();
        }
        else{
          this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
        
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("actionOnSupervisor"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      });
    }
  }

  isDoAnyChange : boolean = false;
  editId = "";
  editSupervisorName = "";
  editMobile = "";
  editWhatsappNumber = "";
  editAadharNumber = "";
  viewTrainingList = [];
  viewEmpId = "";
  editEvent : any;
  editSupervisor(event){
    this.editEvent = event;
    this.viewTrainingList = []
    this.isDoAnyChange = false;
    this.editId = event.data.id;
    this.viewEmpId = event.data.empId;
    this.editSupervisorName = event.data.name;
    this.editMobile = event.data.mobile;
    this.editWhatsappNumber = event.data.whatsapp;
    this.editAadharNumber = event.data.aadharCard;
    this.viewTrainingList = event.data.trainingList;

    $("#editSuperviorModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  updateSupervisorData(){
    
    if(this.editSupervisorName == ""){
      this.toastr.warning("please enter name value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editMobile == ""){
      this.toastr.warning("please enter mobile value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editMobile.length != 10){
      this.toastr.warning("mobile length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editWhatsappNumber == ""){
      this.toastr.warning("please enter whatsappNumber value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editWhatsappNumber.length != 10){
      this.toastr.warning("whatsappNumber length should be 10 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editAadharNumber == ""){
      this.toastr.warning("please enter aadharNumber value","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }
    else if(this.editAadharNumber.length != 12){
      this.toastr.warning("aadharNumber length should be 12 digit","Alert !",{timeOut : this.alertFadeoutTime});
      return ;
    }

    let jsonData = {
      loginEmpId : this.loginEmpId,
      id : this.editId,
      employeeName : this.editSupervisorName,
      mobile : this.editMobile,
      whatsappNumber : this.editWhatsappNumber,
      aadharNumber : this.editAadharNumber,
      tenentId : this.tenentId
    }
    this.layoutComponent.ShowLoading = true;
    this.sharedService.updateDataByUpdateType(jsonData, "updateSupervisor")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultAllField();
        this.closeAnyModal("editSuperviorModal");
        this.getAllSupervisorList();
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("updateSupervisorData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  setDefaultAllField(){
    this.supervisorName = "";
    this.mobile = "";
    this.whatsappNumber = "";
    this.aadharNumber = "";
    this.isDoAnyChange = false; 
    this.editSupervisorName = "";
    this.editMobile = "";
    this.editWhatsappNumber = "";
    this.editAadharNumber = "";
    this.trainingList = [];
    $(".forBlank").val("");
    this.trainingRowArr = [1];
    this.ii = 1;
  }

  exportData(reportType : any){
    var time = new Date();
    let millisecond = Math.round(time.getTime()/1000);

    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      rmId : this.rmId,
      reportType : reportType,
      millisecond : millisecond
    }
    window.open(Constant.phpServiceURL+'downloadReport.php?jsonData='+JSON.stringify(jsonData));
  }

  closeAnyModal(modalName){
    $("#"+modalName).modal("hide");
  }

  changeSelected(e){
    $("#createSuperviorModal").modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  changeListener($event, i): void {
    this.readThis($event.target, i);
  }

  readThis(inputValue: any, optionNumber): void {
    var file: File = inputValue.files[0];
    let wrongFile = false;
    let fileName = file.name;
    let fileSize = file.size; // 
    if(!(fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1 || fileName.indexOf(".png") > -1)
    || fileSize/1024 > 100){
      this.toastr.warning("only .jpg, .jpeg, .png format accepted and image size should be less than from 100 KB, please choose right file.","Alert !");
      wrongFile = true;
    }
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      let image = myReader.result;
      $("#hidden-tr-pic-"+optionNumber).val(image);
      $("#hidden-tr-pic-more-"+optionNumber).val(image);
      if(wrongFile){
        $("#hidden-tr-pic-"+optionNumber).val("");
        $("#tr-pic-"+optionNumber).val("");
        $("#hidden-tr-pic-more-"+optionNumber).val("");
        $("#tr-pic-more-"+optionNumber).val("");
      }
    }
    myReader.readAsDataURL(file);
  }

  bigImg(imgURL){
    let myWin = window.open("","");
    myWin.document.write("<img src = '"+imgURL+"'>");
  }

  openAnyModal(modalId){
    $("#"+modalId).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  validateMoreTrainingData() : any{
    this.trainingList = [];
    for(let i=0;i<this.trainingRowArr.length;i++){
      let r = this.trainingRowArr[i];
      let trType = $("#tr-type-more-"+r).val();
      let trDate = $("#tr-date-more-"+r).val();
      let trExDate = $("#tr-ex-date-more-"+r).val();
      let trPic = $("#hidden-tr-pic-more-"+r).val();

      let trCompanyName = $("#tr-company-name-more-"+r).val();
      let trIdNo = $("#tr-id-no-more-"+r).val();
      let trMode = $("#tr-mode-more-"+r).val();
      let trGivenBy = $("#tr-given-by-more-"+r).val();
      let trTypeCombo = $("#trTypeComboMore"+r).val();
      if(trType != ""){
        if(trTypeCombo == "1"){
          if(trCompanyName == "" || trIdNo == "" || trPic == "" || trDate == "" || trExDate == ""){
            alert("Must have value of `Company Name`, `Training Id No`, `External Certification / Training Snaps`, `Date of Training` and `Expire date of Training` of "+r+" training")
            return false;
          }
          else{
            let json = {
              trType: trType,
              trCompanyName: trCompanyName,
              trIdNo: trIdNo,
              trMode: '',
              trGivenBy:'',
              trDate: trDate,
              trExDate: trExDate,
              trPic: trPic,
              trTypeCombo :trTypeCombo
            }
            this.trainingList.push(json);
          }
        }
        else if(trTypeCombo == "2"){
          if(trCompanyName == "" || trDate == "" || trGivenBy == "" || trMode == ""){
            alert("Must have value of `Company Name`, `Date of Training`, `Training given by` and `Mode of training` of "+r+" training")
            return false;
          }
          else{
            let json = {
              trType: trType,
              trCompanyName: trCompanyName,
              trIdNo: '',
              trMode: trMode,
              trGivenBy: trGivenBy,
              trDate: trDate,
              trExDate: '',
              trPic: trPic,
              trTypeCombo: trTypeCombo
            }
            this.trainingList.push(json);
          }
        }
        else if(trTypeCombo == "3"){
          if(trCompanyName == "" || trDate == ""){
            alert("Must have value of `Company Name` and `Date of Training` of "+r+" training")
            return false;
          }
          else{
            let json = {
              trType: trType,
              trCompanyName: trCompanyName,
              trIdNo: '',
              trMode: '',
              trGivenBy: '',
              trDate: trDate,
              trExDate: '',
              trPic: trPic,
              trTypeCombo: trTypeCombo
            }
            this.trainingList.push(json);
          }
        }
      }
    }

    return true;
  }

  addTrainingData(){
    if(!this.validateMoreTrainingData()){
      return ;
    }
    let jsonData = {
      loginEmpId : this.loginEmpId,
      empId : this.viewEmpId,
      trainingList : this.trainingList
    }

    this.layoutComponent.ShowLoading = true;
    this.sharedService.insertDataByInsertType(jsonData, "addTraining")
    .subscribe((response) =>{
      if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
        this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        this.setDefaultAllField();
        this.getAllSupervisorList();
        this.closeAnyModal("addTrainingModal");
        setTimeout(() => {
          let obj = this.supervisorList.find(x => x.empId == this.viewEmpId);
          this.editSupervisorName = obj.name;
          this.editMobile = obj.mobile;
          this.editWhatsappNumber = obj.whatsapp;
          this.editAadharNumber = obj.aadharCard;
          this.viewTrainingList = obj.trainingList;
        }, 100);
      }
      else{
        this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
      }
      this.layoutComponent.ShowLoading = false;
      
    },
    (error)=>{
      this.toastr.warning(Constant.returnServerErrorMessage("addTrainingData"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
      this.layoutComponent.ShowLoading = false;
    });
  }

  deleteTraining(id : any, trType : any){
    let isConfirm = confirm("Do you want delete this "+trType+" training.");
    if(isConfirm){
      let jsonData = {
        loginEmpId : this.loginEmpId,
        id : id,
        empId : this.viewEmpId
      }

      this.layoutComponent.ShowLoading = true;
      this.sharedService.updateDataByUpdateType(jsonData,"deleteTraining")
      .subscribe((response) =>{
        if(response.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.toastr.success(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
          this.getAllSupervisorList();
          setTimeout(() => {
            let obj = this.supervisorList.find(x => x.empId == this.viewEmpId);
            this.viewTrainingList = obj.trainingList;
          }, 100);
        }
        else{
          this.toastr.warning(response.responseDesc,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
        
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("deleteTraining"),"Alert !",{timeOut : Constant.TOSTER_FADEOUT_TIME});
        this.layoutComponent.ShowLoading = false;
      });
    }
  }

  changeTrainingType(srId, type){
    if(type == 1){
      this.trTypeCombo = 0;
      $(".trCompanyName"+srId+", .trIdNo"+srId+", .trMode"+srId+", .trGivenBy"+srId+", .trDate"+srId+", .trExDate"+srId+", .trPic"+srId).hide();
      $("._trCompanyName"+srId+", ._trIdNo"+srId+", ._trMode"+srId+", ._trGivenBy"+srId+", ._trDate"+srId+", ._trExDate"+srId+", ._trPic"+srId).hide();
      let value = $("#tr-type-"+srId).find(":selected").val();
      if(value == 'H-STAC-By External' || value == 'H-STAC-By Internal' || value == 'E-STAC-By External' || 
      value == 'E-STAC-BY Internal' || value == 'Other Height' || value == 'Other Electrical'){
        $(".trCompanyName"+srId+", .trIdNo"+srId+", .trPic"+srId+", .trDate"+srId+", .trExDate"+srId).show();
        $("._trCompanyName"+srId+", ._trIdNo"+srId+", ._trPic"+srId+", ._trDate"+srId+", ._trExDate"+srId).show();
        this.trTypeCombo = 1;
      }
      else if(value == 'HILTI -Chemical anchor' || value == 'Pole Erection' || 
      value == 'Safety Incidence Reporting' || value == 'Other Electrical' || value == 'Safety Habits' || 
      value == 'LOTO-Lock out Tag out'){
        $(".trCompanyName"+srId+", .trDate"+srId+", .trGivenBy"+srId+", .trMode"+srId+", .trPic"+srId).show();
        $("._trCompanyName"+srId+", ._trDate"+srId+", ._trGivenBy"+srId+", ._trMode"+srId).show();
        this.trTypeCombo = 2;
      }
      else if(value == 'Pole Erection animation video seen'){
        $(".trCompanyName"+srId+", .trDate"+srId+", .trPic"+srId).show();
        $("._trCompanyName"+srId+", ._trDate"+srId).show();
        this.trTypeCombo = 3;
      }
      $("#trTypeCombo"+srId).val(this.trTypeCombo);
    }
    // More
    else{
      this.trTypeCombo = 0;
      $(".trCompanyNameMore"+srId+", .trIdNoMore"+srId+", .trModeMore"+srId+", .trGivenByMore"+srId+", .trDateMore"+srId+", .trExDateMore"+srId+", .trPicMore"+srId).hide();
      $("._trCompanyNameMore"+srId+", ._trIdNoMore"+srId+", ._trModeMore"+srId+", ._trGivenByMore"+srId+", ._trDateMore"+srId+", ._trExDateMore"+srId+", ._trPicMore"+srId).hide();
      let value = $("#tr-type-more-"+srId).find(":selected").val();
      if(value == 'H-STAC-By External' || value == 'H-STAC-By Internal' || value == 'E-STAC-By External' || 
      value == 'E-STAC-BY Internal' || value == 'Other Height' || value == 'Other Electrical'){
        $(".trCompanyNameMore"+srId+", .trIdNoMore"+srId+", .trPicMore"+srId+", .trDateMore"+srId+", .trExDateMore"+srId).show();
        $("._trCompanyNameMore"+srId+", ._trIdNoMore"+srId+", ._trPicMore"+srId+", ._trDateMore"+srId+", ._trExDateMore"+srId).show();
        this.trTypeCombo = 1;
      }
      else if(value == 'HILTI -Chemical anchor' || value == 'Pole Erection'|| 
      value == 'Safety Incidence Reporting' || value == 'Other Electrical' || value == 'Safety Habits' || 
        value == 'LOTO-Lock out Tag out'){
        $(".trCompanyNameMore"+srId+", .trDateMore"+srId+", .trGivenByMore"+srId+", .trModeMore"+srId+", .trPicMore"+srId).show();
        $("._trCompanyNameMore"+srId+", ._trDateMore"+srId+", ._trGivenByMore"+srId+", ._trModeMore"+srId).show();
        this.trTypeCombo = 2;
      }
      else if(value == 'Pole Erection animation video seen'){
        $(".trCompanyNameMore"+srId+", .trDateMore"+srId+", .trPicMore"+srId).show();
        $(".trCompanyNameMore"+srId+", .trDateMore"+srId).show();
        this.trTypeCombo = 3;
      }
      $("#trTypeComboMore"+srId).val(this.trTypeCombo);
    }
    
  }

  addMore(){
    this.ii++;
    this.trainingRowArr.push(this.ii);
  }
  delMore(row){
    if(this.trainingRowArr.length != 1){
      const index = this.trainingRowArr.indexOf(row);
      if (index > -1){
        this.trainingRowArr.splice(index,1);
      }
      
    }
  }

}

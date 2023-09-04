import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { CommonFunction } from '../shared/service/CommonFunction';
import { SharedService } from '../shared/service/SharedService';
declare var $: any;

@Component({
  selector: 'app-raise-ptw',
  templateUrl: './raise-ptw.component.html',
  styleUrls: ['./raise-ptw.component.scss']
})
export class RaisePtwComponent implements OnInit {
  circleList = [];
  selectedCircleList = [];
  siteTypeList = [];
  selectedSiteTypeList = [];
  siteIdNameList = [];
  selectedSiteIdNameList = [];
  supervisorList = [];
  ptwType = "";
  ptwTypeList = [];
  heightActivity ="";
  heightActivityList = [];

  electricalActivity = "";
  electricalActivityList = [];
  
  matHandlingActivity = "";
  matHandlingActivityList = [];
  
  ofcRouteActivity = "";
  ofcRouteActivityList = [];
  
  confinedActivity = "";
  confinedActivityList = [];
  
  hotWorkActivity = "";
  hotWorkActivityList = [];
  
  siteAccessActivity = "";
  siteAccessActivityList = [];
  descriptionText = "";
  workStartDatetime = "";
  workEndDatetime = "";
  ptwCheckpoint = [];
  alertFadeoutTime = 0;
  loginEmpId = "";
  loginEmpRole = "";
  loginEmpName = "";
  rmId = "";
  loginEmpMobile = "";
  tenentId = "";
  button = "";
  color1 = "";
  color2 = "";
  browser = "";
  ptwRaiseDatetime = "";
  maxDatetime = "";
  todayDate = "";
  todayDatetime = "";
  incDays = 3;
  minuteIn12Hours = 12 * 60;
  supervisorName = "";
  supervisorAadhar = "";
  supervisorMobile = "";
  supervisorWhatsapp = "";
  isPoAvailable = "";
  poNumber = "";
  dateOfPo = "";
  requiredWorkers = "";
  height : boolean = false;
  electrical : boolean = false;
  matHandling : boolean = false;
  ofcRoute : boolean = false;
  confined : boolean = false;
  hotWork : boolean = false
  siteAccess : boolean = false;
  declaration : boolean = false;
  sstReport = "";
  strDrawing = "";
  singleSelectdropdownSettings = {};
  multiSelectdropdownSettings = {};
  constructor(private sharedService : SharedService, private datePipe : DatePipe, 
    private toastr: ToastrService, private layoutComponent : LayoutComponent) {
      this.alertFadeoutTime = Constant.ALERT_FADEOUT_TIME;
      this.loginEmpId = localStorage.getItem("empId");
      this.loginEmpRole = localStorage.getItem("loginEmpRole");
      this.loginEmpName = localStorage.getItem("empName");
      this.rmId = localStorage.getItem("rmId");
      this.loginEmpMobile = localStorage.getItem("empMobile");
      this.tenentId = localStorage.getItem("tenentId");
      this.button = localStorage.getItem("button");
      this.color1 = localStorage.getItem("color1");
      this.color2 = localStorage.getItem("color2");
      this.browser = localStorage.getItem("browser");
      this.layoutComponent.setPageTitle("Raise PTW");
    }

  ngOnInit(): void {
    this.singleSelectdropdownSettings = {
      singleSelection: true,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection : true
    };

    this.multiSelectdropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true
    };
    this.getAllTypeList();
    let currDate = this.addDays(0);
    this.todayDate = this.datePipe.transform(currDate,'yyyy-MM-dd');
    this.todayDatetime = this.datePipe.transform(currDate,'yyyy-MM-dd HH:mm');

    this.ptwRaiseDatetime = this.datePipe.transform(currDate,'yyyy-MM-dd')+"T00:00";
    let futureDate = this.addDays(2);
    this.maxDatetime = this.datePipe.transform(futureDate,'yyyy-MM-dd')+"T00:00";
    // this.getPtwCheckpoint();
    
  }
  onSelectOrDeselectCircle(item){
    this.getSiteNameByCircle();
  }
  getSiteNameByCircle(){
    this.siteIdNameList = [];
    this.selectedSiteIdNameList = [];
    if(this.selectedCircleList.length == 0){
      return;
    }
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId,
      circleName : CommonFunction.createCommaSeprate(this.selectedCircleList)
    }
    this.sharedService.getAllListBySelectType(jsonData, "siteNameByCircle")
    .subscribe(
      (result)=>{
        this.siteIdNameList = result.siteIdNameList;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("getSiteNameByCircle"),"Alert !",{timeOut : this.alertFadeoutTime});
      }
    )
  }

  getAllTypeList(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      rmId : this.rmId,
      tenentId : this.tenentId
    }
    this.sharedService.getAllListBySelectType(jsonData, "allType")
    .subscribe(
      (result)=>{
        this.circleList = result.circleList;
        this.siteTypeList = result.siteTypeList;
        this.supervisorList = result.supervisorList;
        this.ptwTypeList = result.ptwTypeList;
        this.heightActivityList = result.heightActivityList;
        this.electricalActivityList = result.electricalActivityList;
        this.matHandlingActivityList = result.matHandlingActivityList;
        this.ofcRouteActivityList = result.ofcRouteActivityList;
        this.confinedActivityList = result.confinedActivityList;
        this.hotWorkActivityList = result.hotWorkActivityList;
        this.siteAccessActivityList = result.siteAccessActivityList;
        this.descriptionText = result.descriptionText;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("getAllTypeList"),"Alert !",{timeOut : this.alertFadeoutTime});
      }
    )
  }
  addDays(days : number) : Date{
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
  }
  getMinute() : number{
    let sdt = this.workStartDatetime // sdt = Start Date Time
    let edt = this.workEndDatetime; // edt = End Date Time
    var startDatetime = new Date(sdt);
    var endDatetime = new Date(edt);
    var difference = endDatetime.getTime() - startDatetime.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    return resultInMinutes;
  }
  getMinute2(firstDatetime : any, secondDatetime : any) : number{ 
    var fdt = new Date(firstDatetime);
    var sdt = new Date(secondDatetime);
    var difference = fdt.getTime() - sdt.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    return resultInMinutes;
  }
  heightPtwCriteria = "false";
  selectSupervisorName(evt){
    const selectEl = evt.target;
    this.supervisorAadhar = selectEl.options[selectEl.selectedIndex].getAttribute('aadharCard');
    this.supervisorMobile = selectEl.options[selectEl.selectedIndex].getAttribute('mobile');
    this.supervisorWhatsapp = selectEl.options[selectEl.selectedIndex].getAttribute('whatsapp');
    this.heightPtwCriteria = selectEl.options[selectEl.selectedIndex].getAttribute('heightPtwCriteria');
    if(this.ptwType == "Height" && this.heightPtwCriteria == "false"){
      alert("Supervisor("+this.supervisorName+") don’t have certificate then they can’t assign on height PTW");
      setTimeout(() => {
        this.ptwType = "";
        this.height = false;
      }, 100);
    }
  }
  getPtwCheckpoint(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRole : this.loginEmpRole,
      tenentId : this.tenentId
    }
    this.sharedService.getAllListBySelectType(jsonData, "ptwCheckpoint")
    .subscribe(
      (result)=>{
        this.ptwCheckpoint = result.ptwCheckpoint;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("getPtwCheckpoint"),"Alert !",{timeOut : this.alertFadeoutTime});
      }
    )
  }

  selectPtwType(){
    this.height = false; this.electrical = false; this.matHandling = false;
    this.ofcRoute = false; this.confined = false; this.hotWork = false;
    this.siteAccess = false;
    if(this.ptwType == "") alert("Select PTW type");
    else if(this.ptwType == "Height" && this.heightPtwCriteria == "true") this.height = true;
    else if(this.ptwType == "Electrical") this.electrical = true;
    else if(this.ptwType == "Material Handling") this.matHandling = true;
    else if(this.ptwType == "OFC-Route Work") this.ofcRoute = true;
    else if(this.ptwType == "Confined Space Work") this.confined = true;
    else if(this.ptwType == "Hot Work") this.hotWork = true;
    else if(this.ptwType == "Site Access") this.siteAccess = true;
    else{
      alert("Supervisor("+this.supervisorName+") don’t have certificate then they can’t assign on height PTW");
      setTimeout(() => {
        this.ptwType = "";
      }, 100);
      
    }
  }

  alphaOnly (e) {  // Accept only alpha  
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  }

  saveData = [];
  validateData () : any{
    if(this.selectedCircleList.length == 0){
      alert("Please select one circle");
      return false;
    }
    else if(this.selectedSiteIdNameList.length == 0){
      alert("Please select one site name");
      return false;
    }
    else if(this.selectedSiteTypeList.length == 0){
      alert("Please select one site type");
      return false;
    }
    else if(this.workStartDatetime == ""){
      alert("Please select work start datetime");
      return false;
    }
    else if(this.getMinute2(this.workStartDatetime, this.todayDatetime) < 0){
      alert("Start datetime should be greater than current datetime");
      return false;
    }
    else if(this.workEndDatetime == ""){
      alert("Please select work end datetime");
      return false;
    }
    else if(this.getMinute() < 0){
      alert("Start datetime should be less than End datetime");
      return false;
    }
    else if(this.getMinute() > this.minuteIn12Hours){
      alert("Hours between start datetime and end date datetime should be less than or equal to 12 hours");
      return false;
    }
    else if(this.supervisorName == ""){
      alert("please enter supervisor name");
      return false;
    }
    else if(this.supervisorAadhar == ""){
      alert("please enter supervisor Aadhar");
      return false;
    }
    else if(this.supervisorAadhar.length != 12){
      alert("Aadhar should be 12 digit");
      return false;
    }
    else if(this.supervisorMobile == ""){
      alert("please enter supervisor mobile");
      return false;
    }
    else if(this.supervisorMobile.length != 10){
      alert("Mobile should be 10 digit");
      return false;
    }
    else if(this.supervisorWhatsapp == ""){
      alert("please enter supervisor Whatsapp");
      return false;
    }
    else if(this.supervisorWhatsapp.length != 10){
      alert("Whatsapp should be 10 digit");
      return false;
    }
    else if(this.ptwType == ""){
      alert("please select ptw type");
      return false;
    }
    else if(this.isPoAvailable == ""){
      alert("please select is po available");
      return false;
    }
    else if(this.isPoAvailable == "Yes" && this.poNumber == ""){
      alert("please enter po number");
      return false;
    }
    else if(this.isPoAvailable == "Yes" && this.dateOfPo == ""){
      alert("please select date of po");
      return false;
    }
    else if(this.requiredWorkers == ""){
      alert("please select No of workers required to complete the work");
      return false;
    }
    // else if(this.sstReport == ""){
    //   alert("please select `SST Report / Pre built report Available`");
    //   return false;
    // }
    // else if(this.sstReport == "Yes" && this.sstReportBase64 == ""){
    //   alert("please upload `SST Report / Pre built report Available`");
    //   return false;
    // }
    // else if(this.strDrawing == ""){
    //   alert("please select `Structure (Pole) Drawing available`");
    //   return false;
    // }
    // else if(this.strDrawing == "Yes" && this.strDrawingBase64 == ""){
    //   alert("please upload `Structure (Pole) Drawing available`");
    //   return false;
    // }
    else if(!this.declaration){
      alert("please check on declaration");
      return false;
    }
    let height = "";
    if(this.height){
      height = $(".heightActivity").val();
    }
      
    let electrical = "";
    if(this.electrical){
      electrical = $(".electricalActivity").val();
    }

    let matHandling = "";
    if(this.matHandling){
      matHandling = $(".matHandlingActivity").val();
    }

    let ofcRoute = "";
    if(this.ofcRoute){
      ofcRoute = $(".ofcRouteActivity").val();
    }
    
    let confined = "";
    if(this.confined){
      confined = $(".confinedActivity").val();
    }
  
    let hotWork = "";
    if(this.hotWork){
      hotWork = $(".hotWorkActivity").val();
    }

    let siteAccess = "";
    if(this.siteAccess){
      siteAccess = $(".siteAccessActivity").val();
    }
    
    if(height == "" && electrical == "" && matHandling == "" && ofcRoute == "" && confined == "" && 
    hotWork == "" && siteAccess == ""){
      alert("Please select one "+this.ptwType+" activity");
      return false;
    }

    this.saveData = [];
    let data = {
      chpId : 5510,
      value : "a",
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5511,
      value : "b",
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5512,
      value : this.loginEmpName,
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5513,
      value : this.loginEmpMobile,
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5514,
      value : CommonFunction.createCommaSeprate(this.selectedSiteTypeList),
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5515,
      value : CommonFunction.createCommaSeprate(this.selectedCircleList),
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5516,
      value : CommonFunction.createCommaSeprate(this.selectedSiteIdNameList),
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5517,
      value : this.workStartDatetime.replace("T"," "),
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5518,
      value : this.workEndDatetime.replace("T"," "),
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5519,
      value : this.supervisorName,
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5520,
      value : this.supervisorAadhar,
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5521,
      value : this.supervisorMobile,
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5522,
      value : this.supervisorWhatsapp,
      dependent : 0
    }
    this.saveData.push(data);
    data = {
      chpId : 5523,
      value : this.ptwType,
      dependent : 0
    }
    this.saveData.push(data);
    if(height != ""){
      data = {
        chpId : 5527,
        value : height,
        dependent : 5523
      }
      this.saveData.push(data);
    }
    if(electrical != ""){
      data = {
        chpId : 5528,
        value : electrical,
        dependent : 5523
      }
      this.saveData.push(data);
    }
    if(matHandling != ""){
      data = {
        chpId : 5529,
        value : matHandling,
        dependent : 5523
      }
      this.saveData.push(data);
    }
    if(ofcRoute != ""){
      data = {
        chpId : 5530,
        value : ofcRoute,
        dependent : 5523
      }
      this.saveData.push(data);
    }
    if(confined != ""){
      data = {
        chpId : 5531,
        value : confined,
        dependent : 5523
      }
      this.saveData.push(data);
    }
    if(hotWork != ""){
      data = {
        chpId : 5532,
        value : hotWork,
        dependent : 5523
      }
      this.saveData.push(data);
    }
    if(siteAccess != ""){
      data = {
        chpId : 5533,
        value : siteAccess,
        dependent : 5523
      }
      this.saveData.push(data);
    }
    data = {
      chpId : 5524,
      value : this.isPoAvailable,
      dependent : 0
    }
    this.saveData.push(data);
    if(this.isPoAvailable == "Yes"){
      data = {
        chpId : 5534,
        value : this.poNumber,
        dependent : 5524
      }
      this.saveData.push(data);
      data = {
        chpId : 5535,
        value : this.dateOfPo,
        dependent : 5524
      }
      this.saveData.push(data);
    }
    data = {
      chpId : 5525,
      value : this.requiredWorkers,
      dependent : 0
    }
    this.saveData.push(data);

    // SST Report / Pre built report Available
    // data = {
    //   chpId : 5824,
    //   value : this.sstReport,
    //   dependent : 0
    // }
    // this.saveData.push(data);
    // if(this.sstReport == "Yes"){
    //   data = {
    //     chpId : 5826,
    //     value : this.sstReportBase64,
    //     dependent : 5824
    //   }
    //   this.saveData.push(data);
    // }

    // Structure (Pole) Drawing available
    // data = {
    //   chpId : 5825,
    //   value : this.strDrawing,
    //   dependent : 0
    // }
    // this.saveData.push(data);
    // if(this.strDrawing == "Yes"){
    //   data = {
    //     chpId : 5827,
    //     value : this.strDrawingBase64,
    //     dependent : 5825
    //   }
    //   this.saveData.push(data);
    // }


    let declaration = "";
    if(this.declaration) declaration = this.descriptionText;
    data = {
      chpId : 5526,
      value : declaration,
      dependent : 0
    }
    this.saveData.push(data);
    return true;
  }

  submitPtw(){
    if(!this.validateData()){
      return;
    }
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpName : this.loginEmpName,
      browser : this.browser,
      workStartDatetime : this.workStartDatetime.replace("T"," "),
      workEndDatetime : this.workEndDatetime.replace("T"," "),
      circle : CommonFunction.createCommaSeprate(this.selectedCircleList),
      siteName : CommonFunction.createCommaSeprate(this.selectedSiteIdNameList),
      supervisorMobile : this.supervisorMobile,
      tenentId : this.tenentId,
      height : this.height,
      electrical : this.electrical,
      matHandling : this.matHandling,
      ofcRoute : this.ofcRoute,
      confined : this.confined,
      hotWork : this.hotWork,
      siteAccess : this.siteAccess,
      saveData : this.saveData
    }
    this.layoutComponent.ShowLoading = true;
    // this.sharedService.insertDataByInsertType(jsonData, "submitPtw_new")
    this.sharedService.insertDataByInsertType(jsonData, "submitPtw")
    .subscribe(
      (result)=>{
        if(result.status){
          this.makeAllAsDefault();
          this.toastr.success("Successfully inserted");
        }
        else{
          this.toastr.warning(result.message,"Alert !",{timeOut : this.alertFadeoutTime});
        }
        this.layoutComponent.ShowLoading = false;
      },
      (error)=>{
        this.toastr.warning(Constant.returnServerErrorMessage("submitPtw"),"Alert !",{timeOut : this.alertFadeoutTime});
        this.layoutComponent.ShowLoading = false;
      }
    )
  }

  makeAllAsDefault(){
    this.selectedSiteTypeList = [];
    this.selectedCircleList = [];
    this.selectedSiteIdNameList = [];
    $(".forBlank").val("");
    $(".forBlankSelect").val("");
    $(".forUnchecked").prop("checked",false);
    this.saveData = [];
    $(".forBlankFile").val("");
    this.sstReport = "";
    this.sstReportBase64 = "";
    this.strDrawing = "";
    this.strDrawingBase64 = "";
  }

  changeListener($event, i): void {
    this.readThis($event.target, i);
  }

  sstReportBase64 : any = "";
  strDrawingBase64 : any = "";
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
      if (optionNumber == 1) {
        this.sstReportBase64 = image;
        if(wrongFile){
          $("#sstReport").val("");
          this.sstReportBase64 = "";
        }
      }
      else if (optionNumber == 2) {
        this.strDrawingBase64 = image;
        if(wrongFile){
          $("#strDrawing").val("");
          this.strDrawingBase64 = "";
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  bigImg(imgId : any){
    let showImg = "";
    let tabName = "";
    if(imgId == 1){
      showImg = this.sstReportBase64;
      tabName = "SST Report / Pre built report Available";
    }
    else{
      showImg = this.strDrawingBase64;
      tabName = "Structure (Pole) Drawing available";
    }
    let myWin = window.open("","");
    myWin.document.write("<title>"+tabName+"</title><img src = '"+showImg+"'>");
  }

}

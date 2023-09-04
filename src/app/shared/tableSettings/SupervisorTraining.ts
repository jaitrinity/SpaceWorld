import { TrainingStatusComponent } from "src/app/create-supervisor/training-status.component";

export class SupervisorTraining{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          // custom: [
          //   { name: 'approveRecord', title: 'Approve' },
          //   { name: 'rejectRecord', title: 'Reject' },
          // ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          name: {
            title: 'Sup. Name',
            width: '120px'
          },
          trCompanyName: {
            title: 'Company Name (Training Provide)',
            width: '120px'
          },
          trType: {
            title: 'Training Type',
            // width: '120px'
          },
          trDate: {
            title: 'Date of Reg.',
            width: '90px'
          },
          trIdNo: {
            title: 'Training ID',
            width: '90px'
          },
          trExDate:{
            title: 'Expire Date',
            width: '90px'
          },
          trGivenBy: {
            title: 'Training Given By',
            width: '90px'
          },
          trMode: {
            title: 'Training Mode',
            width: '70px'
          },
          statusValue: {
            title: 'Status',
            width: '70px'
          },
          trPic: {
            title: 'External Certification / Training Snaps',
            width:'20px',
            type: 'html',
            valuePrepareFunction: (cell, row) =>{
                if(row.trPic != '')
                    return "<a href='"+row.trPic+"' target='_blank'><img src='"+row.trPic+"' class='icon' /></a>";
                    // return "<a href='"+row.trPic+"' target='_blank'><i class='fa fa-picture-o' aria-hidden='true'></i></a>";
            }
          },
          trStatus:{
            title: 'Action',
            type: 'custom',
            filter: false,
            renderComponent: TrainingStatusComponent,
            onComponentInitFunction(instance) {
              instance.save.subscribe(row => row);
            }
          },
        }
    }
}
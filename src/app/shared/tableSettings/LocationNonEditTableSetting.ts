export class LocationNonEditTableSetting{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'editrecord', title: 'Edit'},
            { name: 'deactiveLocation', title: 'Deactive'},
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          locId: {
            title: 'Loc Id',
            width : '80px'
          },
          state:{
            title : 'State',
            width : '80px'
          },
          
          locName: {
            title: 'Site name',
            width : '120px'
          },
          siteId: {
            title: 'Site Id',
            width : '120px'
          },
          siteType: {
            title: 'Site Type',
            width : '100px'
          },
          siteCategory: {
            title: 'Site Category',
            width : '100px'
          },
          airportMetro: {
            title: 'Airport/Metro',
            width : '120px'
          },
          // rfiDate : {
          //   title : 'RFI date'
          // },
          hir : {
            title: 'HR - ISQ - IBS',
          },
          
          geoCoordinate: {
            title: 'Lat-long',
            sort : false,
          },
          siteStatus :{
            title: 'Site Status',
          }
          
        }
    }
}
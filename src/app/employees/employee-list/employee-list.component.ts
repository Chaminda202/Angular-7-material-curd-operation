import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from '../../shared/employee.service';
import {Employee} from '../../model/employee';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDialogConfig} from '@angular/material';
import {EmployeeComponent} from '../employee/employee.component';
import {NotificationService} from '../../shared/notification.service';
import {DialogService} from '../../shared/dialog.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employeeList: Employee[];
  listData: MatTableDataSource<any>;
  dataSource = new MatTableDataSource();
  // we can change order of columns changing this list
  displayedColumns: string[] = ['fullName', 'email', 'mobile', 'city', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog,
              private notificationService: NotificationService,
              private dialogService: DialogService) {
  }

  ngOnInit() {
    this.loadEmployeeList();
    this.dataSource.data = this.employeeList;
  }

  loadEmployeeList() {
    this.employeeService.getAll()
      .subscribe(list => {
        const array = list.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          };
        });
        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        // limit filteration only define in front end
        this.listData.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return ele !== 'actions' && data[ele].toLowerCase().indexOf(filter) !== -1;
          });
        };
      });
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  onCreate() {
    // componet should be added as entry component
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(EmployeeComponent, dialogConfig);
  }

  onEdit(element: Employee) {
    this.employeeService.selectedEmployeeDetails(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = element;
    this.dialog.open(EmployeeComponent, dialogConfig);
  }

  onDelete(element: Employee) {
    /* if (confirm('Are you sure to delete?')) {
       this.employeeService.delete(element);
       this.notificationService.warnMessage('Deleted Successfully..!!');
     }*/
    // this.dialogService.openConfirmDialog('Are you sure to delete?');
    this.dialogService.openConfirmDialog('Are you sure to delete?')
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.employeeService.delete(element);
          this.notificationService.warnMessage('Deleted Successfully..!!');
        }
      });
  }

  loadList() {
    this.employeeService.getAll()
      .subscribe(actionArray => {
        this.employeeList = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Employee;
        });
      });
  }
}

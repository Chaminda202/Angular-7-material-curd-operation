import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

import * as _ from 'lodash';
import {Department} from '../model/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  departmentList: Department[];

  constructor(private firestore: AngularFirestore) {
  }

  getDepartments() {
    return this.firestore.collection('departments').snapshotChanges();
  }

  getDepartmentName(depId: string) {
    if (depId == null) {
      return '';
    } else {
      this.getDepartments()
        .subscribe(actionArray => {
          this.departmentList = actionArray.map(item => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data()
            } as Department;
          });
        });
      return _.find(this.departmentList,
        (obj) => {
          return obj.id === depId;
        });
    }
  }
}

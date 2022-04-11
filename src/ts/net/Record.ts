import axios from "axios";
import { GDanger, GTip } from "../aler/game";
import { netBaseUrl } from "../config";
import { SavedRole } from "../core/chain/role/SavedRole";

export interface Record {
  isHomer?: boolean
  net: boolean
  roles: SavedRole[]
  opened: number[]
  updateTime: string
  index: number
}

export const RecordController = new class {

  uuid!: string

  id!: number

  records!: Record[]

  async login(uname: string, upass: string) {
    const res = await axios.post(netBaseUrl + 'login', {
      uname,
      upass
    });
    let { uuid, id, records } = res.data as { uuid: string, id: number, records: string[] };
    RecordController.uuid = String(uuid);
    RecordController.id = id;
    RecordController.records = records.map(r => JSON.parse(r));
  }

  getRecord(index: number) {
    return this.records[index];
  }

  createRecord(roles: SavedRole[]): Record {
    return {
      net: false,
      roles: roles,
      opened: [0],
      updateTime: new Date().toLocaleString(),
      index: -1
    }
  }

  saveRecord(index: number, record: Record) {

    record.updateTime = new Date().toLocaleString();
    record.index = index;
    this.records[index] = record;
    axios.post(netBaseUrl + 'save', {
      id: this.id,
      uuid: this.uuid,
      record: record,
      recordId: index
    }).then(res => {
      new GTip({ content: '保存成功' });
    }).catch(err => {
      new GDanger({ content: '保存失败' });
    })
  }

  logout() {
    this.id = undefined!;
    this.uuid = undefined!;
    this.records = [];
  }

};
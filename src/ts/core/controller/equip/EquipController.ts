import { Controller } from "../../../anxi/controller/controller";
import { Role } from "../../chain/role/Role";

interface EquipControllerData {

}

export class EquipController extends Controller<EquipControllerData> {
  constructor(role: Role) {
    super(role);
    this.data = {
      
    };
    this.initDataAndSignal();
  }
}
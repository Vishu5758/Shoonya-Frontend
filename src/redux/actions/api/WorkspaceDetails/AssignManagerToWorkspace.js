/**
 * API to add members to a project
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class AssignManagerToWorkspaceAPI extends API {
  constructor(workspaceId, username, timeout = 2000) {
    super("POST", timeout, false);
    this.type = constants.ASSIGN_MANAGER_TO_WORKSPACE;
    this.username = username;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.getWorkspaces
    }${workspaceId}/assign_manager/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.msg = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      username: this.username,
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.msg;
  }
}

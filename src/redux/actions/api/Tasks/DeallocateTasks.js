/**
 * Get Next Task API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class DeallocateTasksAPI extends API {
   constructor(projectId, timeout = 2000) {
     super("GET", timeout, false);
     this.projectId = projectId;
     this.type = constants.DE_ALLOCATE_TASKS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/unassign_tasks/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.unassignRes = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {}
 
   getHeaders() {
     this.headers = {
       headers: {
         "Content-Type": "application/json",
         "Authorization":`JWT ${localStorage.getItem('shoonya_access_token')}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.unassignRes;
   }
 }
  
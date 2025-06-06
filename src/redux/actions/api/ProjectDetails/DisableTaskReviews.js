/**
 * Disable Task Reviews API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class DisableTaskReviewsAPI extends API {
   constructor(id, timeout = 2000) {
     super("POST", timeout, false);
     this.type = constants.DISABLE_TASK_REVIEWS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${id}/disable_task_reviews/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.reviewRes = res;
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
         "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.reviewRes;
   }
 }
 
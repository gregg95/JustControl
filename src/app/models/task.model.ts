import { DateTime } from "ionic-angular";

export class Task {
    $key : string;
    tsk_usrId : string;  
    tsk_fltId : string;
    tsk_createdAt : DateTime;
    tsk_minCompletationDate : DateTime;
    tsk_maxCompletationDate : DateTime;
    tsk_title : string;
    tsk_description : string;
    tsk_commentary : string;
    tsk_status : string;
    
}
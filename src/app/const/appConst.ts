export class AppConst {
     public static SERVER_DATE_TIME_FORMAT ='dd MMM yyyy | hh:mm a';
     public static SERVER_DATE_FORMAT ='dd MMM yyyy';
     public static SOMETHING_WENT_WRONG = 'Oops, Something went wrong, Try again later';
     public static FILL_MANDATORY_FIELDS = 'Please fill all mandatory fields';
}


export enum REQ_STATUS {
     new_request = "New Request",
     qc_pending = "QC Pending",
     inducted = "Inducted",
     rejected = "Rejected",
 }
export class AppConst {
     public static SERVER_DATE_TIME_FORMAT ='dd MMM yyyy | hh:mm a';
     public static SOMETHING_WENT_WRONG = 'Oops, Something went wrong, Try again later';
}


export enum REQ_STATUS {
     new_request = "New Request",
     qc_pending = "QC Pending",
     inducted = "Inducted",
     rejected = "Rejected",
 }
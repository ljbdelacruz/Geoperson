import { Injectable } from '@angular/core';
@Injectable()
export class GlobalService {
  public username:string="";
  public Place:string="";
  public ID:string="";
  public loginState:boolean = false;
  public coms:string="";
  public Comms:any;
  public myURL="http://geoperson-001-site1.itempurl.com/";
  // public myURL="http://192.168.1.8:2458/";
}
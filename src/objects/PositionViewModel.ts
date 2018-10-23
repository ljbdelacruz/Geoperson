export class PositionViewModel{
    public id:string;
    public long:number;
    public lat:number;
    constructor(nid:string, nlong:number, nlat:number){
        this.id=nid;
        this.long=nlong;
        this.lat=nlat;
    }
}
export class UserViewModel{
    public ID:string;
    public PartnerID:string;
    constructor(ID:string, PartnerID:string){
        this.ID=ID;
        this.PartnerID=PartnerID;
    }
}
export class UserAuthViewModel{
    public username:string;
    public password:string;
    public confirmPassword:string;
    constructor(username:string, password:string){
        this.username=username;
        this.password=password;
    }
}
//firebase viewmodel
export class UsersFBViewModel{
    public ID:string;
    public Name:string;
    public comms:CommsViewModel[];
}
export class ConnectedViewModel{
    public ID:string;
    public lat:number;
    public long:number;
}
export class CommsViewModel{
    public p1:ConnectedViewModel;
    public p2:ConnectedViewModel;
}
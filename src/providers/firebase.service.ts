import firebase from 'firebase'
export class FirebaseServices{
    Set(data:any, route:string){
        firebase.database().ref(route).set(data).catch((data)=>{console.log(data)});
    }
    Push(data:any, route:string){
        firebase.database().ref(route).push(data);
    }
    Remove(route:string){
        firebase.database().ref(route).remove().catch((data)=>{console.log(data)});
    }
    SignUp(email:string, password:string){
        return firebase.auth().createUserWithEmailAndPassword(email, password).catch((data)=>{console.log(data)});
    }
    SignIn(email:string, password:string){
        return firebase.auth().signInWithEmailAndPassword(email, password).catch((data)=>{console.log(data)});
    }
    CheckIfUserExist(){
        console.log("Users");
        console.log(firebase.database().ref("users"));
//        return firebase.database.
    }
}

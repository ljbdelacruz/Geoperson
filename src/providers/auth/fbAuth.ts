import firebase from 'firebase';

export class FBAuthorization{
    signUp(email:string, password:string){
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }
    signIn(email:string, password:string){
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }
}
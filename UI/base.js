// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuKlY5Wq1Bt2ZSRzmM6iJfjfL6oB5VNKA",
  authDomain: "atlp-capstone.firebaseapp.com",
  databaseURL: "https://atlp-capstone-default-rtdb.firebaseio.com",
  projectId: "atlp-capstone",
  storageBucket: "atlp-capstone.appspot.com",
  messagingSenderId: "278628379823",
  appId: "1:278628379823:web:cd351b53e5071d8b68b85a",
  measurementId: "${config.measurementId}",
};
firebase.initializeApp(firebaseConfig);

console.log(firebase);

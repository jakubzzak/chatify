var admin = require('firebase-admin');

var serviceAccount = require('./chatify-2024-10-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

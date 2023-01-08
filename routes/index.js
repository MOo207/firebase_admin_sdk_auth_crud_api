var express = require('express');
var router = express.Router();
// import firebase admin
var admin = require('firebase-admin');
// import firebase service account
var serviceAccount = require('../service-account.json');
// initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// get firebase users within auth service
router.get('/', function (req, res, next) {
  // get users
  admin.auth().listUsers()
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
        console.log("user", userRecord.toJSON());
      });
      res.status(200).json({users: listUsersResult.users});
    })
    .catch(function (error) {
      console.log("Error listing users:", error);
      res.send(error);
    });
});

// create user
router.post('/', function (req, res, next) {
  // create user
  admin.auth().createUser({
    email: req.body.email,
    emailVerified: false,
    password: req.body.password,
    displayName: req.body.displayName,
    disabled: false
  })
    .then(function (userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
      res.status(200).json(userRecord.toJSON());
    })
    .catch(function (error) {
      console.log("Error creating new user:", error);
      res.send(error);
    });
});

// delete user
router.delete('/', function (req, res, next) {
  // delete user
  admin.auth().deleteUser(req.body.uid)
    .then(function () {
      console.log("Successfully deleted user");
      res.status(200).send('Successfully deleted user');
    }
    )
    .catch(function (error) {
      console.log("Error deleting user:", error);
      res.send(error);
    }
    );
});

// update user
router.put('/', function (req, res, next) {
  // update user
  admin.auth().updateUser(req.body.uid, {
    email: req.body.email,
    password: req.body.password,
    displayName: req.body.displayName,
  })
    .then(function (userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully updated user", userRecord.toJSON());
      res.status(200).json(userRecord.toJSON());
    })
    .catch(function (error) {
      console.log("Error updating user:", error);
      res.send(error);
    });
});

module.exports = router;
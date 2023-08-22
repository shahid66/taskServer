const UsersModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const OTPModel = require("../models/OTPModel");
const EmailUtility = require("../helpers/NodeMailer");

exports.registration = (req, res) => {
  let reqBody = req.body;

  UsersModel.create(reqBody, (err, data) => {
    if (err) {
      res.status(200).json({ status: "fail", data: err });
    } else {
      res.status(200).json({ status: "success", data: data });
    }
  });
};
exports.profileUpdate = (req, res) => {
  let email = req.headers["email"];
  let reqBody = req.body;
  console.log(reqBody);
  UsersModel.updateOne({ email: email }, reqBody, (err, data) => {
    if (err) {
      res.status(400).json({ status: "fail", data: err });
    } else {
      res.status(200).json({ status: "success", data: data });
    }
  });
};
exports.login = (req, res) => {
  let reqBody = req.body;

  UsersModel.aggregate(
    [
      { $match: reqBody },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
        },
      },
    ],
    (err, data) => {
      if (err) {
      } else {
        if (data.length > 0) {
          let Payloads = {
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            data: data[0]["email"],
          };
          let token = jwt.sign(Payloads, "secretKeyshahid");
          res
            .status(200)
            .json({ status: "success", token: token, data: data[0] });
        } else {
          res.status(401).json({ status: "unauthorized" });
        }
      }
    }
  );
};

exports.getProfile = (req, res) => {
  let email = req.headers["email"];

  UsersModel.aggregate(
    [
      { $match: { email: email } },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
          password: 1,
        },
      },
    ],
    (err, data) => {
      if (err) {
        res.status(400).json({ status: "fail", data: err });
      } else {
        res.status(200).json({ status: "success", data: data });
      }
    }
  );
};

exports.recoveryEmail = async (req, res) => {
  let email = req.params.email;
  let OTPCode = Math.floor(10000 + Math.random() * 900000);

  try {
    //Email Query
    let UserCount = await UsersModel.aggregate([
      { $match: { email: email } },
      { $count: "total" },
    ]);

    if (UserCount[0].total > 0) {
      //OTP insert
      let CreateOTP = await OTPModel.create({ email: email, otp: OTPCode });
      //Email send
      let SendMail = await EmailUtility(
        email,
        "Your PIN Code= " + OTPCode,
        "Task Manager PIN Verification"
      );

      res.status(200).json({ status: "success", data: SendMail });
    } else {
      res.status(200).json({ status: "fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

exports.RecoveryVerifyOTP = async (req, res) => {
  let email = req.params.email;
  let OTP = req.params.OTP;
  let status=0;
  let UpdateStatus=1;
  

  try {
    //Email Query
    let CountOTP = await OTPModel.aggregate([{$match:{email:email, otp: OTP,status:status  }},{$count:'total'}]);

    if (CountOTP[0].total >  0) {
      //OTP Update
     let UpdateOTPStatus= await OTPModel.updateOne({email:email, otp: OTP,status:status},{email:email, otp: OTP,status:UpdateStatus})
     

      res.status(200).json({ status: "success", data: UpdateOTPStatus });
    } else {
      res.status(200).json({ status: "fail", data: "Invalid OTP" });
    }
  } catch (e) {
    res.status(200).json({ status: "failr", data: e });
  }
};

exports.CreatePassword = async (req, res) => {
  let email = req.body.email;
  let OTPCode=req.body.otp
  let password = req.body.password;
  let UpdateStatus=1;
  

  try {
    //Email Query
    let CountOTP = await OTPModel.aggregate([{$match:{email:email, otp: OTPCode,status:UpdateStatus  }},{$count:'total'}]);

    if (CountOTP[0].total >  0) {
      //OTP Update
     let UpdatePassword= await UsersModel.updateOne({email:email,},{password: password})
     

      res.status(200).json({ status: "success", data: UpdatePassword });
    } else {
      res.status(200).json({ status: "fail", data: "Invalid OTP" });
    }
  } catch (e) {
    res.status(200).json({ status: "failr", data: e });
  }
};

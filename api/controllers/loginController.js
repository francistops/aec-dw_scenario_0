const loginModel = require("../models/loginModel");
const UNKNOWN_ERROR = {
  message: "Unknown error",
  errorCode: 9999,
};
const crypto = require("crypto");

exports.getLogin = async (req, res) => {
  console.log("---in controller getLogin---");
  let result = UNKNOWN_ERROR;
  try {
    const login = await loginModel.fetchLogin();
    result = {
      message: "Success",
      errorCode: 0,
      login: login,
    };
  } catch (error) {
    console.error("DB error", error);
    result.message = `Database error ${error}`;
    result.errorCode = 1001;
    res.status(500);
  }

  console.log("result: ", result);
  res.formatView(result);
};

exports.sendLogin = async (req, res) => {
  //
  console.log("---in controller getLogin---");
  console.log("in sendLogin req: ", req);
  console.log("in sendLogin res: ", res);

  let result = UNKNOWN_ERROR;

  const { userSentEmail, userSentPassword } = req.body;
  //const { userSentEmail } = req.body;
  console.log("in sendLogin req.body: ", userSentEmail, userSentPassword);
  //console.log("in sendLogin req.body: ", email);

  try {
    const dbSentEmail = await loginModel.fetchLoginByEmailFromDb(userSentEmail);
    const dbSentPassHash = await loginModel.fetchLoginByEmailForPassword(
      userSentEmail
    );

    // if (!userSentEmail || !dbSentEmail) {
    //   return res
    //     .status(401)
    //     .json({ message: "Utilisateur non trouvé", errorCode: 1001 });
    // }
    // la on le hash mais est le bonne endroit?
    // const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // const userPassHash = crypto.createHash("sha256").update(userSentPassword).digest("hex");

    // console.log(passHash);
    // if (passHash !== dbSentPassHash) {
    //   return res
    //     .status(403)
    //     .json({ message: "Mot de passe invalide", errorCode: 1002 });
    // }

    return res.formatView({
      message: "Connexion réussie",
      errorCode: 0,
      debug: {
        req: req,
        res: res,
      },
      user: {
        email: userSentEmail,
      },
    });
  } catch (error) {
    console.error("DB error", error);
    return res.status(500).formatView({
      message: `Erreur serveur : ${error.message}`,
      errorCode: 9999,
    });
  }
};

// simple too help me understand
exports.debugLogin = async (req, res) => {
  console.log("---in controller debugLogin---");
  // console.log("in sendLogin req: ", req.body.email, typeof(req.body.email));
  // console.log("in sendLogin res: ", res);

  let result = UNKNOWN_ERROR;

  //get user info from curl POST method
  const userEmail = req.body.email;
  const userHash = req.body.password;

  try {
    const debugData = await loginModel.fetchDebugByEmailFromDb(userEmail);
    result = {
      message: "Success",
      errorCode: 0,
      debugData: debugData,
    };
    // console.log('db email: ', debugData[3].email, typeof(req.body.email))

    // narrow the return db data
    const dbEmail = debugData[0].email;
    const dbHash = debugData[0].passHash;

    console.log(debugData[0].token)
    if (isUserValid(userEmail, dbEmail, res)) {
      if (isPasswordValid(userHash, dbHash, res)) {
        console.log(
          "user has been successfully authentificated! you are welcome!"
        );
        // create and insert a token in the user.token table
        const debugToken = await loginModel.insertTokenIntoUserTable(userEmail);

        // console.log(debugToken.token)
        user = {
          email: dbEmail,
          passHash: dbHash,
          token: debugToken.token
        }
      }
    }
  } catch (error) {
    console.error("DB error", error);
    result.message = `Database error ${error}`;
    result.errorCode = 1001;
    res.status(500);
  }

  // console.log("result: ", result);
  console.log("user: ", user);
  res.formatView(result, user);
};

function isPasswordValid(passHash, passHash2, res) {
  if (passHash != passHash2) {
    return res
      .status(401)
      .json({ message: "Unauthorized: password non valide", errorCode: 1001 });
  }
  return true;
}

function isUserValid(userEmail, dbEmail, res) {
  if (userEmail != dbEmail) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Utilisateur non trouvé", errorCode: 1001 });
  }
  return true;
}

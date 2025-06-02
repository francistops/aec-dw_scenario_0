const loginModel = require('../models/loginModel');
const UNKNOWN_ERROR = {
        message: "Unknown error",
        errorCode: 9999
};
const crypto = require('crypto');

exports.getLogin = async (req, res) => {
    let result = UNKNOWN_ERROR;
    console.log("loginController getLogin");
    try {
        const login = await loginModel.fetchLogin();
        result = {
            message: 'Success',
            errorCode: 0,
            login: login
        };
    } catch (error) {
        console.error('DB error', error);
        result.message = `Database error ${error}`;
        result.errorCode = 1001;
        res.status(500);
    }

    console.log('result: ', result);
    res.formatView(result);
};

exports.sendLogin = async (req, res) => {
    let result = UNKNOWN_ERROR;
    console.log(result);
    const { email, password } = req.body;
    console.log("in sendLogin controller: ", email, password);
    
    try {
        const user = await loginModel.fetchLogin(email);

        // if (!user) {
        //     return res.status(401).json({ message: "Utilisateur non trouvé", errorCode: 1001 });
        // }

        // const passHash = crypto.createHash('sha256').update(password).digest('hex');

        // console.log(passHash);
        // if (passHash !== user.passHash) {
        //     return res.status(403).json({ message: "Mot de passe invalide", errorCode: 1002 });
        // }

        return res.formatView({
            message: "Connexion réussie",
            errorCode: 0,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error('DB error', error);
         return res.status(500).formatView({
            message: `Erreur serveur : ${error.message}`,
            errorCode: 9999
        });
    }
};

// hashPassword(passwd) {
//   
//   
//   console.log(passwd);
//   console.log(passHash);
//   return passHash;
// }


// debugPassword(debug_pass) {
//   const div = this.shadowRoot.querySelector('div');
//   const debugText = document.createElement('p');
//   debugText.innerHTML = this.hashPassword(debug_pass)
//   div.appendChild(debugText)
// }
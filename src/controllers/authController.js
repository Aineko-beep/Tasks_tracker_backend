const postRegister = (req, res) => {
    res.json({ message: "User is registered (mock)" });
};

const postLogin = (req, res) => {
    res.json({ token: "mock-jwt-token" });
};

const postLogout =(req, res) => {
    res.json({ message: "User is logged out (mock)" });
};

const getMe =  (req, res) => {
    res.json({ message: "User information is valid (mock)" });
};
const postForgot = (req, res) => {
    res.json({ message: "Password recovery email sent (mock)" });
};

const postReset = (req, res) => {
    res.json({ message: "Password reset (mock)" });
};
module.exports ={postRegister,postLogin,postLogout,getMe,postForgot,postReset};


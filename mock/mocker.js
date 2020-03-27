module.exports = {
  "GET /age": { age: 21 },
  "POST /login/account": (req, res) => {
    const { password, username } = req.body;
    if (password === "888888" && username === "admin") {
      return res.send({
        status: "ok",
        code: 0,
        token: "sdfsdfsdfdsf",
        data: { id: 1, age: 21 }
      });
    } else {
      return res.send({ status: "error", code: 403 });
    }
  }
};

const { isSignatureValid } = require("./auth");
const sms = require("./plugins/sms");

const router = require("express").Router();

router.get("/", async function (req, res) {
  res.json({ message: "Hello from Rumsan Services" });
});

router.post("/sms", async (req, res, next) => {
  try {
    await isSignatureValid(req);
    const { phone, message } = req.body;
    const resMsg = await sms(phone, message);
    res.json({ success: true, message: resMsg });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

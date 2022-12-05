const config = require("config");
const { MailService } = require("@rumsan/core/services");

module.exports = async (phone, message) => {
  if (!phone) throw new Error("Must send phone");
  if (!message) throw new Error("Message is empty");
  phone = phone.toString().trim();

  if (phone.substring(0, 3) === "967" || phone.substring(0, 3) === "999") {
    phone = `${phone}@mailinator.com`;
    MailService.send({
      to: phone,
      subject: "Rumsan-SMS: Test Email",
      html: message,
    }).then((e) => {
      console.log(`Test email to: ${phone}`);
    });
    return `Email to: ${phone}`;
  }

  if (!config.get("enabled")) {
    console.log("ERROR: SMS service is disabled.");
    MailService.send({
      to: config.get("adminEmail"),
      subject: "Rumsan-SMS: Server Disabled",
      html: "Rumsan SMS service is  disabled. Please check.",
    }).then((e) => {
      console.log("Alert email sent.");
    });
    throw new Error("SMS service is disabled. Please contact administrator.");
  }

  console.log("SMS:", phone);
  const sms = require(`./${config.get("sms_service")}`);
  await sms(phone, message);
  return `SMS sent to ${phone} using ${config.get("sms_service")}.`;
};

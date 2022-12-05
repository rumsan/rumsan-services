const ethers = require("ethers");
const config = require("config");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const credsPath = "../config/google.json";

// const ACL = db.define(
//   "acl",
//   {
//     phone: { type: Sequelize.STRING },
//     pin: { type: Sequelize.STRING },
//   },
//   {
//     freezeTableName: true,
//     timestamps: false,
//   }
// );

const lib = {
  async loadGsheet() {
    const { docId, tab } = config.get("services.gsheet");

    const doc = new GoogleSpreadsheet(docId);
    await doc.useServiceAccountAuth(require(credsPath));
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[tab];
    return (await sheet.getRows()).filter((d) => d?.is_active === "TRUE");
  },

  async walletExist(address) {
    const authList = await lib.loadGsheet();
    const res = await authList.filter(
      (d) => d.wallet.toLowerCase() === address.toLowerCase()
    );
    return res.length > 0;
  },

  async isSignatureValid(req) {
    const { signature } = req.headers;
    if (!signature) throw new Error("Must send signature.");

    const sentAddress = ethers.utils.recoverAddress(
      ethers.utils.hashMessage("rumsan"),
      signature
    );
    if (!(await lib.walletExist(sentAddress)))
      throw new Error(`Not authorized address: ${sentAddress}`);
    return true;
  },
};

module.exports = lib;

const ENV = require("dotenv").config().parsed;
const OpenAI = require("openai");

const openai = new OpenAI({
  organization: ENV.GPT_ORGANIZATION_ID,
  apiKey: ENV.GPT_KEY,
});

module.exports = openai;

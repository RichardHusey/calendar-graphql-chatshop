import axios from "axios";
const BASE_PATH = "http://calapi.inadiutorium.cz/api/";

const calendarRequest = async (version: String, language: String, calType: String, date? : String | Number) => {
    //version validation
    const versionExpression = /^v\d+$/;
    const isValidVersion = versionExpression.test(String(version).toLowerCase());
  
    if (!isValidVersion) {
      console.log(version, "process is suspended due to .//");
      throw new Error("Version not in proper format");
    }
    //language validation
    if (language !== ("en" || "fr" || "it" || "la" || "cs"))
      throw new Error("This Language is not supported by App");
    //calType validation
    if (calType !== ("default" || "general-la" || "general-en" || "czech"))
      throw new Error("This Calendar Type in not supported by App");
  
    const request_url = `${BASE_PATH}${version}/${language}/calendars/${calType}/${date}`;
    const res = await axios.get(request_url);
    return res.data;
  };
  
  interface IQueryType { 
      version: String,
      language: String,
      calType: String
  }
  
const Query = {
    system: async (root:unknown, args: IQueryType) => {
      const { version, language, calType } = args;
      try {
        const res = await calendarRequest(version, language, calType);
        return res.data;
      } catch (err) {
        return err;
      }
    }
  };
  

export default { Query };
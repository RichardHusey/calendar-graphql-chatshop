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

interface IYearQueryType extends IQueryType {
    year: number
}

interface IMonthQueryType extends IYearQueryType {
    month: number
}

interface IDayQueryType extends IQueryType {
    day: String
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
  },
  year: async (root:unknown, args: IYearQueryType) => {
    const { version, language, calType, year } = args;
    try {
      const res = await calendarRequest(version, language, calType, year);
      return res;
    } catch (err) {
      return err;
    }
  },
  month: async (root:unknown, args: IMonthQueryType) => {
    const { version, language, calType, year, month } = args;
    //month validation
    if (month < 1 || month > 12)
      throw new Error("Month value is not available, it must be from 1 to 12.");
    try {
      const res = await calendarRequest(
        version,
        language,
        calType,
        `${year}/${month}`
      );
      return res;
    } catch (err) {
      return err;
    }
  },
  day: async (root:unknown, args: IDayQueryType) => {
    const { version, language, calType, day } = args;
    const isAllLettersRegex = /[A-Za-z]*$/;
    if (isAllLettersRegex.test(day.toString())) {
      if (!(day.includes("today") || day.includes("yesterday") || day.includes("tomorrow"))) { 
        console.log(123);
        throw new Error("Day formaty is not available");
      }
    } else {
      const numbers = day.split("/");
      if (
        parseInt(numbers[1]) < 1 ||
        parseInt(numbers[1]) > 12 ||
        parseInt(numbers[2]) < 1 ||
        parseInt(numbers[2]) > 31
      )
        throw new Error("Invalid YY/MM/DD");
    }

    try {
      const res = await calendarRequest(version, language, calType, day);
      return res;
    } catch (err) {
      return err;
    }
  },
};

export default { Query };

import axios from "axios";

const instance = axios.create({
  baseURL: "https://youtube-v31.p.rapidapi.com",
  timeout: 3000,
  headers: {
    "x-rapidapi-key": process.env.REACT_APP_KEY,
    "x-rapidapi-host": process.env.REACT_APP_HOST,
  },
});

export default instance;

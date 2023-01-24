import axios from "axios";

const instance = axios.create({
  baseURL: "https://youtube-v31.p.rapidapi.com",
  timeout: 5000,
  headers: {
    "x-rapidapi-key": "3094208016msh51208a22763fb8cp162ec9jsn4c0404080fc8",
    "x-rapidapi-host": "youtube-v31.p.rapidapi.com",
  },
});
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // whatever you want to do with the error
    console.log(error);
    if (
      error.code === "ECONNABORTED" ||
      (error.response && error.response.status === 410)
    ) {
      console.error(`A timeout happend on url ${error.config.url}`);
      return;
    }
    else if(error.response && error.response.status === 429){
      console.error(`Too many requests`);
      return;
    }
  }
);
export default instance;

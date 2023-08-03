const axios = require('axios');



const getPrice = async () =>{
  const res = await axios({
    method: 'GET',
    url: 'https://buff.163.com/api/market/goods',
    params: {
      game: "csgo",
      page_num: "1",
      search: 123
    },
    headers: {
      Cookie: 'session=1-WMiWiXt521x24nweHZd2l7UjG_1podyygkEqned8m3fF2043630364'
    }
  })
  console.log(res);
}

getPrice()

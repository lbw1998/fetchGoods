const axios = require('axios');
let leaseList = []
const uuList = {
  max0: [],
  max10: [],
  max100: [],
  max1000: []
}
const buffList = {
  max0: [],
  max10: [],
  max100: [],
  max1000: []
}

const sleep = (ms) =>{
  return new Promise(resolve => setTimeout(resolve, ms));
}

const requsestLease = async (pageIndex = 1) => {
  const res = await axios({
    method: 'POST',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMzc2ZjRjZDc5ZWE0Mzc5ODUxZGFhOTk2M2UzN2M2MCIsIm5hbWVpZCI6IjM2NTYxNDkiLCJJZCI6IjM2NTYxNDkiLCJ1bmlxdWVfbmFtZSI6IllQMDAwMzY1NjE0OSIsIk5hbWUiOiJZUDAwMDM2NTYxNDkiLCJuYmYiOjE2OTEwNTAyNTIsImV4cCI6MTY5MTkxNDI1MiwiaXNzIjoieW91cGluODk4LmNvbSIsImF1ZCI6InVzZXIifQ.71ViPpybDzLSOoq4ilVvuWA-o9tFkbaMmT7hzkPIA7E'
    },
    url: 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList',
    data: {
      gameId: "730",
      listSortType: "2",
      listType: "30",
      pageIndex,
      pageSize: 100,
      sortType: "0",
      stickers: {},
      stickersIsSort: false
    }
  })
  if (res.data.Code === 0) {
    leaseList = [...leaseList, ...res.data.Data]
    if (pageIndex == 20) {
      compareUU()
      leaseList = leaseList.filter(i => i.Price < 50)
      compareBuff()
    }
  }
}

const getLeaseList = async () => {
  for (let i = 1; i <= 20; i++) {
    await sleep(800)
    requsestLease(i)
  }
}

const compareUU = () => {
  for (let i = 0; i < leaseList.length; i++) {
    const item = leaseList[i]
    const num = Number(item.Price) - Number(item.LeaseDeposit)
    if (num > 0) {
      if (num > 1000) {
        uuList.max1000.push(item)
      } else if ( num > 100) {
        uuList.max100.push(item)
      } else if (num > 10) {
        uuList.max10.push(item)
      } else {
        uuList.max0.push(item)
      }
    }
  }
}

const compareBuff = async (index = 0) => {
  let count = 0
  while (index < leaseList.length ) {
    count++
    if (count === 20) {
      console.log('已扫描buff数量:' + (index+1));
    }
    const item = leaseList[index];
    let res
    try {
      res = await axios({
        method: 'GET',
        url: 'https://buff.163.com/api/market/goods',
        params: {
          game: "csgo",
          page_num: "1",
          search: item.CommodityName
        },
        headers: {
          Cookie: 'session=1-WMiWiXt521x24nweHZd2l7UjG_1podyygkEqned8m3fF2043630364'
        }
      })
      const min = 200;
      const max = 500;
      const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
      await sleep(randomNum)
      const sell_min_price = res.data.data.items[0].sell_min_price
      const num = Number(sell_min_price) - Number(item.LeaseDeposit)
      if (num > 0) {
        if (num > 1000) {
          buffList.max1000.push(item)
        } else if ( num > 100) {
          buffList.max100.push(item)
        } else if (num > 10) {
          buffList.max10.push(item)
        } else {
          buffList.max0.push(item)
        }
      }
      index++
    } catch (error) {
      await sleep(2000)
      compareBuff(index)
    }
  }
  console.log(buffList);
}
    
getLeaseList()

// const comparePrice = async (name) => {
//   const res = await axios({
//     method: 'GET',
//     url: 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList',
//     params: {
//       game: "csgo",
//       page_num: "1",
//       search: name
//     }
//   })
//   const sell_min_price = res.data.data.items[0].sell_min_price
// }
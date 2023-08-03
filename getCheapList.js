const fs = require('fs')
const axios = require('axios');


const sleep = (ms) =>{
  return new Promise(resolve => setTimeout(resolve, ms));
}
const jsonString = fs.readFileSync('uuList.json', { encoding: 'utf-8' });
const uuList = JSON.parse(jsonString);
const cheapList = {
  max0: [],
  max10: [],
  max100: [],
  max1000: []
}

const getCheapList = async () => {
  for (let i = 0; i < uuList.length; i++) {
    const item = uuList[i];
    requestList(item)
    await sleep(300)
  }
  fs.writeFileSync('cheapList.json', JSON.stringify(cheapList), { encoding: 'utf-8' });
  console.log('数据已写入 cheapList.json 文件');
}

const requestList = async (detail, pageIndex = 1) => {
  const res = await axios({
    method: 'POST',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMzc2ZjRjZDc5ZWE0Mzc5ODUxZGFhOTk2M2UzN2M2MCIsIm5hbWVpZCI6IjM2NTYxNDkiLCJJZCI6IjM2NTYxNDkiLCJ1bmlxdWVfbmFtZSI6IllQMDAwMzY1NjE0OSIsIk5hbWUiOiJZUDAwMDM2NTYxNDkiLCJuYmYiOjE2OTEwNTAyNTIsImV4cCI6MTY5MTkxNDI1MiwiaXNzIjoieW91cGluODk4LmNvbSIsImF1ZCI6InVzZXIifQ.71ViPpybDzLSOoq4ilVvuWA-o9tFkbaMmT7hzkPIA7E'
    },
    url: 'https://api.youpin898.com/api/homepage/v2/es/commodity/GetCsGoPagedList',
    data: {
      listSortType: 2,
      listType: 30,
      pageIndex,
      pageSize: 100,
      sortType: 1,
      stickers: {},
      stickersIsSort: false,
      templateId: detail.Id + '',
    }
  })
  if (res.data.Code === 0) {
    const CommodityList = res.data.Data.CommodityList
    for (let i = 0; i < CommodityList?.length; i++) {
      const item = CommodityList[i];
      const num = Number(detail.Price) - Number(item.LeaseDeposit)
      if (num > 0) {
        if (num > 1000) {
          cheapList.max1000.push(item)
        } else if ( num > 100) {
          cheapList.max100.push(item)
        } else if (num > 10) {
          cheapList.max10.push(item)
        } else {
          cheapList.max0.push(item)
        }
      }

    }
    if (CommodityList?.length === 100) {
      requestList(detail, pageIndex + 1)
    }
  }
}

getCheapList()
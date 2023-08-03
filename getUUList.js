const axios = require('axios');
const fs = require('fs');

let uuList = []

const sleep = (ms) =>{
  return new Promise(resolve => setTimeout(resolve, ms));
}

const requestList = async (pageIndex = 1) => {
  const res = await axios({
    method: 'POST',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMzc2ZjRjZDc5ZWE0Mzc5ODUxZGFhOTk2M2UzN2M2MCIsIm5hbWVpZCI6IjM2NTYxNDkiLCJJZCI6IjM2NTYxNDkiLCJ1bmlxdWVfbmFtZSI6IllQMDAwMzY1NjE0OSIsIk5hbWUiOiJZUDAwMDM2NTYxNDkiLCJuYmYiOjE2OTEwNTAyNTIsImV4cCI6MTY5MTkxNDI1MiwiaXNzIjoieW91cGluODk4LmNvbSIsImF1ZCI6InVzZXIifQ.71ViPpybDzLSOoq4ilVvuWA-o9tFkbaMmT7hzkPIA7E'
    },
    url: 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList',
    data: {
      gameId: "730",
      listSortType: "1",
      listType: "10",
      minPrice: 40,
      pageIndex,
      pageSize: 100,
      sortType: "0",
      stickers: {},
      stickersIsSort: false
    }
  })
  if (res.data.Code === 0 && res.data.Data !== null) {
    uuList = [...uuList, ...res.data.Data]
  } else if (res.data.Data === null) {
    return false
  }
  return true
}

const getUUList = async () => {
  let i = 1
  let flag = true
  while(flag) {
    flag = await requestList(i)
    i++
    await sleep(500)
  }
  fs.writeFileSync('uuList.json', JSON.stringify(uuList), { encoding: 'utf-8' });
  console.log('数据已写入 uuList.json 文件');
}

getUUList()

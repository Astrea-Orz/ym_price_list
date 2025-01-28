const reader = require('xlsx');
const fs = require('fs');

const file = reader.readFile('./20210309.xlsx')
// console.log(file)
async function xls2json() {
  let data = []
  const temp = reader.utils.sheet_to_json(file.Sheets['最新价格'])
  let tmpObj = null
  for (let i = 0; i < temp.length; i++) {
    if (temp[i]["编号"]) {
      tmpObj && data.push(tmpObj)
      tmpObj = {}
      tmpObj.code = String(temp[i]['编号'])
      tmpObj.name = String(temp[i]['品名'])
      tmpObj.specifications = [{
        spec: String(temp[i]['规格']),
        price: Number(temp[i]['单价/个不含税']).toFixed(3),
        priceWithTax: Number(temp[i]['单价/个含税'] || '').toFixed(3),
      }]
    } else {
      tmpObj.specifications.push({
        spec: String(temp[i]['规格']),
        price: Number(temp[i]['单价/个不含税']).toFixed(3),
        priceWithTax: Number(temp[i]['单价/个含税'] || '').toFixed(3),
      })
    }
  }
  return {data}
}
xls2json().then(res => {
  console.log(res)
  fs.writeFile('./20210309.json', JSON.stringify(res), (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('写入成功')
    }
  })
})
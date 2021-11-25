let data

axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json')
.then(function(res){
  data = res.data
  init()
  renderC3()
})

// initailize
const ticketCardArea = document.querySelector('.ticketCard-area')

let init = () => {
  let str = ''
  data.forEach(function (item, index) {
    let content = `
    <li class="ticketCard">
      <div class="ticketCard-img">
            <a href="#">
              <img src=${item.imgUrl} alt="">
            </a>
            <div class="ticketCard-region">${item.area}</div>
            <div class="ticketCard-rank">${item.rate}</div>
          </div>
          <div class="ticketCard-content">
            <div>
              <h3>
                <a href="#" class="ticketCard-name">${item.name}</a>
              </h3>
              <p class="ticketCard-description">
                ${item.description}
              </p>
            </div>
            <div class="ticketCard-info">
              <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
              </p>
              <p class="ticketCard-price">
                TWD <span id="ticketCard-price">${item.price}</span>
              </p>
            </div>
          </div>
    </li>
`
    str += content
  })
  ticketCardArea.innerHTML = str
}

// filiter
const regionSearch = document.querySelector('.regionSearch')
const searchResultText = document.querySelector('#searchResult-text')

regionSearch.addEventListener('change', e => {
  if (regionSearch.value === '全部地區') {
    init()
    renderC3()
    searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`
    return
  }
  let str = ''
  let num = 0
  data.forEach(item => {
    if (regionSearch.value === item.area) {
      let content = `
    <li class="ticketCard">
      <div class="ticketCard-img">
            <a href="#">
              <img src=${item.imgUrl} alt="">
            </a>
            <div class="ticketCard-region">${item.area}</div>
            <div class="ticketCard-rank">${item.rate}</div>
          </div>
          <div class="ticketCard-content">
            <div>
              <h3>
                <a href="#" class="ticketCard-name">${item.name}</a>
              </h3>
              <p class="ticketCard-description">
                ${item.description}
              </p>
            </div>
            <div class="ticketCard-info">
              <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
              </p>
              <p class="ticketCard-price">
                TWD <span id="ticketCard-price">${item.price}</span>
              </p>
            </div>
          </div>
    </li>
`
      str += content
      num += 1
    }
  })
  ticketCardArea.innerHTML = str
  searchResultText.textContent = `本次搜尋共 ${num} 筆資料`
  renderCity(regionSearch.value, num)
})

// addTicket
const addTicketBtn = document.querySelector('.addTicket-btn')

addTicketBtn.addEventListener('click', () =>{
  const ticketName = document.querySelector('#ticketName')
  const ticketImgUrl = document.querySelector('#ticketImgUrl')
  const ticketRegion = document.querySelector('#ticketRegion')
  const ticketPrice = document.querySelector('#ticketPrice')
  const ticketNum = document.querySelector('#ticketNum')
  const ticketRate = document.querySelector('#ticketRate')
  const ticketDescription = document.querySelector('#ticketDescription')

  const obj = {
    "id": data.length,
    "name": ticketName.value,
    "imgUrl": ticketImgUrl.value,
    "area": ticketRegion.value,
    "description": ticketDescription.value,
    "group": Number(ticketNum.value),
    "price": Number(ticketPrice.value),
    "rate": Number(ticketRate.value)
  }
  
  // 更新資料與畫面
  data.push(obj)
  init()
  searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`

  // 清空表單
  const form = document.querySelector('.addTicket-form')
  form.reset()

  // 更新圖表
  renderC3()
})

// C3 圖表
let renderC3 = () =>{
    // 篩選資料
    let dataObj = {}
    data.forEach(item =>{
      if (!dataObj[item.area]){
        dataObj[item.area] = 1
      }else{
        dataObj[item.area] += 1
      }
    })
    // 將資料處理成 C3 的格式
    let area = Object.keys(dataObj)
    let newData = []
    area.forEach(item =>{
      let arr = []
      arr.push(item)
      arr.push(dataObj[item])
      newData.push(arr)
    })
    // 將 newData 丟入 c3 產生器
    const chart = c3.generate({
      bindto: ".searchChart",
      data: {
        columns: newData,
        type : 'donut',
        colors:{
            高雄: '#e68618',
            台北: '#26c0c7',
            台中: '#515ed3',
        },
      },
      donut: {
        title: "套票地區比重",
        width: 10,
        label: {
            show: false
          }
      },
      size: {
        height: 160,
        width: 160
      },
    });
  }

// 個別圖表
let renderCity = (city, areaNum) =>{
    const chart = c3.generate({
        bindto: ".searchChart",
        data: {
          columns: [[city, areaNum]],
          type : 'donut',
          colors:{
            高雄: '#e68618',
            台北: '#26c0c7',
            台中: '#515ed3',
          },
        },
        donut: {
          title: "套票地區比重",
          width: 10,
          label: {
              show: false
            }
        },
        size: {
          height: 160,
          width: 160
        },
      });
}

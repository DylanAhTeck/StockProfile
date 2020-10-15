const API_ENDPOINT = //"http://127.0.0.1:5000/";
  "http://pythonapp-env.eba-k93y9wq3.us-east-1.elasticbeanstalk.com/";

var current_ticker = "";

function submitForm() {
  var ticker = document.getElementById("ticker").value;

  if (current_ticker !== ticker) {
    current_ticker = ticker;
    document.getElementsByClassName("news-content")[0].innerHTML = "";
    getCompanyOutlook(ticker);
  }
}
function displayError() {
  document.getElementsByClassName("error-message")[0].classList.remove("hide");
}

function removeError() {
  document.getElementsByClassName("error-message")[0].classList.add("hide");
}

function getCompanyOutlook(ticker) {
  let xhr = new XMLHttpRequest();
  let url = new URL(API_ENDPOINT + "search/" + ticker);
  xhr.open("GET", url);
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

  xhr.onload = function () {
    console.log(xhr.response);
    console.log(`Loaded: ${xhr.status} ${xhr.response}`);

    var parsedResponse = JSON.parse(xhr.response);
    console.log(parsedResponse);
    if (JSON.parse(xhr.response).detail == "Not found." || xhr.status != 200) {
      clearData(true);
      displayError();
    } else {
      removeError();
      getStockSummary(ticker);
      getChart(ticker);
      getNews(ticker);
      setCompanyOutlook(xhr.response);
      toggle("company");
    }
  };

  xhr.onerror = function () {
    console.log(`Network Error`);
  };

  xhr.onprogress = function (event) {
    console.log(`Received ${event.loaded} of ${event.total}`);
  };

  xhr.send();
}

function getStockSummary(ticker) {
  let xhr = new XMLHttpRequest();
  let url = new URL(API_ENDPOINT + "stock/" + ticker);
  xhr.open("GET", url);
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

  xhr.onload = function () {
    console.log(xhr.response);
    console.log(`Loaded: ${xhr.status} ${xhr.response}`);

    setStockSummary(xhr.response);
  };

  xhr.onerror = function () {
    // only triggers if the request couldn't be made at all
    console.log(`Network Error`);
  };

  xhr.onprogress = function (event) {
    // triggers periodically
    // event.loaded - how many bytes downloaded
    // event.lengthComputable = true if the server sent Content-Length header
    // event.total - total number of bytes (if lengthComputable)
    console.log(`Received ${event.loaded} of ${event.total}`);
  };

  xhr.send();
}

function getChart(ticker) {
  let xhr = new XMLHttpRequest();
  let url = new URL(API_ENDPOINT + "/chart/" + ticker);
  xhr.open("GET", url);
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

  xhr.onload = function () {
    //console.log(xhr.response);
    //console.log(`Loaded: ${xhr.status} ${xhr.response}`);

    setChart(xhr.response, ticker);
  };

  xhr.onerror = function () {
    // only triggers if the request couldn't be made at all
    //(`Network Error`);
  };

  xhr.onprogress = function (event) {
    //console.log(`Received ${event.loaded} of ${event.total}`);
  };

  xhr.send();
}

function getNews(ticker) {
  let xhr = new XMLHttpRequest();
  let url = new URL(API_ENDPOINT + "news/" + ticker);
  xhr.open("GET", url);
  xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

  xhr.onload = function () {
    //console.log(xhr.response);
    //console.log(`Loaded: ${xhr.status} ${xhr.response}`);
    setNews(xhr.response);
  };

  xhr.onerror = function () {
    // only triggers if the request couldn't be made at all
    // console.log(`Network Error`);
  };

  xhr.onprogress = function (event) {
    // triggers periodically
    // event.loaded - how many bytes downloaded
    // event.lengthComputable = true if the server sent Content-Length header
    // event.total - total number of bytes (if lengthComputable)
    //(`Received ${event.loaded} of ${event.total}`);
  };

  xhr.send();
}

function setCompanyOutlook(response) {
  //(response);
  json = JSON.parse(response);
  document.getElementById("company_name_value").innerHTML = json.name;
  document.getElementById("symbol_value").innerHTML = json.ticker;
  document.getElementById("code_value").innerHTML = json.exchangeCode;
  document.getElementById("start_date_value").innerHTML = json.startDate;
  document.getElementById("description_value").innerHTML = json.description;
}

function setStockSummary(response) {
  json = JSON.parse(response);
  document.getElementById("stock_ticker_symbol").innerHTML = json[0].ticker;
  document.getElementById(
    "stock_trading_day"
  ).innerHTML = json[0].timestamp.split("T")[0];
  document.getElementById("stock_closing_price").innerHTML = json[0].prevClose;
  document.getElementById("stock_opening_price").innerHTML = json[0].open;
  document.getElementById("stock_high_price").innerHTML = json[0].high;
  document.getElementById("stock_low_price").innerHTML = json[0].low;
  document.getElementById("stock_last_price").innerHTML = json[0].last;
  document.getElementById("stock_change").innerHTML =
    (json[0].last - json[0].prevClose).toFixed(2) + "  ";
  document.getElementById("stock_change_percent").innerHTML =
    (((json[0].last - json[0].prevClose) / json[0].prevClose) * 100).toFixed(
      2
    ) + "%  ";
  document.getElementById("stock_number_shares_traded").innerHTML =
    json[0].volume;

  if (json[0].last - json[0].prevClose < 0) {
    var img = document.createElement("img");
    img.src = "static/img/RedArrowDown.jpg";
    img.classList.add("arrow-img");
    document.getElementById("stock_change").appendChild(img);
    document
      .getElementById("stock_change_percent")
      .appendChild(img.cloneNode(false));
  } else if (json[0].last - json[0].prevClose > 0) {
    var img = document.createElement("img");
    img.src = "static/img/GreenArrowUp.jpg";
    img.classList.add("arrow-img");
    document.getElementById("stock_change").appendChild(img);
    document
      .getElementById("stock_change_percent")
      .appendChild(img.cloneNode(false));
  }
}

function formatDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function formatNewsDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("/");
}

function getStringDate(date) {
  var d = new Date(date);
  var n = d.toUTCString();
  var split = n.split("\\s+");
  return split[0] + split[1] + split[2] + split[3];
}

function clearData(keepValue) {
  if (!keepValue) {
    current_ticker = "";
    document.getElementById("ticker").value = "";
  }

  removeError();
  toggle("clear");
  document.getElementsByClassName("news-content")[0].innerHTML = "";
  var tds = document.getElementsByTagName("td");
  document.getElementsByClassName("tab-bar")[0].classList.add("hide");
  for (let element of tds) {
    element.innerHTML = "";
  }
}

function setChart(response, ticker) {
  var json = JSON.parse(response);
  var stock_input = [];
  var volume_input = [];

  json.forEach((element) => {
    var date = new Date(element.date);
    var utcDate = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
    console.log(date.getTime());
    console.log(utcDate);
    stock_input.push([utcDate, element.close]);
    volume_input.push([utcDate, element.volume]);
  });

  Highcharts.stockChart("container", {
    title: {
      text: `Stock Price ${ticker.toUpperCase()} ${formatDate()}`,
    },

    // time: {
    //   timezone: "America/Los_Angeles",
    // },

    subtitle: {
      useHTML: true,
      text: '<a  href="https://api.tiingo.com/">Source: Tiingo</a>',
    },

    xAxis: {
      type: "datetime",
      minRange: 7,
      minPadding: 0,
      startOnTick: true,
      endOnTick: true,
      tickmarkPlacement: "on",
    },

    yAxis: [
      {
        // Primary yAxis
        title: {
          text: "Stock Price",
        },
        opposite: false,
        offset: 0,
      },
      {
        // Secondary yAxis
        title: {
          text: "Volume",
        },
        labels: {
          formatter: function () {
            return this.value / 1000 + "k";
          },
        },
        opposite: true,
        offset: 0,
      },
    ],

    rangeSelector: {
      buttons: [
        {
          type: "day",
          count: 7,
          text: "7d",
        },
        {
          type: "day",
          count: 15,
          text: "15d",
        },
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "month",
          count: 3,
          text: "3m",
        },
        {
          type: "month",
          count: 6,
          text: "6m",
        },
      ],
      selected: 1,
      inputEnabled: false,
    },
    plotOptions: {
      series: {
        pointPlacement: "on",
      },
      area: {
        maxPadding: 0,
      },
      column: {
        maxPointWidth: 5,
      },
    },
    series: [
      {
        name: ticker.toUpperCase(),
        type: "area",
        data: stock_input,
        gapSize: 5,
        tooltip: {
          valueDecimals: 2,
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        threshold: null,
      },
      {
        name: `${ticker.toUpperCase()} Volume`,
        type: "column",
        data: volume_input,
        yAxis: 1,
      },
    ],
  });
}

function setNews(response) {
  json = JSON.parse(response);
  var match = 0;

  for (var i = 0; i < json.articles.length && match < 5; i++) {
    // console.log(json.articles[0]);
    var news = json.articles[i];
    if (!news.title || !news.url || !news.urlToImage || !news.publishedAt)
      continue;

    var content = document.createElement("div");
    content.classList.add("news-block");

    var img = document.createElement("img");
    img.src = news.urlToImage;
    content.appendChild(img);

    var data = document.createElement("div");
    data.classList.add("news-info");

    var title = document.createElement("b");
    title.appendChild(document.createTextNode(news.title));
    data.appendChild(title);

    var date = document.createElement("p");
    date.appendChild(
      document.createTextNode(
        "Published Date: " + formatNewsDate(news.publishedAt)
      )
    );
    data.appendChild(date);

    var url = document.createElement("a");
    url.href = news.url;
    url.innerHTML = "See Original Post";
    url.target = "_blank";
    data.append(url);
    content.appendChild(data);

    document.getElementsByClassName("news-content")[0].appendChild(content);
    match++;
  }
}

function toggle(tab) {
  var active = document.getElementsByClassName(`active`);
  if (active && active[0]) {
    active[0].classList.add("hide");
    active[0].classList.remove("active");
  }
  var button_active = document.getElementsByClassName(`button-active`);
  if (button_active && button_active[0]) {
    button_active[0].classList.remove("button-active");
  }

  document.getElementsByClassName("tab-bar")[0].classList.remove("hide");
  var new_active = document.getElementsByClassName(`${tab}-content`)[0];
  if (new_active) {
    new_active.classList.remove("hide");
    new_active.classList.add("active");
  }

  var new_button_active = document.getElementsByClassName(`${tab}-button`)[0];
  if (new_button_active) {
    new_button_active.classList.add("button-active");
  }
}

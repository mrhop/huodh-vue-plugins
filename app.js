//用于nodejs的测试使用
var express = require('express');

var bodyParser = require('body-parser');
var lodash = require('lodash')

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// table data init
var tableData = [
  {
    "key": 1,
    "value": [
      "小一"
    ]
  },
  {
    "key": 2,
    "value": [
      "小二"
    ]
  },
  {
    "key": 3,
    "value": [
      "小3"
    ]
  },
  {
    "key": 4,
    "value": [
      "小4"
    ]
  },
  {
    "key": 5,
    "value": [
      "小5"
    ]
  },
  {
    "key": 6,
    "value": [
      "小6"
    ]
  },
  {
    "key": 7,
    "value": [
      "小7"
    ]
  },
  {
    "key": 8,
    "value": [
      "小8"
    ]
  },
  {
    "key": 9,
    "value": [
      "小9"
    ]
  },
  {
    "key": 10,
    "value": [
      "小10"
    ]
  },
  {
    "key": 11,
    "value": [
      "小1一"
    ]
  },
  {
    "key": 12,
    "value": [
      "小1二"
    ]
  },
  {
    "key": 13,
    "value": [
      "小13"
    ]
  },
  {
    "key": 14,
    "value": [
      "小14"
    ]
  },
  {
    "key": 15,
    "value": [
      "小15"
    ]
  },
  {
    "key": 16,
    "value": [
      "小16"
    ]
  },
  {
    "key": 17,
    "value": [
      "小17"
    ]
  },
  {
    "key": 18,
    "value": [
      "小18"
    ]
  },
  {
    "key": 19,
    "value": [
      "小19"
    ]
  },
  {
    "key": 20,
    "value": [
      "小20"
    ]
  },
  {
    "key": 21,
    "value": [
      "小2一"
    ]
  },
  {
    "key": 22,
    "value": [
      "小2二"
    ]
  },
  {
    "key": 23,
    "value": [
      "小23"
    ]
  }
]

// 默认table data的获取
app.post('/data/table.html', function (req, res) {
  var pager = req.body.pager
  var init = req.body.init
  var filters = req.body.filters
  var subData = tableData;
  if (filters && filters.name) {
    subData = lodash.filter(tableData, function (o) {
      return o.value[0].indexOf(filters.name) > -1
    })
  }

  if ((pager.currentPage - 1) * pager.pageSize >= subData.length) {
    pager.currentPage = Math.ceil(subData.length / pager.pageSize)
    if (pager.currentPage === 0) {
      pager.currentPage = 1
    }
  }
  var returnData = subData.slice((pager.currentPage - 1) * pager.pageSize, pager.currentPage * pager.pageSize)
  if (init) {
    // 初始化
    res.json({
      "rules": {
        "header": [
          {
            "name": "#sn",
            "title": "#sn"
          },
          {
            "name": "name",
            "title": "名称",
            "type": "text",
            "filter": true
          }
        ],
        "action": {
          "add": true,
          "detail": true,
          "update": true,
          "delete": true
        },
        "feature": {
          "filter": true,
          "pager": true
        }
      },
      "data": {
        "rows": subData.slice(0, pager.pageSize),
        "totalCount": subData.length,
        "pager": pager
      }
    })
  } else {
    res.json({
      "data": {
        "rows": returnData,
        "totalCount": subData.length,
        "pager": pager,
        "filters": filters
      }
    })
  }
});
app.get('/data/table-delete.html', function (req, res) {
  var id = parseInt(req.query.key)
  lodash.remove(tableData, function (o) {
    return o.key === id
  });
  res.end();
});
app.listen(3000, function () {
  console.log('Test Liaonong app listening on port 3000!');
});

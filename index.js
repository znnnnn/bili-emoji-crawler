const request = require('request')
const path = require('path')
const http = require('http')
const fs = require('fs')
const url = `https://api.bilibili.com/x/emote/user/panel/web?business=reply`

const isResize = true // 是否裁剪
let resize = isResize ? '@60w_60h_1c_100q.png' : '' //裁剪的长宽质量格式

request(url, (err, resp, body) => {
  const pathToDir = path.join(__dirname, './res')
  removeDir(pathToDir)
  const conf = JSON.parse(body)
  conf.data.packages.forEach((group) => {
    let name = group.text
    let emojis = group.emote
    // rmdir('./res/', function() {
    //   console.log('删除成功')
    // });

    if (name != '颜文字') {
      try {
        fs.mkdir(`./res/${name}`, (err) => {
          if (err) throw new Error('exists')
        })
      } catch (e) {
        console.log(e)
      } finally {
        fetchGroupImages(name, emojis)
      }
    }
  })
})
function fetchGroupImages(groupName, emojiArr) {
  console.log(`group: ${groupName}`)
  emojiArr.forEach((emoji) => {
    console.log(`fetching ${emoji.url + resize}`)
    request
      .get(emoji.url + resize)
      .pipe(
        fs.createWriteStream(`./res/${groupName}/${emoji.text + resize}.png`),
      )
  })
}

// var stream = function(){
//   request('http://i0.hdslb.com/bfs/emote/92b1c8cbceea3ae0e8e32253ea414783e8ba7806.png@48w_48h.png').pipe(fs.createWriteStream('res/test1.png'));
// }
// stream();

const removeDir = function (path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + '/' + filename).isDirectory()) {
          removeDir(path + '/' + filename)
        } else {
          fs.unlinkSync(path + '/' + filename)
        }
      })
    } else {
      console.log('No files found in the directory.')
    }
  } else {
    console.log('Directory path not found.')
  }
}

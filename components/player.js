module.exports = {
  type: 'video',
  async fetch({ args }) {
    let detail = args.url
    let resp1 = await $http.get(detail)
    const cheerio = require('cheerio')
    $ = cheerio.load(resp1.data)
    let link_temp = $('.embed-responsive.clearfix script').first().html().match(/http.*?"/)
    // 纯播放页面的链接
    let urlBase = unescape(link_temp).replace('"', '')

    async function getM3u8(urlBase){    
      // 在纯播放页面的html代码中找m3u8链接
      let resp2 = await $http.get(urlBase)
      var link_temp1 = resp2.data.match(/var main = \".*?"/)
      let m3u8Url
      if (link_temp1 != null) {
        var link_temp2 = link_temp1[0].match(/\/.*?"/)
        var baseUrl = urlBase.match(/http.*?.com/)
        var link_temp3 = link_temp2[0].replace('"', '')
        m3u8Url = baseUrl[0]+link_temp3
      }
      else{
        m3u8Url = resp2.data.match(/http.*\.m3u8*/)[0]
      }
      return m3u8Url
    }

    async function parseM3u8(m3u8Url){
      // 重定向m3u8链接
      let resp3 = await $http.get(m3u8Url)
      var m3u8UrlBase = m3u8Url.match(/http.*?.m3u8/)
      var m3u8Suffix = resp3.data.match(/.*?.m3u8/)
      var m3u8Url_real = m3u8UrlBase[0].replace('index.m3u8', m3u8Suffix[0])
      return m3u8Url_real
    }

    let url_play;
    if (urlBase.match(/m3u8/) != null) {
      //urlBase字符串含有m3u8的话，直接重定向
      url_play = await parseM3u8(urlBase)
    } else {
      //如果没有，就要访问这个链接，去网页里面找，找到再重定向
      let m3u8Url = await getM3u8(urlBase)
      if (m3u8Url.match(/playlist/) != null) {
        url_play = m3u8Url //playlist.m3u8就可以直接播放，不需要重定向了
      } else {
        url_play = await parseM3u8(m3u8Url)
      }
    }

    console.log('视频所在网页:')
    console.log(detail)
    console.log('视频播放地址:')
    console.log(url_play)
    return {
      url: url_play
    }
  }
}
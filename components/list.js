module.exports = {
  type: 'list',
  async fetch({ args, page }) {
    baseURL = 'https://www.nfmovies.com'
    let u = `https://www.nfmovies.com/list/?${args.type}-${page || 1}.html`
    var imag_jquery = '.myui-vodlist.clearfix li .myui-vodlist__box a[class]'
    if ((args.keyword != '') & (args.keyword != undefined)) {
      // 如果关键词非空，转到搜索界面
      let name = encodeURI(args.keyword)
      u = `https://www.nfmovies.com/search.php?searchword=${name}`
      imag_jquery = '.myui-vodlist__media.clearfix li .thumb a[class]'
    }
    let resp = await $http.get(u)
    const cheerio = require('cheerio')
    const $ = cheerio.load(resp.data)
    var imags = []
    $(imag_jquery).each(function () {
      var $this = $(this)
      imags.push([
        $this.attr('href'),
        $this.attr('title'),
        $this.attr('data-original')
      ])
    })
    var details = []
    if ((args.keyword != '') & (args.keyword != undefined)) {
      let detail_jquery = '.myui-vodlist__media.clearfix li .detail'
      $(detail_jquery).each(function () {
        var $this = $(this)
        var inf = this.children[5].children
        var actors = ''
        for (let i = 0; i < inf.length; i++) {
          if (inf[i].type == 'tag'){
            actors = actors + ' ' + inf[i].firstChild.data
          }
        }
        details.push(actors)
      })
    } else {
      let detail_jquery =
        '.myui-vodlist.clearfix li .myui-vodlist__box .myui-vodlist__detail p'
      $(detail_jquery).each(function () {
        var $this = $(this)
        details.push($this.text().replace(/^\s+|\s+$/g, ''))
      })
    }

    let items = []
    for (let i = 0; i < details.length; i++) {
      let detail_url = baseURL + imags[i][0]
      let title = imags[i][1]
      let imag_url = baseURL + imags[i][2]
      items.push({
        style: 'vod',
        id: imags[i][0].match(/\d+(.\d+)?/g)[0],
        title: title,
        image: imag_url,
        summary: details[i],
        route: $route('detail', {
          detail_url: detail_url,
          imag_url: imag_url,
          title: title
        })
      })
    }
    if ((args.keyword != '') & (args.keyword != undefined)) {
      return {
        nextPage: null,
        items: items
      }
    } else {
      return {
        nextPage: (page || 1) + 1,
        items: items
      }
    }
  }
}

module.exports = {
  type: 'list',
  async fetch({ args, page }) {
    const { data: html } = await $http.get(this.args.detail_url)
    const cheerio = require('cheerio')
    const $ = cheerio.load(html)
    let items = []
    let actionitems = []
    let summary = $(
      '.myui-panel.col-pd.clearfix .myui-content__detail p.desc span.data'
    ).text()
    let updateTime = $(
      '.myui-panel.col-pd.clearfix .myui-content__detail p.data.hidden-sm.hidden-xs'
    ).text()

    // 选源
    let playlists_number = []
    let playlists_name = []
    $('ul.nav.nav-tabs.active li a').each(function () {
      var $this = $(this)
      if ($this.attr('href') != '#type') {
        playlists_number.push($this.attr('href'))
        playlists_name.push($this.text())
      }
    })
    let player_choose = '#playlist1' //默认是选择playlist对应的源，如果有后面的源，给加上去
    if (playlists_name.indexOf('ckm3u8') >= 0) {
      player_choose = playlists_number[playlists_name.indexOf('ckm3u8')]
    } else if (playlists_name.indexOf('kuyun') >= 0) {
      player_choose = playlists_number[playlists_name.indexOf('kuyun')]
    } else if (playlists_name.indexOf('奈菲独家高清片源') >= 0) {
      player_choose = playlists_number[playlists_name.indexOf('奈菲独家高清片源')]
    } else if (playlists_name.indexOf('33uu') >= 0) {
      player_choose = playlists_number[playlists_name.indexOf('33uu')]
    }

    $(
      'div' + player_choose + ' ul.myui-content__list.sort-list.clearfix li a'
    ).each(function () {
      var $this = $(this)
      var playlink = 'https://www.nfmovies.com' + $this.attr('href')
      actionitems.push({
        title: $this.attr('title'),
        route: $route('player', {
          url: playlink
        })
      })
    })
    items.push({
      style: 'richMedia',
      title: args.title,
      image: args.imag_url,
      summary: summary,
      actions: actionitems,
      subtitle: updateTime
    })

    return {
      items: items
    }
  }
}

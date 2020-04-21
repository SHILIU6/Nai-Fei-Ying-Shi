module.exports = {
  type: 'bottomTab',
  title: '奈菲影视',
  searchRoute: $route('list'),
  async fetch({ args, page }) {
    return [
      {
        title: '电影',
        route: $route('list', {
          type: 1
        }),
        image: $icon('movie')
      },
      {
        title: '电视',
        route: $route('list', {
          type: 2
        }),
        image: $icon('tv')
      },
      {
        title: '综艺',
        route: $route('list', {
          type: 3
        }),
        image: $icon('music_video')
      },
      {
        title: '动漫',
        route: $route('list', {
          type: 4
        }),
        image: $icon('games')
      }
    ]
  }
}

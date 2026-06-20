// 首页 GA 数据可视化：访问来源 Top N + 热门文章 Top N
// 数据来自独立 stats 仓库的 ga-data.json（经 raw.githubusercontent.com 读取）。
//
// ⚠️ 把下面的 GA_DATA_URL 换成你自己的地址，格式：
//   https://raw.githubusercontent.com/<用户名>/<stats仓库名>/<分支>/ga-data.json
//   例如：https://raw.githubusercontent.com/Skyarrow416/blog-ga-stats/main/ga-data.json
(function () {
  var GA_DATA_URL = 'https://raw.githubusercontent.com/Skyarrow416/blog-ga-stats/main/ga-data.json';

  // 只在首页运行（路径为根，或带分页的根）
  var p = location.pathname.replace(/\/index\.html$/, '/');
  if (p !== '/' && !/^\/page\/\d+\/?$/.test(p)) return;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function renderList(items, type, max) {
    if (!items || !items.length) return '<li class="ga-empty">暂无数据</li>';
    max = max || Math.max.apply(null, items.map(function (i) { return i.value; }));
    return items.map(function (it) {
      var pct = max > 0 ? Math.round((it.value / max) * 100) : 0;
      var label = type === 'post'
        ? '<a href="' + esc(it.href) + '">' + esc(it.label) + '</a>'
        : '<span>' + esc(it.label) + '</span>';
      return '<li class="ga-row">' +
        '<div class="ga-row-head">' + label +
        '<b class="ga-num">' + it.value + '</b></div>' +
        '<div class="ga-bar"><span style="width:' + pct + '%"></span></div>' +
        '</li>';
    }).join('');
  }

  function build(data) {
    var box = el('div', 'ga-board');

    var refs = (data.referrers || []).map(function (r) {
      return { label: r.source, value: r.sessions };
    });
    var posts = (data.posts || []).map(function (r) {
      return { label: r.title || r.path, value: r.views, href: r.path };
    });

    var note = data.updated
      ? '近 ' + (data.rangeDays || 30) + ' 天 · 更新于 ' +
        new Date(data.updated).toLocaleDateString('zh-CN')
      : '';

    box.innerHTML =
      '<div class="ga-board-inner">' +
        '<div class="ga-col">' +
          '<h3 class="ga-title">访问来源 Top ' + refs.length + '</h3>' +
          '<ul class="ga-list">' + renderList(refs, 'ref') + '</ul>' +
        '</div>' +
        '<div class="ga-col">' +
          '<h3 class="ga-title">热门文章 Top ' + posts.length + '</h3>' +
          '<ul class="ga-list">' + renderList(posts, 'post') + '</ul>' +
        '</div>' +
      '</div>' +
      (note ? '<div class="ga-note">' + esc(note) + '</div>' : '');

    return box;
  }

  function mount(node) {
    // 插到首页文章列表所在的主板块顶部
    var board = document.querySelector('#board') ||
                document.querySelector('.board') ||
                document.querySelector('main');
    if (!board) return;
    var firstCard = board.querySelector('.index-card');
    if (firstCard) board.insertBefore(node, firstCard);
    else board.appendChild(node);
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetch(GA_DATA_URL, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) { mount(build(data)); })
      .catch(function (e) { console.warn('[GA widget] 加载失败：', e.message); });
  });
})();

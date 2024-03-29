module.exports = {
  HTML:function(title, list, body, control, authStatusUI='<a href="/auth/login">login</a>') {
      return `
      <!doctype html>
      <html>
          <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
          </head>
          <body>
              ${authStatusUI}
              <h1><a href="/">WEB</a></h1>
              ${list}
              ${control}
              ${body}
          </body>
      </html>
      `;
  },
  list:function(filelist) {
      var list = '<ul>';
      var i = 0;
      while(i < filelist.length) {
          list = list + `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
          i = i + 1;
      }
      list = list+'</ul>';
      return list;
  }
}
/*---------------------------------------------------
2024-02-22 express 사용을 위한 기존내용 주석처리

var sanitizeHtml = require('sanitize-html');
module.exports = {
    HTML: function(title, list, body, control) {
      return `
        <!doctype html>
        <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <a href="/author">author</a>
            ${list}
            ${control}
            ${body}
          </body>
        </html>
      `;

    },list: function(topics) {
      var list = '<ul>';
      var i = 0;
      while(i < topics.length) {
        list += `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
        i++;
      }
      list += '</ul>';
      return list;
      
    },authorSelect:function(authors, author_id) { //작성자 리스트, 현재 작성자
      var tag = '';
      var i = 0;
      while(i < authors.length) {
        var selected = '';
        if(authors[i].id === author_id) {
          selected = ' selected';
        }
        tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`;
        i++;
      }
      return `
        <p>
          <select name="author">${tag}</select>
        </p>
      `;
    },authorTable:function(authors) {
      var tag = '<table>';
      var i = 0;
      
      while(i < authors.length) {
          tag += `
              <tr>
                  <td>${sanitizeHtml(authors[i].name)}</td>
                  <td>${sanitizeHtml(authors[i].profile)}</td>
                  <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                  <td>
                    <form action="/author/delete_process" method="POST">
                      <input type="hidden" name="id" value="${authors[i].id}" />
                      <input type="submit" value="delete" />
                    </form>
                  </td>
              </tr>`;
          i++;
      }
      tag += '</table>';
      return tag;
    }



  }
  ---------------------------------------------------*/
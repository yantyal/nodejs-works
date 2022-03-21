function clickBtn() {
  const id = "1044715390094874245";
  const isbn = document.getElementById("isbn").value;
  if (isbn.length == 10 || isbn.length == 13) {
    isbnSearch(isbn, id);
  }
}
const clickBtn2 = () => {
  const id = "1044715390094874245";
  const isbn2 = encodeURI(document.getElementById("isbn2").value);
  const datas = keySearch(isbn2, id);
};

async function isbnSearch(isbn, id) {
  const res = await fetch(
    "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404" +
      "?format=json&isbn=" +
      isbn +
      "&applicationId=" +
      id
  );
  const bookInfo = await res.json();
  const smallImg = bookInfo.Items[0].Item.smallImageUrl;
  const largeImg = bookInfo.Items[0].Item.largeImageUrl;
  const title = bookInfo.Items[0].Item.title;
  const author = bookInfo.Items[0].Item.author;
  //const date = bookInfo.Items[0].Item.salesDate;
  document.getElementById("image").src = largeImg;
  document.getElementById("smallImg").value = smallImg;
  document.getElementById("largeImg").value = largeImg;
  document.getElementById("title").value = title;
  document.getElementById("author").value = author;
}
async function keySearch(key, id) {
  //https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404
  //?format=json&title=%E5%A4%AA&applicationId=1028750289667141358
  const res = await fetch(
    "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404" +
      "?format=json&title=" +
      key +
      "&applicationId=" +
      id
  );
  const bookInfo = await res.json();
  console.log(bookInfo);
  let register = document.getElementById('register-wrapper2');
  for (let item of bookInfo.Items) {
    const smallImg = item.Item.smallImageUrl;
    const largeImg = item.Item.largeImageUrl;
    const title = item.Item.title;
    const author = item.Item.author;
    const price = item.Item.itemPrice;
    const date = item.Item.salesDate;
    register.innerHTML += ('<div class="book-item2">'
    + '<form action="/new" method="post">'
    + '<a href="#"><img class="book-image" src="'+smallImg+'"/></a>'
    + '<ul>'
    + '<li><div class="book-title"><a href="#">'+title+'</a></div></li>'
    + '<li><div class="book-author"><a href="#">'+author+'</a></div></li>'
    + '</ul>'
    + '<input type="hidden" value="'+title+'"name="title">'
    + '<input type="hidden" value="'+author+'"name="author">'
    + '<input type="hidden" value="'+smallImg+'"name="smallImg">'
    + '<input type="hidden" value="'+largeImg+'"name="largeImg">'
    + '<input class="btn register" type="submit" value="登録" />'
    + '</form'
    + '</div>')
  }
}

function checkRadio() {
  const radio = document.getElementById("search-radio-button");
  if (radio.checked) {
    document.getElementById("search1").style.display = "block";
    document.getElementById("search2").style.display = "none";
    document.getElementById("register-wrapper1").style.display = "block";
    document.getElementById("register-wrapper2").style.display = "none";
  } else {
    document.getElementById("search1").style.display = "none";
    document.getElementById("search2").style.display = "block";
    document.getElementById("register-wrapper1").style.display = "none";
    document.getElementById("register-wrapper2").style.display = "block";
  }
  return radio.checked;
}


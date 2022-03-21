const search = require('./public/search.js');
const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(
    session({
      secret: 'my_secret_key',
      resave: false,
      saveUninitialized: false,
    })
);
app.use((req, res, next)=>{
    if(req.session.username === undefined){
        res.locals.username = 'ゲスト';
        res.locals.isLoggedIn = false;
    }else{
        res.locals.username = req.session.username;
        res.locals.isLoggedIn = true;
    }
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user21',
    password: 'user21pass',
    database: 'works'
});

connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('mysql connection is success.');
  });

//('/')
app.get('/', (req, res)=>{
    res.render('index.ejs');
});

app.post('/', (req, res)=>{
    console.log('email:' + req.body.email);
    console.log('inquire:' + req.body.inquire);
    res.redirect('/');
});

//('/login')
app.get('/login', (req, res)=>{
    res.render('login.ejs', {errors: []});
});

app.post('/login', (req, res)=>{
    const email = req.body.email;
    connection.query(
        'select * from accounts where email=?',
        [email],
        (error, results)=>{
            const errors = [];
            if(results.length > 0){
                const plain = req.body.password;
                const hash = results[0].password;
                bcrypt.compare(plain, hash, (error, isEqual)=>{
                    if(isEqual){
                        console.log('Login is success.')
                        req.session.username = results[0].name;
                        req.session.user_id = results[0].id;
                        res.redirect('/');
                    }else{
                        console.log('Login is failed.');
                        errors.push('ログインに失敗しました。');
                        res.render('login.ejs', {errors: errors});
                    }
                });
            }else{
                console.log('Login is failed.')
                errors.push('登録されていないメールアドレスです。')
                res.render('login.ejs', {errors: errors});
            }
        }
    )
})

//('/account')
app.get('/account', (req, res)=>{
    res.render('account.ejs', {user: [], errors: []});
});

app.post('/account', 
(req, res, next)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const user = {username: username, email: email, password: password};
    const errors = [];
    if(username === ''){
        errors.push('ユーザー名が空です');
    }
    if(email === ''){
        errors.push('メールアドレスが空です');
    }
    if(password === ''){
        errors.push('パスワードが空です');
    }
    if(errors.length > 0){
        res.render('account.ejs', {user: user,errors: errors});
    }else{
        next();
    }
},
(req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const user = {username: username, email: email, password: ''};
    const errors = [];
    connection.query(
      'select * from accounts where email = ?',
      [email],
      (error, results) => {
        if (results.length > 0) {
          errors.push('ユーザー登録に失敗しました');
          res.render('account.ejs', {user: user, errors: errors});  
        } else {
          next(); 
        }
      }
    );
  },
(req, res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (error, hash)=>{
        connection.query(
            'insert into accounts(name, email, password) values(?, ?, ?)',
            [username, email, hash],
            (error, results)=>{
                req.session.username = username;
                res.redirect('/');   
            }
        )
    });
})

//('/logout')
app.get('/logout', (req, res)=>{
    req.session.destroy((error)=>{
        res.redirect('/');
    });
});

//('/e_sentence')
app.get('/e_sentence', (req, res) => {
    connection.query(
      'select * from sentences',
      (error, results) => {
          res.render('sentence.ejs', {sentences: results});
      }
    );
});

//('/e_list')
app.get('/e_list', (req, res)=>{
    connection.query(
        'select * from list',
        (error, results) => {
            res.render('list.ejs', {words: results});
        }
    );
});

//('/e_answer')
app.get('/e_answer', (req, res)=>{
    connection.query(
        'select * from answers',
        (error, results) => {
            res.render('answer.ejs', {answers: results});
        }
      );
});

//('/book')
app.get('/book', (req, res)=>{
    const user_id = req.session.user_id;
    connection.query(
        'select * from books where user_id = ?',
        [user_id],
        (error, results)=>{
            res.render('book.ejs', {books: results});
        }
    )
});

//('/new')
app.get('/new', (req, res)=>{
    res.render('new.ejs', {books: []});
});
app.post('/new', (req, res)=>{
    const user_id = req.session.user_id;
    const smallImg = req.body.smallImg;
    const largeImg = req.body.largeImg;
    const author = req.body.author;
    const title = req.body.title;
    connection.query(
        'insert into books(user_id, smallImg, largeImg, author, title) values(?, ?, ?, ?, ?)',
        [user_id, smallImg, largeImg, author, title],
        (error, results)=>{
            if(error){
                console.log('登録できませんでした。');
                res.redirect('/new');
            }else{
                res.redirect('/book');
            }
        }
    )
});

//('/delete')
app.post('/delete', (req, res)=>{
    const user_id = req.session.user_id;
    const title = req.body.title;
    connection.query(
        'delete from books where user_id=? and title=?',
        [user_id, title],
        (error, results)=>{
            if(error){
                console.log('削除できませんでした。');
                res.redirect('/book');
            }else{
                res.redirect('/book');
            }
        }
    )
})

console.log('The WORKS server starts...');

app.listen(8000);
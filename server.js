const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

var path = require('path');
var FormSchema = require('./db/formSchema')


const morgan = require('morgan');


const app = express()


app.use(express.static(__dirname + '/views'))
app.use('/assets', express.static('views'))

app.engine('handlebars', hbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// middleware configs
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(morgan('dev'))


app.get('/', (req, res) => {
    
    res.sendFile('index.html');
})

app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/views/form.html')
})

app.get('/userform', (req, res) => {
    
    res.render('newuserform', {
        data: JSON.stringify(arr)
    })

})

var arr = []
app.post('/form/:formid', (req, res) => {
    
    arr = []
    
    data = Object.keys(req.body)
    

    for (var i of data) {

        arr.push(JSON.parse(i.split("-")[2]))
    }
    //console.log('Array', arr)
    arr = removeDuplicates(arr, "fname")
    //console.log('Array', arr)


    var formdetail = {
        formid: req.params.formid,
        formdata: arr

    }


    FormSchema.create(formdetail)
        .then(function (f) {
            //console.log('Data inserted Succesfully', f)
            res.render('newuserform', {
                data: JSON.stringify(arr),
                formid: req.params.formid
            })

        }).catch(function (err) {
            //console.log(err)
        })

    //res.render('newuserform', { data: JSON.stringify(arr), formid: req.params.formid })
    //res.render('newuserform')
    //res.redirect('/userform')
})

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}




app.get('/form/:formid', (req, res) => {
    
    FormSchema.findOne({
        formid: req.params.formid
    })
        .then(function (dat) {
            if (!dat) {
                res.render('formexpire',{formexp:'Form Expire'})
            }
            
            res.render('newuserform', {
                data: JSON.stringify(dat.formdata),
                formid: dat.formid
            })
            //res.render('article-edit', { article: data })
        }).catch(function (err) {
           
        })
})




app.put('/form/:formid', (req, res) => {
    
    var formid = req.params.formid;

    var newdata = req.body
    

    var newarr = {}


    for (var key in newdata) {
        var field = JSON.parse(key.split("-")[2]).fname
        var fvalue = newdata[key]
        newarr[field] = fvalue

    }
    

    var formdetail = {

        userfilledformdata: newarr

    }


    

    FormSchema.findOneAndUpdate({
        formid: formid
    }, formdetail)
        .then(function () {
            res.redirect('/thanks')


        }).catch(function (err) {
            console.log(err)
        })

})

app.get('/thanks', (req, res) => {
    res.sendFile(__dirname + '/views/thanks.html')
})

app.get('/api/formdata', (req, res) => {
    FormSchema.find({}).sort('-creationDate').
    then(function(data) {
        res.render('formexpire',{data:data})
        
    }
       ).catch(function (err) {
        console.log(err)
    })
})



// app.use('/articles', articles)

app.all('*', function (req, res) {
    //res.render('errors');
});

// define port
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('The application is up and running on port ', port)
})
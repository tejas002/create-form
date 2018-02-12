var FormSchema = require('./db/formSchema')



module.exports = (app) => {
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

        arr = removeDuplicates(arr, "fname")



        var formdetail = {
            formid: req.params.formid,
            formdata: arr

        }


        FormSchema.create(formdetail)
            .then(function (f) {

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




    app.get('/form/:formid', (req, res) => {

        FormSchema.findOne({
            formid: req.params.formid
        })
            .then(function (dat) {
                if (!dat) {
                    res.render('formexpire', { formexp: 'Form Expire' })
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
            then(function (data) {
                res.render('formexpire', { data: data })

            }
            ).catch(function (err) {
                console.log(err)
            })
    })



    // app.use('/articles', articles)

    app.all('*', function (req, res) {
        //res.render('errors');
    });

}

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
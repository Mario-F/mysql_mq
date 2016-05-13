var x = require("./index");

var xc = new x('test', { database: 'mp_test' });

xc.init(() => {
    //xc.put('Das ist ein TEST!', (err, id) => {
    //    console.log(err);
    //    console.log(id);
    //    //xc.end();    
    //});
    xc.get((err, res) => {
        if(err) console.log(err);
        console.log(res);
        xc.delete(res.id_message, () => {
           if(err) console.log(err);
           xc.end();
        });
    });
});

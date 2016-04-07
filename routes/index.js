/*eslint-env node */
//var fs = require('fs');
var ejs = require("ejs");
var http = require("http");



exports.index = function(req, res){
	ejs.renderFile('./views/index.ejs', function(err, result) {
    				if (!err) {
    					res.end(result);
    				} else {
    					res.end(err);
    				}
    			});
};

exports.image = function(req,res){
var loc = req.param('loc')
var str =new Buffer('');
var lat;
var lng;

http.get("http://maps.googleapis.com/maps/api/geocode/json?address="+loc+"", function(rest) {

    //rest.setEncoding('utf8');
    if(rest.statusCode == 200)
    {
    rest.on('data', function (chunk) {
    	var arrayTemp = JSON.parse(chunk);
        if(typeof arrayTemp['results'][0] != "undefined"){
    		
    	
    	lat =  arrayTemp['results'][0]['geometry']['location']['lat'];
        lng =  arrayTemp['results'][0]['geometry']['location']['lng'];
        
    	
    	http.get("http://maps.googleapis.com/maps/api/streetview?size=400x400&location="+lat+","+lng+"&fov=90&heading=235&pitch=10&key=AIzaSyAIs2WuhHMBZKj31Y9N0-gp2ljBZ2mjU6U", function(resi) {
    		 if(resi.statusCode == 200)
    {
    		resi.on('data', function (chunk1) {
    			str = Buffer.concat([str, chunk1]);
    		});
    		resi.on('end', function () {
    			var basestring=str.toString('base64');
    			ejs.renderFile('./views/image.ejs', {
    				title : "data:image/jpg;base64,"+basestring,
    				longitude : lng,
    				latitude : lat
    				
    			}, function(err, result) {
    				if (!err) {
    					res.end(result);
    				} else {
    					res.end(err);
    				}
    			});
    		});
		}
		else{
			ejs.renderFile('./views/image.ejs', {
    				title : "./images/newapp-icon.png"
    			}, function(err, result) {
    				if (!err) {
    					res.end(result);
    				} else {
    					res.end(err);
    				}
    			});
		}

    		
    	});

}
else{
	ejs.renderFile('./views/image.ejs', {
    				title : "./images/newapp-icon.png"
    			}, function(err, result) {
    				if (!err) {
    					res.end(result);
    				} else {
    					res.end(err);
    				}
    			});
}

   });
}
else{
		ejs.renderFile('./views/image.ejs', {
    				title : "./images/newapp-icon.png"
    			}, function(err, result) {
    				if (!err) {
    					res.end(result);
    				} else {
    					res.end(err);
    				}
    			});
}
});

};



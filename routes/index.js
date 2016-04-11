/*eslint-env node */
//var fs = require('fs');
var ejs = require("ejs");
var http = require("http");
var Cloudant = require('cloudant');
exports.index = function(req, res){
	ejs.renderFile('./views/index.ejs', function(err, result) {
    				if (!err) {
    					res.end(result);
    				} else {
    					res.end(err);
    				}
    			});
};

exports.getPopular = function(req,res){
	var json_data = req.param("item");
	var str =new Buffer('');
	var lat=json_data.latitude;
	var lng=json_data.longitude;
	var arrayTemp = [];	
	var me = "b5e1370d-5032-4e7a-945e-8486709389ae-bluemix"; // Set this to your own account 
	var password = "2f030d5f3576e96defb68e04a6901074f14fda0b6ad3db53722a3ae80b84fe70";
	
	    var cloudant = Cloudant({account:me, password:password});
	    var dbImages = cloudant.db.use('images');	
	    

	http.get("http://maps.googleapis.com/maps/api/streetview?size=250x250&location="+json_data.latitude+","+json_data.longitude+"&fov=90&heading=235&pitch=10&key=AIzaSyAIs2WuhHMBZKj31Y9N0-gp2ljBZ2mjU6U", function(resi) {
		 if(resi.statusCode == 200)
		 {	

		resi.on('data', function (chunk1) {
			str = Buffer.concat([str, chunk1]);
		});
		resi.on('end', function () {
			var basestring=str.toString('base64');
			dbImages.insert({"Longitude":lng,"Latitude":lat,"Place":json_data.name,"Image String":"data:image/jpg;base64,"+basestring  }, function(err1, body, header) {
			      if (err1) {
			        return console.log('[dbImages.insert] ', err1.message);
			      }}
			      );
			res.send({title : "data:image/jpg;base64,"+basestring,
					lng : lng,
					lat : lat,
					loc : json_data.name})
		});
		 }
/*else{
ejs.renderFile('./views/image.ejs', {
				title : "./images/newapp-icon.png",
				lng : "No available longitude",
				lat : "No available latitude",
				loc : loc
			}, function(err, result) {
				if (!err) {
					res.end(result);
				} else {
					res.end(err);
				}
			});
}*/

else{
	res.send({
				title : "./images/newapp-icon.png",
				lng : "No available longitude",
				lat : "No available latitude",
				loc : "Not available"
		});
	}
});
}

exports.image = function(req,res){

	
	
	var loc = req.param('location');
	var str =new Buffer('');
	var lat;
	var lng;
	var arrayTemp = [];																																																																																																																																																																																																																																																																																																																																																																																																									
	http.get("http://maps.googleapis.com/maps/api/geocode/json?address="+loc+"", function(rest) {
	
	    //rest.setEncoding('utf8');
	    if(rest.statusCode == 200)
	    { 
	    	rest.on('data', function (chunk) {
	    	
	    	try 
	    	{
	    		arrayTemp = JSON.parse(chunk);
	    	    if(typeof arrayTemp['results'][0] != "undefined")
	    	    {
			    	lat =  arrayTemp['results'][0]['geometry']['location']['lat'];
			        lng =  arrayTemp['results'][0]['geometry']['location']['lng'];
			        res.send({"lat":lat,"lng":lng,"isDataAvailable":true});
	    	    }
	        } 
	    	catch(e) 
	    	{
	           
	            res.send({"isDataAvailable":false});
	    	}
	    });
	    }
	    });
}



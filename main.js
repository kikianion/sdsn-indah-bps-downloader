const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

fs.unlinkSync("./sdsn1.sqlite3")

const db = new sqlite3.Database('sdsn1.sqlite3');

const sendGetRequest = async () => {
    try {
		
		let allContents=[]
		let size=100
		for(let i=0; i<10000; i++){
			let url = `https://indah-api.bps.go.id/api/standar-data-statistik-nasional?page=${i}&size=${size}`
			const resp = await axios.get(url);
			
			allContents.push(...resp.data.content)
			
			//console.log(resp.data);
			
			let totalElements=+resp.data.totalElements
			//totalElements=totalElements-4450
			
			
			console.log("allContents.length: "+allContents.length+", "+totalElements);

			if(allContents.length>=totalElements) break
		}
		
		fs.writeFileSync(path.resolve(__dirname, 'sdsn1.json'), JSON.stringify(allContents));
		
		let colNames=""
		for (const key in allContents[0]) {
			//console.log(`${key}`);
			colNames+=key+" text,"
		}		
		
		colNames = colNames.slice(0, -1);

		db.serialize(function() {
			db.run('CREATE TABLE sdsn ('+colNames+')');
			let stmt = db.prepare('INSERT INTO sdsn VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)');
			for (let i=0; i<allContents.length; i++) {
				//stmt.run(1,2,3,4,5,6,7,8,9,10,11,12,13);
				var obj =Object.values(allContents[i])
				//console.log(obj)
				stmt.run(...obj);
			}
			stmt.finalize();

			//db.each('SELECT rowid AS id, json_extract(info, \'$.a\') AS info FROM lorem', function(err, row) {
				//console.log(row.id + ": " + row.info);
			//});
		});		
		
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
sendGetRequest();


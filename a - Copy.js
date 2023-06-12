const http =  require("https")
const fs = require('fs');
const path = require('path');



var allContent=[]

const getJson=async (page,size)=>{
	
	let url = `https://indah-api.bps.go.id/api/standar-data-statistik-nasional?page=${page}&size=${size}`
	
	await http.get(url, res => {

		let rawData = ''

		res.on('data', chunk => {
			rawData += chunk
		})
		
		res.on('end', () => {
			const parsedData = JSON.parse(rawData)
			
			console.log('done '+allContent.length)
			//console.log(parsedData.content.length)
			
			console.log(allContent)
			allContent.push(...parsedData.content)
			
			//if(allContent.length < +parsedData.totalElements || allContent.length < 3){
			//if(allContent.length < 3){
			//	getJson()
			//}
		})
	})
}

for(let i=0; i<3; i++){
	getJson(i,10)
}
console.log(allContent)
fs.writeFileSync(path.resolve(__dirname, 'sdsn1.json'), JSON.stringify(allContent));



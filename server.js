const express = require('express')
const bp = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mon = require('mongoose')


app.use(express.static(__dirname))
app.use(bp.json())
app.use(bp.urlencoded({extended: false}))

const dbUrl = 'mongodb://tykki:mikki1@ds217671.mlab.com:17671/live-chat'

const Message = mon.model('Message', {
	name: String,
	message: String
})

app.get('/messages', (req, res) => {
	let user = req.params.user
	Message.find({name: user}, (err, mess) => {
		res.send(mess)
		
	})
})

app.post('/messages', async(req, res) => {

	try{
		throw 'some error'
	let message = new Message(req.body)

	let savedMess = message.save()
	console.log('saved')
	let censored = await Message.findOne({message: 'sucks'})

	if(censored){
		console.log('censored words found', censored)
		await Message.remove({_id: censored.id})
	}
	else
		io.emit('message', req.body)
	res.sendStatus(200)
	} catch(err){
		res.sendStatus(500)
		return console.error(err)
		
	} finally{
		// logger.log('message')
	}
})

io.on('connection', socket => console.log('user connected'))

mon.connect(dbUrl, err=> console.log('mongo db connection', err))

var server = http.listen(3000, ()=>{
	console.log('server is listening on port', server.address().port)
})
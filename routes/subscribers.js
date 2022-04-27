const express = require('express')
const subscriber = require('../model/subscriber')
const router = express.Router()
const Subscriber = require('../model/subscriber')

//getting all subscribers
router.get('/', async (req,res)=>{
    try{
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    }catch (err){
        //500 - DB has an error
        res.status(500).json({message: err.message})
    }
})

//getting one
router.get('/:id', getSubscriber ,(req, res) => {
    res.json(res.subscriber)
})

//create one
router.post('/', async(req, res) => {
    //create the JS object
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try{
        const newSubscriber = await subscriber.save()
        //201 -> Created in DB
        res.status(201).json(newSubscriber)
    } catch (err){
        //400 -> user input error
        res.status(400).json({ message: err.message })
    }
})

//update one
router.patch('/:id', getSubscriber ,async (req, res) => {
    //we need to only patch up the required fields 
    if(req.body.name != null){
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }

    try{
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch(err){
       res.status(400).json({ message: err.message })
    }
})

//delete one
router.delete('/:id', getSubscriber ,async (req, res) => {
    try{
        await res.subscriber.remove()
        res.json({ message: 'Deleted subscriber' })
    } catch(err){
        res.status(500).json({ message: err.message })
    }
})

//middleware to handle empty subscribers for the endpoints that has ID as a parameter
async function getSubscriber(req, res, next){
    let subscriber

    try{
        subscriber = await Subscriber.findById(req.params.id)
        //checking if the subscriber exists
        if(subscriber == null){
            return res.status(404).json({ message: 'Cannot find subscriber' })
        }
    } catch (err){
        return res.status(500).json({ message: err.message })
    }

    res.subscriber = subscriber

    //If the subscriber exists then move on with the relevent endpoint
    next()
}

module.exports = router
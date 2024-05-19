let mongoose=require('mongoose')

let dataschema=mongoose.Schema({
	adminUser: {type: String,required: true},
    	activityDetails : {type:String,required:true},
	nameOfActivity : {type:String,required:true},
	academicYear:{type:String,required:true},
	startDateOfActivityHeld : {type:String,required:true},
	endDateOfActivityHeld : {type:String,required:true},
	time :{type:String,required:true},
	noOfDays : {type:String,required:true},
	typeOfActivity : {type:String,required:true},
	resourcePerson : {type:String,required:true},
	detailsOfResourcePerson : {type:String,required:true},
	yearClass :{type:String,required:true},
	noOfStudents : {type:String,required:true},
	activityIncharge : {type:String,required:true},
	photo : {type:String},
	descriptionOfActivity : {type:String}
})

dataschema.index({ nameOfActivity: 'text' });
let pageModel=mongoose.model('Event', dataschema)

module.exports=pageModel
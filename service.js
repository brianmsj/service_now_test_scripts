function onChange(control, oldValue, newValue, isLoading, isTemplate) {
   if (isLoading || newValue === '')
      return;

   var maxDuration = g_form.getIntValue('max_duration');

   if (maxDuration < 5 || maxDuration > 30 * 24 * 60 * 60) {
      g_form.showFieldMsg('max_duration', getMessage('The maximum duration must be between 5 and 2,592,000 seconds (30 days)'), 'error');
   }
}

//script to hide passcode for medical customer then create new glide record.
function onCondition() {
var gr = g_form.getControl('u_patient_name');
var gt = g_form.getControl('u_patient_number');
gr.type="string";
gt.type="string";
var patient = g_form.getValue('u_patient_name');
var patientNumber = g_form.getValue('u_patient_number');
var recordNumber = g_form.getValue('number');
var date = new Date();
var record = new GlideRecord('u_incident_decryptions');
var user = g_user.getFullName();
record.initialize();
record.setValue('u_patient',patient);
record.setValue('u_record_number', patientNumber);
record.setValue('u_incident_number',recordNumber);
record.setValue('u_user',user);
record.setValue('u_date',date);
record.insert();

}

function getUser() {
   var user = g_user.getFullName()
   return user
}

function skillsAssess() {
   g_user.getSkills('skillsassment','addtoField')
}

(function executeUIAction(current, previous) {
var cost = 0;
var budget = parseFloat(current.budget.getCurrencyValue());
var mrkevent = current.sys_id;
var evtname = current.name;
//Get the total cost of all equipment for this event
var equipment = new GlideRecord('x_snc_marketing_ev_equipment_request');
equipment.addQuery('marketing_event', mrkevent);
equipment.query();
while(equipment.next()){
cost = cost + parseFloat(equipment.cost.getCurrencyValue());
}
//Display cost and budget error
gs.addInfoMessage('The total cost of ' + evtname + ' is ' + cost + '.');
if(cost > budget){
gs.addErrorMessage('Equipment costs for ' + evtname + ' exceed the event budget.');
}
action.setRedirectURL(current);
}(current, typeof previous != 'undefined' ? previous : null));


//this is the script to change the error message on the marketing event forms
function onSubmit() {
   if(g_form.getValue('end_date') == '')
	   return;
   if(g_form.getValue('end_date') < g_form.getValue('start_date')) {
	    g_form.clearMessages();
	
	g_form.addErrorMessage(g_form.getLabelOf('end_date') + ' ' + 
		 getMessage('must be after') + ' ' + g_form.getLabelOf('start_date'));
		 return false;
	
	}
   
}
//Business rule script to evalute the budgetcost vs the equipment cost
(function executeRule(current, previous /*null when async*/) {
 var cost = 0;
 var budget = current.budget;
 var mrkevent = current.sys_id;
 var evtname = current.name;
 // Get the total cost of all equipment for this event
 var equipment =  new GlideRecord('x_145748_marketing_equipment_request');
 equipment.addQuery('marketing_event', mrkevent);
 equipment.query();
 while(equipment.next()) {
	 cost = cost + parseFloat(equipment.cost.getCurrencyValue());
 }
 gs.addInfoMessage('The total cost of ' + evtname + ' is ' + cost + '.');
	if(cost > budget) {
		gs.addErrorMessage('Equipment costs for ' + evtname + ' exceed the event budget.');
	}

})(current, previous);

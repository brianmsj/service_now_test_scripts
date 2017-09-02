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

//event business rule script

(function executeRule(current, previous /*null when async*/) {
 //This function will be automatically called when this rule is processed.
      //Add event when attendee inserted
      if(current.operation() == 'insert' && current.marketing_event.changes()) {
              gs.eventQueue('x_snc_marketing_ev.attendee.added', current,
current.marketing_event, current.email);
      }
      //Add event when marketing event changes
      if(current.operation() == 'update' && current.marketing_event.changes()) {
              gs.eventQueue('x_snc_marketing_ev.attendee.deleted', previous,
previous.marketing_event, previous.email);
              gs.eventQueue('x_snc_marketing_ev.attendee.added', current,
current.marketing_event, current.email);
      }
      //Add event when attendee deleted
      if(current.operation() == 'delete') {
              gs.eventQueue('x_snc_marketing_ev.attendee.deleted', current,
            current.marketing_event, current.email);
}
})(current, previous);

// Client side onclick function
function reopenIncident(){
   if (g_form.getValue('comments') == '') {
      // Remove any existing field message, set comments mandatory, and show a new field message
      try {
         g_form.hideFieldMsg('comments');
      } catch(e) {}
      g_form.setMandatory('comments', true);
      g_form.showFieldMsg('comments', getMessage('Please enter a comment when reopening an Incident'), 'error');
      return false;  // Abort submission
   }
   // Call the UI Action and skip the 'onclick' function
   gsftSubmit(null, g_form.getFormElement(), 'reopen_incident'); // MUST call the 'Action name' set in this UI Action
}

// Code that runs without 'onclick'
// Ensure call to server side function with no browser errors
if (typeof window == 'undefined')
   serverReopen();

function serverReopen() {
   // Set Incident state to active, update and reload the record
   current.incident_state = 2;
   current.update();
   gs.addInfoMessage(gs.getMessage("Incident reopened"));
   action.setRedirectURL(current);
}
cascadeComment();

function cascadeComment(){

 var cmt = current.comments;
 var inc = new GlideRecord("incident");
 inc.addQuery("parent", "=", current.sys_id);
 inc.query();
   while (inc.next()) {
    inc.comments = cmt;
    inc.incident_state.setValue( 7);
    inc.active.setValue(false);
    inc.update();
    gs.print("Incident " + inc.number + " closed based on closure of incident " + current.number);
   }
}

//Create multiple new records with Glide Record
var newIncidents = []
var counter = 1
var incidentGR = new GlideRecord('incident')
while(counter <= 5) {
  incidentGR.newRecord();
  incidentGR.short_description = "Incident #" + counter;
  counter++
  newIncidents.push(incidentGR.insert())
}
gs.print(newIncidents)

var hive = new GlideRecord('u_highmetric_hive')
addQuery('priority')
query();
while(hive.next())

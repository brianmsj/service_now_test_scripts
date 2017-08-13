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

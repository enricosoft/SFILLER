SFILLER.JS v0.1 (status: DRAFT)
Fill web forms using the voice
***************************************

WHAT IT MUST DO:
- Fill web forms using the voice (speech)

WHEN IT'S USEFUL:
- on mobile devices or when a user can't write

FEATURES:
- totally written using javascript (no jquery)
- it uses HTML5 API for the speech recognition
- OOP plugin
- at the moment it works only with common html elements like "input" (text,checkbox,radio,button) and "select"


HOW IT WORKS:
- map all form fields with the "speech-text" attribute where you write inside what you wanna ask to user
- the plugin will read each form's fields and wait for a voice response from user
- If the text recognized from the user's speech is not empty, in some cases this text will be checked with a list of values to verify if it's correct, otherwise it will return an error
	. input-text = always ok (tmp)
	. input-checkbox = yes or no
	. radio group = compare the values of the radio's labels
	. select = compare the values of the non-empty options
- When all fields will be filled, if the last element is a input.button with onclick attribute and you will answer "yes" to the filler's question, it will run the onclick of that button (sending form to the server for ex.)


NOTES:
- IF YOU WANT THAT CHROME DOESN'T ASK ALL TIMES THE MICROPHONE PERMISSIONS, YOU MUST RUN THE WEBSITE USING SSL (https)
- If an input.radio or select fields have a lot of options to list inside the modal, the options will not be listed (there's a "maxOptInList" parameter to pass to the "start" function that corresponds to the limit value)
- EXECUTE THIS PAGE ALWAYS THROUGHT A WEBSERVER (ALSO IN LOCAL), OTHERWISE IT DOESN'T WORK


FUTURE DEVELOPMENT:
- Make a better base code for the plugin (now it's a DRAFT)
- input.text fields validation using regEx
- extend sfiller to manage also the html fields that are initializated using jquery plugins (or 3rd parties plugins)
- in case of error during the speech recognition, ask again for an user speech input



If you wanna contribute to the development of this plugin, please write me :)


SFILLER.JS v0.1 (stato: BOZZA)
Compila i web form utilizzando la voce
***************************************

COSA DEVE FARE:
- Compilare un form usando la voce

QUANDO E' MOLTO UTILE:
- su device mobili e per chi fa fatica a scrivere con la tastiera o non può scrivere

CARATTERISTICHE:
- scritto totalmente in javascript (no jquery)
- utilizzerà le API HTML5 per lo speech
- OOP plugin
- per ora funziona solo con elementi html comuni "input" (text,checkbox,radio,button) e "select"


FUNZIONAMENTO:
- mappare i campi del form interessati con l'attributo "speech-text" dove al suo interno scriverai cosa deve chiedere
- Il plugin leggerà uno alla volta i campi del form e per ogni campo letto attenderà un valore dall'utente
- Per far capire all'utente il valore che vuole ottenere, proporrà una modale con scritto il valore dell'attributo "speech-text"
- Se il valore dettato dall'utente non è vuoto e, solo per certi casi, corrisponde ai valori presenti nella lista verrà accettato, altrimenti darà errore (tmp) 
	. input-text = va sempre bene (tmp)
	. input-checkbox = si o no
	. radio group = confronta con i valori delle label associate
	. select = confronta con i valori delle options con value non vuoto
- una volta che tutti i campi saranno compilati, se l'ultimo campo mappato è proprio un button, se tu risponderai "si", eseguirà l'onclick associato a quel button


NOTE:
- SE VUOI CHE CHROME NON TI CHIEDA SEMPRE IL PERMESSO DI ACCEDERE AL MIC, DEVI USARE L'HTTPS E SE LO RICORDERA'
- Se un campo input.radio o select ha troppe possibili ozioni da elencare nella modale, le opzioni non vengono elencate (c'è una variabile "maxOptInList" della funzione "start" che indica il valore limite)
- ESEGUIRE LA PAGINA SEMPRE TRAMITE UN WEBSERVER (ANCHE IN LOCALE), ALTRIMENTI NON FUNZIONA


SVILUPPI FUTURI:
- Perfezionare il plugin stesso (ora è in stato di BOZZA)
- Aggiungere controllo dei valori input text tramite delle regex
- estendere sfiller in modo da poter gestire anche campi html inizializzati con dei plugin jquery
- in caso di errore, richiedere il valore all'utente



Se vuole contribuire allo sviluppo di questo plugin, contattatemi pure :)
//*********************************
// PLUGIN: sfiller.js 
// Version: 0.1
// Description: Fill web forms using the voice
// Author: Enrico Piccini
// Website: http://enricopiccini.com
// Date: 21/12/13
// Status: DRAFT
//**********************************

var sfiller = {
    // private variables
    _elms: null,
    _modal: null,
    _speechEngine: null,

    // public functions
    init: function (selector) {
        this._elms = this._getElms(selector);

        // Add a div for question modal
        var divModal = document.createElement('div')
        divModal.id = 'divSfillerModal';
        divModal.className = 'sfillerModal';
        divModal.style.display = 'none';
        divModal.innerHTML = '<div class="mic-container" style="display:none;"><div class="mic center"></div><div class="pulse center"></div></div><div class="content"></div>';
        if (!document.querySelector('#divSfillerModal'))
            document.body.appendChild(divModal);
        this._modal = document.querySelector('.sfillerModal .content');

        // Init the base speech recognitor
        if ('webkitSpeechRecognition' in window) {
            this._speechEngine = new webkitSpeechRecognition();
            this._speechEngine.continuous = false;
            this._speechEngine.interimResults = false;
        }

        // To make this chainable if necessary
        return this;
    },
    startFill: function (lang, maxOptInList) {

        _queue = [];
        for (var i = 0; i < this._elms.length; i++) {

            // Get the text and show it in modal (with options if there are and don't exceed the max number)
            var _el = this._elms[i];
            var _opt = [];

            var _labels = [];
            // Check 1: get all radio input by name
            if (_el.getAttribute('type') === 'radio' && _el.getAttribute('name'))
                _labels = document.querySelectorAll('[name=' + _el.getAttribute('name') + '] + label');

            // Check 2: get all select options
            if (_el.nodeName === 'SELECT')
                _labels = _el.querySelectorAll('option:not([value=""])');

            // Check 3: for the checkbox\button the option are always "Yes" or "No"
            if (_el.getAttribute('type') === 'checkbox' || _el.getAttribute('type') === 'button') {
                _opt.push(lang.toLowerCase() === 'it' ? 'Si' : 'Yes');
                _opt.push('No');
            }

            // Prevent too long lists
            if (_labels.length > maxOptInList)
                _labels = [];
            for (var x = 0; x < _labels.length; x++) {
                _opt.push(_labels[x].innerText);
            }

            // Put the functions to call in a queue
            this._loader.push(this._showModal, this, [_el.getAttribute('speech-text'), _opt, lang, _el]);
        }
        //run the first function
        this._loader.run();
    },

    // private functions
    _getElms: function (selector) {
        var _elms = new Object();
        if (selector) {
            // Single selector
            if (selector[0] === '#') {
                // If my element contains the "speech-text" attribute or contains children that have that attr, is ok
                var _tmp = document.querySelector(selector);
                if (_tmp) {
                    if (!_tmp.getAttribute('speech-text'))
                        _elms = _tmp.querySelectorAll('[speech-text]');
                    else
                        _elms[0] = _tmp;
                }
            }
            else
                _elms = document.querySelectorAll(selector + '[speech-text]');
        }
        return _elms;
    },
    _showModal: function (question, options, lang, origEl) {
        // Display the modal with the question and wait for user input using speech
        if (this._modal) {
            // Show the modal if is still hidden
            if (this._modal.parentNode.style.display === 'none')
                this._modal.parentNode.style.display = 'block';

            // Fill the modal with text and adjust the font size to fill the container
            var _tmpHtml = '<div>' + question + '<br/><br/><ul>';
            for (var i = 0; i < options.length; i++) {
                _tmpHtml += '<li>' + options[i] + '</li>';
            }
            _tmpHtml += '</ul></div>';
            this._modal.innerHTML = _tmpHtml;
            this._adjustFontSize();


            // Wait for user response using speech (when it's done, set the value into the input\select and call the next question modal)                    
            this._speech(lang, function (returnText) {

                var _nodeName = origEl.nodeName;
                var boolTextFound = false;

                switch (_nodeName) {
                    case 'INPUT':

                        var _nodeType = origEl.type;

                        // Radio
                        if (_nodeType === 'radio') {
                            var _radios = document.querySelectorAll('[name=' + origEl.getAttribute('name') + ']');
                            for (var i = 0; i < _radios.length; i++) {
                                // Get the label
                                var _label = document.querySelector('label[for=' + _radios[i].id + ']');
                                if (_label) {
                                    if (_label.innerText === returnText) {
                                        boolTextFound = true;
                                        _radios[i].checked = true;
                                    }
                                }
                            }
                        }

                        // Button
                        if (_nodeType === 'button' && (returnText === 'Yes' || returnText === 'Si' || returnText === 'Sì')) {
                            try {
                                /*
                                var evObj = document.createEvent('Events');
                                evObj.initEvent('click', true, false);
                                el.dispatchEvent(origEl);
                                */
                                origEl.click();
                                boolTextFound = true;
                            } catch (ex) { }
                        }

                        // Checkbox
                        if (_nodeType === 'checkbox') {
                            var _chkRes = (returnText === 'Yes' || returnText === 'Si' || returnText === 'Sì') ? true : (returnText === 'No' ? false : null);
                            if (_chkRes != null) {
                                origEl.checked = _chkRes;
                                boolTextFound = true;
                            }
                        }

                        // Text
                        if (_nodeType === 'text') {
                            boolTextFound = true;
                            origEl.value = returnText;
                        }

                        break;

                    case 'SELECT':

                        var _allOpts = origEl.querySelectorAll('option');
                        for (var i = 0; i < _allOpts.length; i++) {
                            if (_allOpts[i].innerHTML === returnText) {
                                // get the value to check and set found = true
                                boolTextFound = true;
                                origEl.value = _allOpts[i].value;
                                break;
                            }
                        }

                        break;
                }

                // Run the next function if the speech text is ok
                if (boolTextFound)
                    sfiller._loader.run();
                else {
                    alert("I don't understand, repeat please");
                    // ....

                    // TMP
                    sfiller._loader.run();
                }
            });
        }
    },
    _loader: {
        queue: [],
        push: function (fn, scope, params) {
            this.queue.push(function () { fn.apply(scope || window, params || []); });
        },
        run: function () {
            if (this.queue.length)
                this.queue.shift().call();
            else
                sfiller._modal.parentNode.style.display = 'none';
        }
    },
    _adjustFontSize: function () {

        var _parent = this._modal;
        var _txt = this._modal.querySelector('div');

        // increse the font-size and check if the inner div is bigger than the parent
        var _currFontSize = parseInt(getComputedStyle(_txt, null).fontSize);
        if (_parent && _txt) {
            var _containerHeight = _parent.clientHeight - parseInt(getComputedStyle(_parent, null).paddingTop) - parseInt(getComputedStyle(_parent, null).paddingBottom);
            var _containerWidth = _parent.clientWidth - parseInt(getComputedStyle(_parent, null).paddingLeft) - parseInt(getComputedStyle(_parent, null).paddingRight);
            while (_txt.clientHeight < _containerHeight && _txt.clientWidth <= _containerWidth) {
                _currFontSize += 1;
                _txt.style.fontSize = _currFontSize + 'px';
            }
            // Double check to be sure that the text is fully contained\visible inside the div
            while (_txt.clientHeight > _containerHeight || _txt.clientWidth > _containerWidth) {
                _txt.style.fontSize = (parseInt(_txt.style.fontSize) - 1) + 'px';
            }
        }
    },
    _speech: function (lang, returnTextFunct) {

        var final_transcript = '';
        var recognizing = false;

        this._speechEngine.onstart = function () {
            recognizing = true;
            //animate the mic icon
            document.querySelector('.mic-container').style.display = '';
        };

        this._speechEngine.onerror = function (event) {
            alert('Error');
        };

        this._speechEngine.onend = function () {
            recognizing = false;

            // stops the MIC animated icon
            document.querySelector('.mic-container').style.display = 'none';

            // Call the function that returns the final text
            returnTextFunct(final_transcript);
        };

        this._speechEngine.onresult = function (event) {
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            final_transcript = linebreak(capitalize(final_transcript));

            //stop();
        };

        var two_line = /\n\n/g;
        var one_line = /\n/g;
        var linebreak = function (s) {
            return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
        };

        var first_char = /\S/;
        var capitalize = function (s) {
            return s.replace(first_char, function (m) { return m.toUpperCase(); });
        };

        /*
        var stop = function () {
            if (recognizing) {
                recognizing = false;
                this._speechEngine.stop();
            }
        };
        */

        // Automatic start
        if (recognizing) {
            this._speechEngine.stop();
            return;
        }
        final_transcript = '';
        this._speechEngine.lang = lang;
        this._speechEngine.start();

    }
};
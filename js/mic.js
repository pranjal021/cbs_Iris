class Mic {
    constructor(resultReceiver) {
        this.langs = [
            ['English (India)', 'en-IN'],
            ['Hindi', 'hi-IN']
        ];

        this.final_transcript = '';
        this.current_transcript = '';
        this.recognition = null;
        this.compatible = false;
        this.listening = false;
        this.languageSelector = null;
        this.currentLanguage = this.langs[0][1];
        this.resultReceiver = resultReceiver;
    }
 
    static capitalize(s) {
        let first_char = /\S/;
        return s.replace(first_char, function (m) { return m.toUpperCase(); });
    }

    static checkCompatibility() {
        return 'webkitSpeechRecognition' in window ||
            'SpeechRecognition' in window;
    }

    setupRecognitionHandlers() {
        if (!this.recognition) {
            console.log("Recognition not set up. This should not happen.");
            return;
        }
        this.recognition.onstart = () => {
            this.listening = true;
        };
        this.recognition.onerror = (event) => {
            console.log("recognition says: wtf " + event.error);
        };
        this.recognition.onend = () => {
            if (this.listening && this.recognition !== undefined) {
                console.log('restarting mic')
                this.recognition.start();
            }
        };
        this.recognition.onresult = (event) => {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    this.current_transcript = event.results[i][0].transcript;
                    
                }
            }
            console.log('mic says:', this.current_transcript.toLowerCase())
            this.resultReceiver(this.current_transcript.toLowerCase())

        };
    }

    setupMic(resultReceiver) {
        this.resultReceiver = resultReceiver
    }

    setLang(lang) {
        if (lang == 'en') this.currentLanguage = 'en-IN';
        else if (lang == 'hi') this.currentLanguage = 'hi-IN';
    }

    micClicked(event) {
        if (this.listening) {
            this.stopListening();
            return;
        }
        try {
            if (en == 1) this.setLang('en');
            else if (hi == 1) this.setLang('hi');
        } catch (e) { }
        this.startListening();
    }


    startListening() {
        if (!this.recognition) {
            this.recognition = new webkitSpeechRecognition();
            this.setupRecognitionHandlers();
        }
        this.listening = true;
        this.final_transcript = '';
        this.recognition.lang = this.currentLanguage;
        this.recognition.start();
    }

    stopListening() {
        if (this.recognition)
            this.listening = false;
        this.recognition = null;
    }

}



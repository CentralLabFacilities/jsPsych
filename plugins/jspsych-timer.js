/**
 * jspsych-timer
 * plugin for displaying a countdown timer for pauses during experiments
 * Phillip Lücking
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins['timer'] = (function() { 

  var plugin = {};

  plugin.info = {
    name: 'timer',
    description: '',
    parameters: {
      func: {
        type: [jsPsych.plugins.parameterType.FUNCTION],
        default: undefined,
        no_function: false,
        description: ''
      },
      seconds: {
        type: [jsPsych.plugins.parameterType.INT],
        default: -1,
        no_function: false,
        description: ''
      }
    }
  }
  
  plugin.trial = function(display_element, trial) {

    // a rare case where we override the default experiment level
    // value of this parameter, since this plugin should be invisible
    // to the subject of the experiment
    trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial
    trial.seconds = trial.seconds || -1;

    var count=trial.seconds;  
    var counter=setInterval(timer, 1000)

    display_element.innerHTML = 'Kurze Pause! Es geht weiter in <br><span id="timer"></span>'
    document.getElementById("timer").innerHTML=count + " Sekunden."
    
    var end_trial = function() {
        jsPsych.finishTrial(trial_data);
    }

    function timer()
    {
        count=count-1;
        if (count <= 0)
        {
            clearInterval(counter);
            console.log("finished")//counter ended, do something here
            end_trial();
            return;
        }
        document.getElementById("timer").innerHTML=count + " Sekunden.";
    }

    var return_val = 0; 

    var trial_data = {
      value: return_val
    };    


    
  };

  return plugin;
})();

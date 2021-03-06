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
      timing_response: {
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
    trial.timing_response = trial.timing_response || -1;

    display_element.innerHTML = '<span id="timer"></span>'
    
    var count=trial.timing_response;  
    var counter=setInterval(timer, 1000)

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
        document.getElementById("timer").innerHTML=count + " secs";
    }

    var return_val = trial.func();
    console.log(return_val)
    var counter=setInterval(trial.func(), 1000); //1000 will  run it every 1 second

    var trial_data = {
      value: return_val
    };    


    
  };

  return plugin;
})();

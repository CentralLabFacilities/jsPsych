/**
 * jspsych-citk-single-stim
 * Phillip Luecking
 * Josh de Leeuw
 * 
 * plugin for displaying a stimulus and getting a keyboard response adjusted to interface with the citk to allow robot behavior. 
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["citk-single-stim"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('citk-single-stim', 'stimulus', 'image', function(t){ return !t.is_html || t.is_html == 'undefined'});

  plugin.info = {
    name: 'citk-single-stim',
    description: '',
    parameters: {
      stimulus: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: undefined,
        no_function: false,
        description: ''
      },
      stim_pre: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: undefined,
        no_function: false,
        description: ''
      },
      stim_correct: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: undefined,
        no_function: false,
        description: ''
      },
      stim_incorrect: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: undefined,
        no_function: false,
        description: ''
      },
      offset_y: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: undefined,
        no_function: false,
        description: ''
      },
      is_html: {
        type: [jsPsych.plugins.parameterType.BOOL],
        default: false,
        no_function: false,
        description: ''
      },
      choices: {
        type: [jsPsych.plugins.parameterType.KEYCODE],
        array: true,
        default: jsPsych.ALL_KEYS,
        no_function: false,
        description: ''
      },
      prompt: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: '',
        no_function: false,
        description: ''
      },
      robot_err: {
        type: [jsPsych.plugins.parameterType.FLOAT],
        default: '',
        no_function: false,
        description: ''
      },
      timing_fixation: {
        type: [jsPsych.plugins.parameterType.INT],
        default: -1,
        no_function: false,
        description: ''
      },
      timing_stim: {
        type: [jsPsych.plugins.parameterType.INT],
        default: -1,
        no_function: false,
        description: ''
      },
      timing_response: {
        type: [jsPsych.plugins.parameterType.INT],
        default: -1,
        no_function: false,
        description: ''
      },
      timing_result: {
        type: [jsPsych.plugins.parameterType.INT],
        default: -1,
        no_function: false,
        description: ''
      },
      response_ends_trial: {
        type: [jsPsych.plugins.parameterType.BOOL],
        default: true,
        no_function: false,
        description: ''
      },

    }
  }

  plugin.trial = async function(display_element, trial) {

    function sleep(ms) {
       return new Promise(resolve => setTimeout(resolve, ms));
    }

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set default values for the parameters
    trial.choices = trial.choices || jsPsych.ALL_KEYS;
    trial.response_ends_trial = (typeof trial.response_ends_trial == 'undefined') ? true : trial.response_ends_trial;
    trial.robot_err = trial.robot_err || -1.0;
    trial.timing_fixation = trial.timing_fixation || -1;
    trial.timing_stim = trial.timing_stim || -1;
    trial.timing_response = trial.timing_response || -1;
    trial.timing_result = trial.timing_result || -1;
    trial.is_html = (typeof trial.is_html == 'undefined') ? false : trial.is_html;
    trial.prompt = trial.prompt || "";

    var fix_pt = '<img src="'+trial.stim_pre+'" id="jspsych-citk-single-stim-fix"></img>';
    var correct_pt = '<img src="'+trial.stim_correct+'" id="jspsych-citk-single-stim-correct"></img>';
    var incorrect_pt = '<img src="'+trial.stim_incorrect+'" id="jspsych-citk-single-stim-incorrect"></img>';
    
    var new_html = '';
    // display stimulus
    if (!trial.is_html) {
      new_html = '<img src="'+trial.stimulus+'" id="jspsych-citk-single-stim-stimulus-'+trial.offset_y+'"></img>';
    } else {
      new_html = '<div id="jspsych-single-stim-stimulus">'+trial.stimulus+'</div>';
    }
    // add prompt
    new_html += trial.prompt;
    
    //first, draw a fixation point
    display_element.innerHTML = fix_pt;

    // draw stimuli
    jsPsych.pluginAPI.setTimeout(function() {
        display_element.innerHTML += new_html;
    }, trial.timing_fixation);

    // store response
    var response = {
      rt: -1,
      key: -1
    };

    // function to end trial when it is time
    var end_trial = async function() {
    
        function sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        }

        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
            jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }

        var robot_rt = -1
        if (trial.data.response == 'no-go' || ((response.rt-250) > -1  && robot_error)) {
            robot_rt = waitfor
        }

        // gather the data to store for the trial
        var trial_data = {
            "rt": response.rt-trial.timing_fixation, //subtract the time the fixation dot appears at the beginning.
            "stimulus": trial.stimulus,
            "key_press": response.key,
            "offset": trial.offset_y,
            "robot_rt": robot_rt,
            "robot_error": robot_error
        };

        // display correct/incorrect
        if(trial.timing_result > 0) {
            display_element.innerHTML = incorrect_pt;
            if(trial.data.response == 'go' && trial_data.rt > -1){
                display_element.innerHTML = correct_pt;
            } else if(trial.data.response == 'no-go' && trial_data.rt == -251){
                display_element.innerHTML = correct_pt;
            }
            await sleep(trial.timing_result); //just wait 
        }
        display_element.innerHTML = '';
        // move on to the next trial
        jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector("[id^='jspsych-citk-single-stim-stimulus']").className += ' responded';
      // only record the first response
      if (response.key == -1) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide image if timing is set
    if (trial.timing_stim > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        //substitute by wildcard
        display_element.querySelector("[id^='jspsych-citk-single-stim-stimulus']").style.visibility = 'hidden';
      }, trial.timing_stim+trial.timing_fixation);
    }
       
    var robot_response_time = function() {
        return Math.floor( Math.random() * (500-300) ) + 300; //robot reaction time will be between 300 and 500ms
    }
    
    var robot_error = false
    var err = Math.random(); 
    var waitfor = robot_response_time()
    
    if(trial.data.response === 'go' && err <= trial.robot_err) {
        robot_error = true
    }
    
    if(trial.data.response === 'no-go' || robot_error) {
        await sleep(waitfor);
        jsPsych.plugins['naoqi-interface'].sendRequest("press")
        jsPsych.plugins['naoqi-interface'].sendRequest("release")
        jsPsych.pluginAPI.setTimeout(function() {
            end_trial();
        }, waitfor+trial.timing_stim+trial.timing_fixation);
    }
        
    // end trial if time limit is set
    if (trial.data.response === 'go' && trial.timing_response > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.timing_response+trial.timing_stim+trial.timing_fixation);
    }

  };

  return plugin;
})();

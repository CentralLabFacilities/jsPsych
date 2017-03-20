/* jspsych-citk.js
 * Phillip Luecking
 *
 * This plugin is used for communication with the cognitive interaction toolkit. 
 * It allows to trigger an experiment ('job') on the toolkit's jenkins server and 
 * subsequently displays information from the executed experiment.
 *
 * documentation: docs.jspsych.org
 */

jsPsych.plugins['citk'] = (function() {
        
    var plugin = {};

    plugin.info = {
    name: 'citk',
    description: '',
    parameters: {
        joblist: {
            type: [jsPsych.plugins.parameterType.STRING],
            array: true,
            default: undefined,
            no_function: false,
            description: ''
        },
        proxy: {
            type: [jsPsych.plugins.parameterType.STRING],
            array: false,
            default: undefined,
            no_function: false,
            description: ''
        },
        method: {
            type: [jsPsych.plugins.parameterType.STRING],
            array: false,
            default: undefined,
            no_function: false,
            description: ''
        },
        args: {
            type: [jsPsych.plugins.parameterType.STRING],
            array: true,
            default: undefined,
            no_function: false,
            description: ''
        },
        service_url: {
            type: [jsPsych.plugins.parameterType.STRING],
            default: undefined,
            no_function: false,
            description: ''
        },
        service_port: {
            type: [jsPsych.plugins.parameterType.INT],
            default: 5000,
            no_function: false,
            description: ''
        },
        stream_url: {
            type: [jsPsych.plugins.parameterType.STRING],
            default: 'localhost',
            no_function: false,
            description: ''
        },
        stream_port: {
            type: [jsPsych.plugins.parameterType.INT],
            default: '8080',
            no_function: false,
            description: ''
        },
        stream_topic: {
            type: [jsPsych.plugins.parameterType.STRING],
            default: '/jrd/image_raw',
            no_function: false,
            description: ''
        }
      }
    }
  
    var params;
  
    plugin.preload = function(parameters) {
        params = parameters; 
    }
    
    plugin.getvar = function() {
        return params;
    }
    
    plugin.sendRequest = async function(method) {
        function sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        
        var proxy = "ALMotion"
        var job_request = "http://"+params.service_url+":"+params.service_port+"/do/"+proxy;
        
        var request = {}
        
        if(method === "press") {
            request = this.keyPressEvent();
        }
        
        if(method === "release") {
            request = this.keyReleaseEvent();
        }
       
       
        console.log(request)
        console.log(JSON.stringify(request))
    
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", job_request, true);
        xhr.setRequestHeader( "Content-Type", "application/json" );
        xhr.onload = async function() {
            if (xhr.status === 200 || xhr.status === 201) {
                //alert('Job status: ' + xhr.responseText);
                //await sleep(Math.random() * 1500); //just wait a little bit after displaying the movements...
                //display_element.innerHTML = ''; // clear the display
                console.log(xhr.responseText)
                ready = true;
                //jsPsych.finishTrial();
            } else {
                alert('Request failed. Returned status of ' + xhr.status);
            }
        };
        xhr.send(JSON.stringify(request));
        
    }
    
    plugin.prepareRobot = async function() {
        function sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        var proxy = "ALMotion"
        var job_request = "http://"+params.service_url+":"+params.service_port+"/do/"+proxy;
        
        var request = {};        
        
        var method = "rest"
        request["async"] = false;
        request["cmd"] = [method];
        
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", job_request, true);
        xhr.setRequestHeader( "Content-Type", "application/json" );
        
        xhr.onload = async function() {
            if (xhr.status === 200 || xhr.status === 201) {
                //alert('Job status: ' + xhr.responseText);
                //await sleep(Math.random() * 1500); //just wait a little bit after displaying the movements...
                //display_element.innerHTML = ''; // clear the display
                console.log(xhr.responseText)
                ready = true;
                //jsPsych.finishTrial();
            } else {
                alert('Request failed. Returned status of ' + xhr.status);
            }
        };
        
        xhr = new XMLHttpRequest();
        xhr.open("PUT", job_request, true);
        xhr.setRequestHeader( "Content-Type", "application/json" );
        xhr.send(JSON.stringify(request));    
        
        request = {};        
        method = "stiffnessInterpolation"
        request["async"] = false;
        request["cmd"] = [method];
        request["cmd"].push("Body");
        request["cmd"].push(0.5);
        request["cmd"].push(0.2);
        
        xhr = new XMLHttpRequest();
        xhr.open("PUT", job_request, true);
        xhr.setRequestHeader( "Content-Type", "application/json" );
        xhr.send(JSON.stringify(request));
    
        request = {};        
        method = "openHand"
        request["async"] = false;
        request["cmd"] = [method];
        request["cmd"].push("LHand")
        
        xhr = new XMLHttpRequest();
        xhr.open("PUT", job_request, true);
        xhr.setRequestHeader( "Content-Type", "application/json" );
        xhr.send(JSON.stringify(request));
    
        request = {};        
        method = "angleInterpolation"
        request["async"] = false;
        request["cmd"] = [method];
        request["cmd"].push(["LShoulderPitch", "LWristYaw"]);
        request["cmd"].push([[1.5], [1.65]]);
        request["cmd"].push([[0.8], [0.8]]);
        request["cmd"].push(true);
        
        xhr = new XMLHttpRequest();
        xhr.open("PUT", job_request, true);
        xhr.setRequestHeader( "Content-Type", "application/json" );
        xhr.send(JSON.stringify(request));
    
    }
    
    
    plugin.keyPressEvent = function() {
        var request = {};        
        
        var method = "angleInterpolation"
        request["async"] = false;
        request["cmd"] = [method];           
        
        request["cmd"].push("LElbowRoll");
        request["cmd"].push([[-0.8]]);
        
        request["cmd"].push([[0.2]]);      
        request["cmd"].push(true);
        
        return request;
    }
    
    plugin.keyReleaseEvent = function() {
        var request = {};        
        
        var method = "angleInterpolation"
        request["async"] = false;
        request["cmd"] = [method];           
        
        request["cmd"].push("LElbowRoll");
        request["cmd"].push([[-1.0]]);
        
        request["cmd"].push([[0.5]]);      
        request["cmd"].push(true);
        
        return request;
    }
    
    
    plugin.trial = async function(display_element, trial) {

        function sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        }

        //set default parameters. why does this not work via "default" value in parameters?
        trial.joblist = typeof trial.joblist == 'undefined' ? [] : trial.joblist;
        trial.service_url = typeof trial.service_url == 'undefined' ? "localhost" : trial.service_url;
        trial.service_port = typeof trial.service_port == 'undefined' ? "5000" : trial.service_port;
        trial.stream_url = typeof trial.stream_url == 'undefined' ? "localhost" : trial.stream_url;
        trial.stream_port = typeof trial.stream_port == 'undefined' ? "8080" : trial.stream_port;
        trial.stream_topic = typeof trial.stream_topic == 'undefined' ? "/jrd/image_raw" : trial.stream_topic;
        
        trial.choices = trial.choices || jsPsych.ALL_KEYS;
        trial.parameter = trial.parameter || 'default value';

        console.log(typeof trial.args)
        console.log(trial.args)
        console.log(typeof trial.args[0][0] === "string")

        // allow variables as functions
        // this allows any trial variable to be specified as a function
        // that will be evaluated when the trial runs. this allows users
        // to dynamically adjust the contents of a trial as a result
        // of other trials, among other uses. you can leave this out,
        // but in general it should be included
        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        var img_src_stream = '<img src=\'http://'+trial.stream_url+':'+trial.stream_port+'/stream?topic='+trial.stream_topic+'\'>'
        
        display_element.innerrHTML = ''; // clear the display
        display_element.innerHTML = img_src_stream
        
        var service_url = trial.service_url

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("success");
    //            document.getElementById("demo").innerHTML = myArr[0];
            }
        };

        xmlhttp.onload = function() {
            var responseText = xmlhttp.responseText;
            console.log(responseText);
            console.log(this.status); 
            console.log(this.readyState);
             // process the response.
        };
        xmlhttp.withCredentials = false;
        xmlhttp.onerror = function() {
          console.log('There was an error!');
        };

        var ironurl = 'http://iron:8080/api/json?pretty=true'

    //    console.log(xmlhttp.getAllResponseHeaders())

        //xmlhttp.send();
        var jobinfourl = 'http://iron:8080/view/ci-deploy-meka-minimal-sim-nightly/job/ros-waving_detection-kinetic-ci-deploy-meka-minimal-sim-nightly/lastBuild/api/json?pretty=true'
        var jobbuildurl = 'http://iron:8080/view/ci-deploy-meka-minimal-sim-nightly/job/ros-waving_detection-kinetic-ci-deploy-meka-minimal-sim-nightly/build?token=TESTTOKEN'
                
        if (trial.joblist.length != 0) {
        
            var client_url_put = "http://"+trial.service_url+":"+trial.service_port+"/joblist"
            console.log(client_url_put);
            client = new XMLHttpRequest();
            client.open("PUT", client_url_put, true);
            client.setRequestHeader( "Content-Type", "application/json" );
            client.send(trial.joblist)
            
            console.log(client.getAllResponseHeaders())
            console.log(trial.joblist);
        
            var jobs = JSON.parse(trial.joblist);

            for (var i = 0; i < jobs.length; i++) {
                var job_request = "http://"+trial.service_url+":"+trial.service_port+"/state/"+jobs[i]
                console.log(job_request)
                var xhr = new XMLHttpRequest();
                xhr.open('GET', job_request);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        alert('Job status: ' + xhr.responseText);
                    }
                    else {
                        alert('Request failed.  Returned status of ' + xhr.status);
                    }
                };
                xhr.send();
            }
            
            for (var i = 0; i < jobs.length; i++) {
                var request = '{"requested": "true", "started": "false", "stopped": "true"}'
                var job_request = "http://"+trial.service_url+":"+trial.service_port+"/state/"+jobs[i]
                
                console.log(job_request)
                var xhr = new XMLHttpRequest();
                xhr.open("PUT", job_request, true);
                xhr.setRequestHeader( "Content-Type", "application/json" );
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        alert('Job status: ' + xhr.responseText);
                    }
                    else {
                        alert('Request failed.  Returned status of ' + xhr.status);
                    }
                };
                xhr.send(request);
            }
        }
                    
        var method = trial.method;
        var args = trial.args;
        var proxy = trial.proxy;
        
        // curl -i -H 'Content-Type: application/json' -X PUT -d '{"cmd": ["goToPosture", "StandInit", 0.5], "async": "false"}' http://localhost:5000/do/ALRobotPosture
        var job_request = "http://"+trial.service_url+":"+trial.service_port+"/do/"+proxy;
        console.log(job_request)        
                
        var nr_args = 1
        
        if (typeof trial.args[0] === "object") { //object = array, string = no array
            nr_args = args.length   
        }      
        
        for (var j = 0; j < nr_args; j++) { //TODO: not done yet.
            var request = {};
        
            request["async"] = false;
            request["cmd"] = [method];           
            
            if (nr_args !== 1) {
                for (var i = 0; i < args[j].length; i++) {
                    request["cmd"].push(args[j][i]);
                }
            } else {
                for (var i = 0; i < args.length; i++) {
                    request["cmd"].push(args[i]);
                }
            }
            
            console.log(request)
            console.log(JSON.stringify(request))
            var ready = false
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", job_request, true);
            xhr.setRequestHeader( "Content-Type", "application/json" );
            xhr.onload = async function() {
                if (xhr.status === 200 || xhr.status === 201) {
                    //alert('Job status: ' + xhr.responseText);
                    await sleep(Math.random() * 1500); //just wait a little bit after displaying the movements...
                    display_element.innerHTML = ''; // clear the display
                    ready = true;
                    jsPsych.finishTrial();
                } else {
                    alert('Request failed. Returned status of ' + xhr.status);
                }
            };
            xhr.send(JSON.stringify(request));
            //while(!ready) { //TODO: not done yet.
            //    setTimeout(function(){ alert("Hello"); }, 3000);
            //};
        }
       
        
               
        var after_response = function(info) {

          display_element.innerHTML = ''; // clear the display
          display_element.innerHTML = img_src_stream

          var trialdata = {
            "rt": info.rt,
            "key_press": info.key
          }
    
        };
        
        


        jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: 'date',
            persist: false, //If false, then the keyboard listener will only trigger the first time a valid key is pressed. If true, then it will trigger every time a valid key is pressed until it is explicitly cancelled by 
            allow_held_key: false
          });
        
        // end trial
        //jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
